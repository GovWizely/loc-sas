import datetime

from flask_appbuilder import Model
from flask_appbuilder.models.mixins import AuditMixin
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

    def __repr__(self):
        return self.title

    def month_year(self):
        date = self.created_on
        return datetime.datetime(date.year, date.month, 1)

    def year(self):
        date = self.created_on
        return datetime.datetime(date.year, 1, 1)
