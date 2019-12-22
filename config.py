import os
import sys

basedir = os.path.abspath(os.path.dirname(__file__))

CSRF_ENABLED = True
SECRET_KEY = "thisismysecretkey"

OPENID_PROVIDERS = [
    {"name": "Google", "url": "https://www.google.com/accounts/o8/id"},
    {"name": "Yahoo", "url": "https://me.yahoo.com"},
    {"name": "MyOpenID", "url": "https://www.myopenid.com"},
]


BABEL_DEFAULT_LOCALE = "en"
BABEL_DEFAULT_FOLDER = "translations"
LANGUAGES = {
    "en": {"flag": "gb", "name": "English"}
}

# ------------------------------
# GLOBALS FOR GENERAL APP's
# ------------------------------
UPLOAD_FOLDER = basedir + "/app/static/uploads/"
IMG_UPLOAD_FOLDER = basedir + "/app/static/uploads/"
IMG_UPLOAD_URL = "/static/uploads/"
AUTH_TYPE = 1
AUTH_ROLE_ADMIN = "Admin"
AUTH_ROLE_PUBLIC = "Public"
APP_NAME = "LOC SAS"
APP_THEME = ""  # default
USER_FORBIDDEN = ['Admin',
                  'Security',
                  'List Organizations',
                  'CopyrightApplicationModelView',
                  'Applications by Date']
USER_ACCESS = f"^(?!({'|'.join(USER_FORBIDDEN)}))"
ADMIN_ACCESS = "^(?!List Copyright Applications)"
FAB_ROLES = {
    "User": [
        [USER_ACCESS, ".*"],
        ["CopyrightApplicationModelView", "can_list"],
        ["CopyrightApplicationModelView", "can_show"],
        ["CopyrightApplicationModelView", "can_add"],
        ["CopyrightApplicationModelView", "can_download"],
    ],
    "Admin": [
        [ADMIN_ACCESS, ".*"]
    ]
}


if "pytest" in sys.modules:
    # Bcrypt algorithm hashing rounds (reduced for testing purposes only!)
    BCRYPT_LOG_ROUNDS = 4

    # Enable the TESTING flag to disable the error catching during request handling
    # so that you get better error reports when performing test requests against the application.
    TESTING = True

    # Disable CSRF tokens in the Forms (only valid for testing purposes!)
    WTF_CSRF_ENABLED = False
    sqlite_file_name = "test.db"


if 'RDS_HOSTNAME' in os.environ:
    rds_host = os.environ['RDS_HOSTNAME']
    rds_user = os.environ['RDS_USERNAME']
    rds_pw = os.environ['RDS_PASSWORD']
    rds_port = os.environ['RDS_PORT']
    rds_db = os.environ['RDS_DB_NAME']
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{rds_user}:{rds_pw}@{rds_host}:{rds_port}/{rds_db}'
    AUTH_DB = rds_pw
else:
    sqlite_file_name = "app.db"
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, sqlite_file_name)

SQLALCHEMY_TRACK_MODIFICATIONS = False
FAB_API_SWAGGER_UI = True
