import calendar

from flask import g
from flask_appbuilder import aggregate_count, GroupByChartView, ModelView
from flask_appbuilder.models.sqla.filters import FilterEqualFunction
from flask_appbuilder.models.sqla.interface import SQLAInterface

from . import appbuilder, db
from .models import CopyrightApplication, Organization

LIST_APPLICATION_STATUS = [
    "title",
    "created_on",
    "organization.name",
    "created_by.username",
    "application_status",
]

SHOW_APPLICATION_STATUS = LIST_APPLICATION_STATUS + ["file_name", "download"]


def get_user():
    return g.user


class CopyrightApplicationModelView(ModelView):
    datamodel = SQLAInterface(CopyrightApplication)
    list_columns = LIST_APPLICATION_STATUS
    add_columns = [
        "title",
        "organization",
        "pdf"
    ]
    show_columns = SHOW_APPLICATION_STATUS
    label_columns = {"download": "Download", "file_name": "File Name"}
    base_order = ("created_on", "desc")
    base_filters = [["created_by", FilterEqualFunction, get_user]]


class SuperUserCopyrightApplicationModelView(ModelView):
    datamodel = SQLAInterface(CopyrightApplication)
    list_columns = LIST_APPLICATION_STATUS
    edit_columns = [
        "application_status",
    ]
    label_columns = {'month_year': 'Month', 'year': 'Year', "download": "Download",
                     "file_name": "File Name"}
    show_columns = SHOW_APPLICATION_STATUS
    base_order = ("changed_on", "desc")


class OrganizationModelView(ModelView):
    datamodel = SQLAInterface(Organization)
    related_views = [CopyrightApplicationModelView]


def pretty_month_year(value):
    return calendar.month_name[value.month] + " " + str(value.year)


def pretty_year(value):
    return str(value.year)


class ApplicationTimeChartView(GroupByChartView):
    datamodel = SQLAInterface(CopyrightApplication)

    chart_title = "Applications by Date"
    chart_type = "AreaChart"
    label_columns = SuperUserCopyrightApplicationModelView.label_columns
    definitions = [
        {
            "group": "month_year",
            "formatter": pretty_month_year,
            "series": [(aggregate_count, "group")]
        },
        {
            "group": "year",
            "formatter": pretty_year,
            "series": [(aggregate_count, "group")],
        },
    ]


db.create_all()
appbuilder.add_view(
    OrganizationModelView,
    "List Organizations",
    icon="fa-folder-open-o",
    category="Copyright Applications",
    category_icon="fa-envelope",
)
appbuilder.add_separator("Copyright Applications")
appbuilder.add_view(
    CopyrightApplicationModelView, "List Copyright Applications", icon="fa-envelope",
    category="Copyright Applications"
)
appbuilder.add_view(
    SuperUserCopyrightApplicationModelView, "Admin List Copyright Applications", icon="fa-envelope",
    category="Copyright Applications"
)
appbuilder.add_view(
    ApplicationTimeChartView,
    "Applications by Date",
    icon="fa-dashboard",
    category="Copyright Applications"
)
