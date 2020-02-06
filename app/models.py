import datetime

from flask_appbuilder import Model
from flask_appbuilder.models.mixins import AuditMixin
from sqlalchemy import Boolean, Column, Integer, String

date_today = datetime.date.today()


class CopyrightApplication(AuditMixin, Model):
    id = Column(Integer, primary_key=True)
    primary_title = Column(String(2000))
    alternate_title = Column(String(2000))
    year_completed = Column(Integer)
    author_prefix = Column(String(255))
    author_first_name = Column(String(255))
    author_middle_name = Column(String(255))
    author_last_name = Column(String(255))
    author_suffix = Column(String(255))
    author_pseudonym = Column(String(255))
    author_anonymous = Column(Boolean, default=False)
    author_citizenship = Column(String(255))
    author_domicile = Column(String(255))
    claimant_prefix = Column(String(255))
    claimant_first_name = Column(String(255))
    claimant_middle_name = Column(String(255))
    claimant_last_name = Column(String(255))
    claimant_suffix = Column(String(255))
    claimant_address = Column(String(255))
    claimant_address2 = Column(String(255))
    claimant_city = Column(String(255))
    claimant_state = Column(String(255))
    claimant_postal_code = Column(String(255))
    claimant_country = Column(String(255))
    certificate_contact_prefix = Column(String(255))
    certificate_contact_first_name = Column(String(255))
    certificate_contact_middle_name = Column(String(255))
    certificate_contact_last_name = Column(String(255))
    certificate_contact_suffix = Column(String(255))
    certificate_contact_address = Column(String(255))
    certificate_contact_address2 = Column(String(255))
    certificate_contact_city = Column(String(255))
    certificate_contact_state = Column(String(255))
    certificate_contact_postal_code = Column(String(255))
    certificate_contact_country = Column(String(255))
    correspondence_contact_prefix = Column(String(255))
    correspondence_contact_first_name = Column(String(255))
    correspondence_contact_middle_name = Column(String(255))
    correspondence_contact_last_name = Column(String(255))
    correspondence_contact_suffix = Column(String(255))
    correspondence_contact_address = Column(String(255))
    correspondence_contact_address2 = Column(String(255))
    correspondence_contact_city = Column(String(255))
    correspondence_contact_state = Column(String(255))
    correspondence_contact_postal_code = Column(String(255))
    correspondence_contact_country = Column(String(255))
    correspondence_email = Column(String(255))
    correspondence_phone_number = Column(String(255))
    correspondence_phone_number_extension = Column(Integer)
    possible_rights_and_permissions_prefix = Column(String(255))
    possible_rights_and_permissions_first_name = Column(String(255))
    possible_rights_and_permissions_middle_name = Column(String(255))
    possible_rights_and_permissions_last_name = Column(String(255))
    possible_rights_and_permissions_suffix = Column(String(255))
    possible_rights_and_permissions_address = Column(String(255))
    possible_rights_and_permissions_address2 = Column(String(255))
    possible_rights_and_permissions_city = Column(String(255))
    possible_rights_and_permissions_state = Column(String(255))
    possible_rights_and_permissions_postal_code = Column(String(255))
    possible_rights_and_permissions_country = Column(String(255))
    possible_rights_and_permissions_email = Column(String(255))
    possible_rights_and_permissions_phone_number = Column(String(255))
    possible_rights_and_permissions_phone_number_extension = Column(Integer)
    application_status = Column(String(25), nullable=False, default="draft")
    notes_to_usco = Column(String(2000))
    work_deposit_name = Column(String(255))
    work_deposit_url = Column(String(255))
    service_request_id = Column(String(255), nullable=False, unique=True)

    def __repr__(self):
        return self.primary_title

    def month_year(self):
        date = self.created_on
        return datetime.datetime(date.year, date.month, 1)

    def year(self):
        date = self.created_on
        return datetime.datetime(date.year, 1, 1)
