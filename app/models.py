import datetime

from flask import url_for
from flask_appbuilder import Model
from flask_appbuilder.filemanager import get_file_original_name
from flask_appbuilder.models.mixins import AuditMixin, FileColumn
from markupsafe import Markup
from sqlalchemy import Column, Enum, Integer, String

date_today = datetime.date.today()


class Organization(Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    def __repr__(self):
        return self.name


class CopyrightApplication(AuditMixin, Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(2000), nullable=False)
    alternative_title = Column(String(2000), nullable=True)
    year_completed = Column(String(150), nullable=False)
    author_prefix = Column(String(150), nullable=True)
    author_first_name = Column(String(255), nullable=False)
    author_middle_name = Column(String(255), nullable=True)
    author_last_name = Column(String(255), nullable=False)
    author_suffix = Column(String(50), nullable=True)
    author_pseudonym = Column(String(150), nullable=True)
    author_anonymous = Column(String(150), nullable=True)
    author_citizenship = Column(String(150), nullable=True)
    claimant_prefix = Column(String(150), nullable=True)
    claimant_first_name = Column(String(255), nullable=False)
    claimant_middle_name = Column(String(255), nullable=True)
    claimant_last_name = Column(String(255), nullable=False)
    claimant_suffix = Column(String(50), nullable=True)
    claimant_address = Column(String(150), nullable=False)
    claimant_alternative_address = Column(String(150), nullable=True)
    claimant_city = Column(String(150), nullable=False)
    claimant_state = Column(String(150), nullable=False)
    claimant_postal_code = Column(String(150), nullable=False)
    contact_prefix = Column(String(150), nullable=True)
    contact_first_name = Column(String(255), nullable=False)
    contact_middle_name = Column(String(255), nullable=True)
    contact_last_name = Column(String(255), nullable=False)
    contact_suffix = Column(String(50), nullable=True)
    contact_address = Column(String(150), nullable=False)
    contact_alternative_address = Column(String(150), nullable=True)
    contact_city = Column(String(150), nullable=False)
    contact_state = Column(String(150), nullable=False)
    contact_postal_code = Column(String(150), nullable=False)
    contact_2_prefix = Column(String(150), nullable=True)
    contact_2_first_name = Column(String(255), nullable=False)
    contact_2_middle_name = Column(String(255), nullable=True)
    contact_2_last_name = Column(String(255), nullable=False)
    contact_2_suffix = Column(String(50), nullable=True)
    contact_2_address = Column(String(150), nullable=False)
    contact_2_alternative_address = Column(String(150), nullable=True)
    contact_2_city = Column(String(150), nullable=False)
    contact_2_state = Column(String(150), nullable=False)
    contact_2_postal_code = Column(String(150), nullable=False)
    correspondence_email = Column(String(150), nullable=False)
    correspondence_phone_number = Column(String(150), nullable=False)
    application_status = Column(Enum("New", "Pending", "Approved"), default="New")
    pdf = Column(FileColumn, nullable=True)

    def __repr__(self):
        return self.title

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