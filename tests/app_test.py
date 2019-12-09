from flask_testing import TestCase

from app import app as application


class AppTest(TestCase):

    def create_app(self):
        return application
