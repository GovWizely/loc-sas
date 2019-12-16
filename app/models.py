import datetime

from flask import url_for
from flask_appbuilder import Model
from flask_appbuilder.filemanager import get_file_original_name
from flask_appbuilder.models.mixins import AuditMixin, FileColumn
from markupsafe import Markup
from sqlalchemy import Column, Enum, Integer, String

date_today = datetime.date.today()


class CopyrightApplication(AuditMixin, Model):
    id = Column(Integer, primary_key=True)
    name_prefix = ("Dr", "Mr", "Mrs", "Ms", "")
    name_suffix = ("Jr", "Sr", "III", "Esq", "MD", "PhD", "")
    primary_title = Column(String(2000), nullable=False)
    alternate_title = Column(String(2000), nullable=True)
    year_completed = Column(Integer, nullable=False)
    author_prefix = Column(Enum(*name_prefix), default="")
    author_first_name = Column(String(255), nullable=False)
    author_middle_name = Column(String(255), nullable=True)
    author_last_name = Column(String(255), nullable=False)
    author_suffix = Column(Enum(*name_suffix), default="")
    author_pseudonym = Column(String(150), nullable=True)
    author_anonymous = Column(String(150), nullable=True)
    author_citizenship = Column(String(150), nullable=False)
    author_domicile = Column(String(150), nullable=True)
    claimant_prefix = Column(Enum(*name_prefix), default="")
    claimant_first_name = Column(String(255), nullable=False)
    claimant_middle_name = Column(String(255), nullable=True)
    claimant_last_name = Column(String(255), nullable=False)
    claimant_suffix = Column(Enum(*name_suffix), default="")
    claimant_address = Column(String(150), nullable=False)
    claimant_address_2 = Column(String(150), nullable=True)
    claimant_city = Column(String(150), nullable=False)
    claimant_state = Column(String(150), nullable=False)
    claimant_postal_code = Column(String(150), nullable=False)
    claimant_country = Column(String(150), nullable=False)
    correspondence_contact_prefix = Column(Enum(*name_prefix), default="")
    correspondence_contact_first_name = Column(String(255), nullable=False)
    correspondence_contact_middle_name = Column(String(255), nullable=True)
    correspondence_contact_last_name = Column(String(255), nullable=False)
    correspondence_contact_suffix = Column(Enum(*name_suffix), default="")
    correspondence_contact_address = Column(String(150), nullable=False)
    correspondence_contact_address_2 = Column(String(150), nullable=True)
    correspondence_contact_city = Column(String(150), nullable=False)
    correspondence_contact_state = Column(String(150), nullable=False)
    correspondence_contact_postal_code = Column(String(150), nullable=False)
    correspondence_contact_country = Column(String(150), nullable=False)
    possible_rights_and_permissions_prefix = Column(Enum(*name_prefix), default="")
    possible_rights_and_permissions_first_name = Column(String(255), nullable=True)
    possible_rights_and_permissions_middle_name = Column(String(255), nullable=True)
    possible_rights_and_permissions_last_name = Column(String(255), nullable=True)
    possible_rights_and_permissions_suffix = Column(Enum(*name_suffix), default="")
    possible_rights_and_permissions_address = Column(String(150), nullable=True)
    possible_rights_and_permissions_address_2 = Column(String(150), nullable=True)
    possible_rights_and_permissions_city = Column(String(150), nullable=True)
    possible_rights_and_permissions_state = Column(String(150), nullable=True)
    possible_rights_and_permissions_postal_code = Column(String(150), nullable=True)
    possible_rights_and_permissions_country = Column(String(150), nullable=True)
    correspondence_email = Column(String(255), nullable=False)
    correspondence_phone_number = Column(String(150), nullable=False)
    application_status = Column(Enum("New", "Pending", "Approved"), default="New")
    pdf = Column(FileColumn, nullable=True)

    def __repr__(self):
        return self.primary_title

    def month_year(self):
        date = self.created_on
        return datetime.datetime(date.year, date.month, 1)

    def year(self):
        date = self.created_on
        return datetime.datetime(date.year, 1, 1)

    def download(self):
        return Markup(
            '<a href="'
            + url_for("CopyrightApplicationModelView.download", filename=str(self.pdf))
            + '">Download</a>'
        )

    def file_name(self):
        return get_file_original_name(str(self.pdf))
