import datetime

from flask import url_for
from flask_appbuilder import Model
from flask_appbuilder.filemanager import get_file_original_name
from flask_appbuilder.models.mixins import AuditMixin, FileColumn
from markupsafe import Markup
from sqlalchemy import Column, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

date_today = datetime.date.today()


class Organization(Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    def __repr__(self):
        return self.name


class CopyrightApplication(AuditMixin, Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(150), nullable=False)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)
    organization = relationship("Organization")
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