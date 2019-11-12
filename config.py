import os

basedir = os.path.abspath(os.path.dirname(__file__))

CSRF_ENABLED = True
SECRET_KEY = "\2\1thisismyscretkey\1\2\e\y\y\h"

OPENID_PROVIDERS = [
    {"name": "Google", "url": "https://www.google.com/accounts/o8/id"},
    {"name": "Yahoo", "url": "https://me.yahoo.com"},
    {"name": "AOL", "url": "http://openid.aol.com/<username>"},
    {"name": "Flickr", "url": "http://www.flickr.com/<username>"},
    {"name": "MyOpenID", "url": "https://www.myopenid.com"},
]

SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "app.db")
# SQLALCHEMY_DATABASE_URI = 'mysql://root:password@localhost/quickhowto'
# SQLALCHEMY_DATABASE_URI = 'postgresql://scott:tiger@localhost:5432/myapp'
# SQLALCHEMY_ECHO = True

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
# AUTH_LDAP_SERVER = "ldap://dc.domain.net"
# AUTH_LDAP_USE_TLS = False
AUTH_ROLE_ADMIN = "Admin"
AUTH_ROLE_PUBLIC = "Public"
APP_NAME = "LOC SAS"
APP_THEME = ""  # default
# APP_THEME = "spacelab.css"
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
    ],
    "Admin": [
        [ADMIN_ACCESS, ".*"]
    ]
}
