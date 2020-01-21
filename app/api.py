import uuid

from flask import g
from flask import session
from flask_appbuilder.api import BaseApi, expose, ModelRestApi
from flask_appbuilder.models.sqla.filters import FilterEqualFunction
from flask_appbuilder.models.sqla.interface import SQLAInterface

from app.models import CopyrightApplication, CopyrightApplicationDraft
from . import appbuilder


def get_user():
    return g.user


class CopyrightApplicationModelApi(ModelRestApi):
    resource_name = 'copyright_application'
    datamodel = SQLAInterface(CopyrightApplication)
    base_filters = [['created_by', FilterEqualFunction, get_user]]
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
        'claimant_address2',
        'claimant_city',
        'claimant_state',
        'claimant_postal_code',
        'claimant_country',
        'certificate_contact_prefix',
        'certificate_contact_first_name',
        'certificate_contact_middle_name',
        'certificate_contact_last_name',
        'certificate_contact_suffix',
        'certificate_contact_address',
        'certificate_contact_address2',
        'certificate_contact_city',
        'certificate_contact_state',
        'certificate_contact_postal_code',
        'certificate_contact_country',
        'correspondence_contact_prefix',
        'correspondence_contact_first_name',
        'correspondence_contact_middle_name',
        'correspondence_contact_last_name',
        'correspondence_contact_suffix',
        'correspondence_contact_address',
        'correspondence_contact_address2',
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
        'possible_rights_and_permissions_address2',
        'possible_rights_and_permissions_city',
        'possible_rights_and_permissions_state',
        'possible_rights_and_permissions_postal_code',
        'possible_rights_and_permissions_country',
        'correspondence_email',
        'correspondence_phone_number',
        'correspondence_phone_number_extension',
        'application_status',
        'pdf',
        'service_request_id'
    ]


appbuilder.add_api(CopyrightApplicationModelApi)


class CurrentUserApi(BaseApi):
    @expose('/current-user-id')
    def currentUser(self):
        try:
            return self.response(200, user_id=session["user_id"])
        except KeyError:
            return self.response(200, user_id=None)


appbuilder.add_api(CurrentUserApi)


class CopyrightApplicationDraftApi(ModelRestApi):
    resource_name = 'copyright_application_draft'
    datamodel = SQLAInterface(CopyrightApplicationDraft)
    add_columns = [
        'draft'
    ]
    base_filters = [['created_by', FilterEqualFunction, get_user]]
    base_order = ('id', 'desc')


appbuilder.add_api(CopyrightApplicationDraftApi)


class CopyrightApplicationServiceRequestApi(BaseApi):
    @expose('/generate-service-request')
    def generateServiceRequest(self):
        # TODO: This ID will eventually come from a different system
        return self.response(200, id=uuid.uuid1())


appbuilder.add_api(CopyrightApplicationServiceRequestApi)
