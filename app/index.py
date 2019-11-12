from flask import g
from flask_appbuilder import IndexView


def get_user():
    return g.user


class CopyrightApplicationIndexView(IndexView):
    index_template = 'index.html'
