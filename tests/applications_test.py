from tests.app_test import AppTest

from app import appbuilder, db


def login(client, username, password):
    return client.post('/login', data=dict(
        username=username,
        password=password
    ), follow_redirects=True)


def logout(client):
    return client.get('/logout', follow_redirects=True)


class ApplicationsTest(AppTest):
    def __init__(self, methodName='runTest'):
        super().__init__(methodName)
        db.create_all()
        role_user = appbuilder.sm.find_role("User")
        appbuilder.sm.add_user("user1", "user1", "test", "user1@example.org", role_user, "password")

    def test_login_logout(self):
        """Make sure login and logout works."""
        rv = login(self.client, "user1", "password")
        assert b'Welcome user1 test' in rv.data

        rv = logout(self.client)
        assert b'Copyright Application Demo' in rv.data
        assert b'Welcome user1 test' not in rv.data

        rv = login(self.client, "wrong", "password")
        assert b'Invalid login. Please try again.' in rv.data

        rv = login(self.client, "user1", "wrong")
        assert b'Invalid login. Please try again.' in rv.data
