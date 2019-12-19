from flask_appbuilder.api import ModelRestApi
from flask_appbuilder.models.sqla.interface import SQLAInterface

from app.models import CopyrightApplication
from . import appbuilder


class CopyrightApplicationModelApi(ModelRestApi):
    resource_name = 'copyright_application'
    datamodel = SQLAInterface(CopyrightApplication)
    add_columns = [
        'primary_title',
        'author_prefix',
        'author_first_name',
        'author_middle_name',
        'author_suffix',
        'author_last_name',
        'year_completed',
        'application_status',
        'alternate_title',
        'author_pseudonym',
        'author_anonymous',
        'author_citizenship',
        'author_domicile',
        'claimant_prefix',
        'claimant_first_name',
        'claimant_middle_name',
        'claimant_last_name',
        'claimant_suffix',
        'claimant_address',
        'claimant_address_2',
        'claimant_city',
        'claimant_state',
        'claimant_postal_code',
        'claimant_country',
        'correspondence_contact_prefix',
        'correspondence_contact_first_name',
        'correspondence_contact_middle_name',
        'correspondence_contact_last_name',
        'correspondence_contact_suffix',
        'correspondence_contact_address',
        'correspondence_contact_address_2',
        'correspondence_contact_city',
        'correspondence_contact_state',
        'correspondence_contact_postal_code',
        'correspondence_contact_country',
        'possible_rights_and_permissions_prefix',
        'possible_rights_and_permissions_first_name',
        'possible_rights_and_permissions_middle_name',
        'possible_rights_and_permissions_last_name',
        'possible_rights_and_permissions_suffix',
        'possible_rights_and_permissions_address',
        'possible_rights_and_permissions_address_2',
        'possible_rights_and_permissions_city',
        'possible_rights_and_permissions_state',
        'possible_rights_and_permissions_postal_code',
        'possible_rights_and_permissions_country',
        'correspondence_email',
        'correspondence_phone_number',
        'application_status',
        'pdf'
    ]


appbuilder.add_api(CopyrightApplicationModelApi)
