import pytest

from app import appbuilder
from tests.app_test import AppTest

USER = "test_user"
PASSWORD = "password"


def login(client, username, password):
    return client.post('/login', data=dict(
        username=username,
        password=password
    ), follow_redirects=True)


def logout(client):
    return client.get('/logout', follow_redirects=True)


class ApplicationsTest(AppTest):
    @pytest.fixture(autouse=True, scope="class")
    def _add_user(self):
        role_user = appbuilder.sm.find_role("User")
        appbuilder.sm.add_user(USER, USER, "Lastname", "foo@example.org", role_user, PASSWORD)

    def test_login_logout(self):
        """Make sure login and logout works."""
        rv = login(self.client, USER, PASSWORD)
        assert b'Welcome test_user Lastname' in rv.data

        rv = logout(self.client)
        assert b'Copyright Application Demo' in rv.data

        rv = login(self.client, "wrong", PASSWORD)
        assert b'Invalid login. Please try again.' in rv.data

        rv = login(self.client, USER, "wrong")
        assert b'Invalid login. Please try again.' in rv.data

    def test_application_process(self):
        login(self.client, USER, PASSWORD)
        rv = self.client.get('/copyrightapplicationmodelview/add')
        assert b'Add Copyright Application' in rv.data

        rv = self.client.post('/copyrightapplicationmodelview/add', data=dict(
            title="My Title",
            year_completed="2000",
            author_first_name="John",
            author_last_name="Smith",
            claimant_first_name="John",
            claimant_last_name="Smith",
            claimant_address="123 Main St",
            claimant_city="Anytown",
            claimant_state="MD",
            claimant_postal_code="20759",
            contact_first_name="John",
            contact_last_name="Smith",
            contact_address="123 Main St",
            contact_city="Anytown",
            contact_state="MD",
            contact_postal_code="20759",
            contact_2_first_name="Jane",
            contact_2_last_name="Doe",
            contact_2_address="456 Other St",
            contact_2_city="Othertown",
            contact_2_state="MD",
            contact_2_postal_code="20760",
            correspondence_email="john@smith.info",
            correspondence_phone_number="202-555-1212"
        ), follow_redirects=True)
        assert b'Added Row' in rv.data
        assert b'List Copyright Application' in rv.data

        rv = self.client.get('/copyrightapplicationmodelview/list/')
        assert b'My Title' in rv.data

        rv = self.client.get('/copyrightapplicationmodelview/show/1')
        assert b'Show Copyright Application' in rv.data
        assert b'My Title' in rv.data
        assert b'New' in rv.data
