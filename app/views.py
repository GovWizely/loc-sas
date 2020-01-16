import calendar

from flask import g
from flask_appbuilder import aggregate_count, GroupByChartView, ModelView
from flask_appbuilder.models.sqla.filters import FilterEqualFunction
from flask_appbuilder.models.sqla.interface import SQLAInterface
from wtforms.validators import Email, NumberRange

from . import appbuilder, db
from .models import CopyrightApplication, date_today

LIST_APPLICATION_STATUS = [
    "primary_title",
    "created_on",
    "created_by.username",
    "application_status",
]

SHOW_APPLICATION_STATUS = LIST_APPLICATION_STATUS + ["file_name", "download"]


def get_user():
    return g.user


class CopyrightApplicationModelView(ModelView):
    datamodel = SQLAInterface(CopyrightApplication)
    list_columns = LIST_APPLICATION_STATUS
    validators_columns = {
        "correspondence_email": [Email()],
        "year_completed": [NumberRange(min=(date_today.year - 125), max=date_today.year)]
    }
    add_columns = [
        "primary_title",
        "alternate_title",
        "year_completed",
        "author_prefix",
        "author_first_name",
        "author_middle_name",
        "author_last_name",
        "author_suffix",
        "author_pseudonym",
        "author_anonymous",
        "author_citizenship",
        "author_domicile",
        "claimant_prefix",
        "claimant_first_name",
        "claimant_middle_name",
        "claimant_last_name",
        "claimant_suffix",
        "claimant_address",
        "claimant_address2",
        "claimant_city",
        "claimant_state",
        "claimant_postal_code",
        "claimant_country",
        "certificate_contact_prefix",
        "certificate_contact_first_name",
        "certificate_contact_middle_name",
        "certificate_contact_last_name",
        "certificate_contact_suffix",
        "certificate_contact_address",
        "certificate_contact_address2",
        "certificate_contact_city",
        "certificate_contact_state",
        "certificate_contact_postal_code",
        "certificate_contact_country",
        "correspondence_contact_prefix",
        "correspondence_contact_first_name",
        "correspondence_contact_middle_name",
        "correspondence_contact_last_name",
        "correspondence_contact_suffix",
        "correspondence_contact_address",
        "correspondence_contact_address2",
        "correspondence_contact_city",
        "correspondence_contact_state",
        "correspondence_contact_postal_code",
        "correspondence_contact_country",
        "possible_rights_and_permissions_prefix",
        "possible_rights_and_permissions_first_name",
        "possible_rights_and_permissions_middle_name",
        "possible_rights_and_permissions_last_name",
        "possible_rights_and_permissions_suffix",
        "possible_rights_and_permissions_address",
        "possible_rights_and_permissions_address2",
        "possible_rights_and_permissions_city",
        "possible_rights_and_permissions_state",
        "possible_rights_and_permissions_postal_code",
        "possible_rights_and_permissions_country",
        "correspondence_email",
        "correspondence_phone_number",
        "pdf",
        "service_request_id"
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
