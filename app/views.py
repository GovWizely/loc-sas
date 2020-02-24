import calendar

from flask import g
from flask_appbuilder import aggregate_count, GroupByChartView, ModelView
from flask_appbuilder.models.sqla.filters import FilterEqualFunction
from flask_appbuilder.models.sqla.interface import SQLAInterface
from wtforms.validators import NumberRange

from . import appbuilder, db
from .models import CopyrightApplication, date_today

LIST_APPLICATION_STATUS = [
    "primary_title",
    "created_on",
    "created_by.username",
    "application_status",
]

SHOW_APPLICATION_STATUS = LIST_APPLICATION_STATUS + ["work_deposit_name", "work_deposit_url"]


def get_user():
    return g.user


class CopyrightApplicationModelView(ModelView):
    datamodel = SQLAInterface(CopyrightApplication)
    list_columns = LIST_APPLICATION_STATUS
    validators_columns = {
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
        "author_citizenship",
        "author_year_of_birth",
        "author_organization",
        "author_organization_name",
        "domicile",
        "claimant_organization",
        "claimant_organization_name",
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
        'possible_rights_and_permissions_email',
        'possible_rights_and_permissions_phone_number',
        'possible_rights_and_permissions_phone_number_extension',
        "work_deposit_name",
        "work_deposit_url",
        "service_request_id",
        "notes_to_usco"
    ]
    show_columns = SHOW_APPLICATION_STATUS
    label_columns = {
        "work_deposit_name": "Work Deposit Name",
        "work_deposit_url": "Work Deposit URL"
    }
    base_order = ("created_on", "desc")
    base_filters = [["created_by", FilterEqualFunction, get_user]]


class SuperUserCopyrightApplicationModelView(ModelView):
    datamodel = SQLAInterface(CopyrightApplication)
    list_columns = LIST_APPLICATION_STATUS
    edit_columns = [
        "application_status",
    ]
    label_columns = {'month_year': 'Month', 'year': 'Year', "work_deposit_url": "Work Deposit URL",
                     "work_deposit_name": "Work Deposit Name"}
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
