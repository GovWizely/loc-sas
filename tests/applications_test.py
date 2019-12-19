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
            primary_title="My Title",
            year_completed="2000",
            author_prefix="Mr",
            author_first_name="John",
            author_last_name="Smith",
            author_suffix="Jr",
            author_citizenship="Canada",
            claimant_prefix="Mrs",
            claimant_first_name="John",
            claimant_last_name="Smith",
            claimant_suffix="Sr",
            claimant_address="123 Main St",
            claimant_city="Anytown",
            claimant_state="MD",
            claimant_postal_code="20759",
            claimant_country="Canada",
            correspondence_contact_prefix="Ms",
            correspondence_contact_first_name="John",
            correspondence_contact_last_name="Smith",
            correspondence_contact_suffix="III",
            correspondence_contact_address="123 Main St",
            correspondence_contact_city="Anytown",
            correspondence_contact_state="MD",
            correspondence_contact_postal_code="20759",
            correspondence_contact_country="Canada",
            possible_rights_and_permissions_prefix="Dr",
            possible_rights_and_permissions_first_name="Jane",
            possible_rights_and_permissions_last_name="Doe",
            possible_rights_and_permissions_suffix="MD",
            possible_rights_and_permissions_address="456 Other St",
            possible_rights_and_permissions_city="Othertown",
            possible_rights_and_permissions_state="MD",
            possible_rights_and_permissions_postal_code="20760",
            possible_rights_and_permissions_country="Canada",
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
