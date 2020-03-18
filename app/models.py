import datetime

from flask_appbuilder import Model
from flask_appbuilder.models.mixins import AuditMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

date_today = datetime.date.today()

assoc_copyright_application_author = Table(
                                        'copyright_application_author',
                                        Model.metadata,
                                        Column('id', Integer, primary_key=True),
                                        Column(
                                            'copyright_application_id',
                                            Integer,
                                            ForeignKey('copyright_application.id')
                                        ),
                                        Column('author_id', Integer, ForeignKey('author.id'))
                                    )

assoc_copyright_application_claimant = Table(
                                        'copyright_application_claimant',
                                        Model.metadata,
                                        Column('id', Integer, primary_key=True),
                                        Column(
                                            'copyright_application_id',
                                            Integer,
                                            ForeignKey('copyright_application.id')
                                        ),
                                        Column('claimant_id', Integer, ForeignKey('claimant.id'))
                                    )


class CopyrightApplication(AuditMixin, Model):
    id = Column(Integer, primary_key=True)
    primary_title = Column(String(2000))
    alternate_title = Column(String(2000))
    year_completed = Column(Integer)
    publication_date = Column(String(8))
    publication_country = Column(String(255))
    authors = relationship(
        'Author',
        secondary=assoc_copyright_application_author,
        backref='CopyrightApplication'
    )
    claimants = relationship(
        'Claimant',
        secondary=assoc_copyright_application_claimant,
        backref='CopyrightApplication'
    )
    possible_rights_and_permissions_organization_name = Column(String(255))
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


class Author(Model):
    id = Column(Integer, primary_key=True)
    copyright_application_id = Column(
        Integer,
        ForeignKey('copyright_application.id'), nullable=False
    )
    copyright_application = relationship("CopyrightApplication")
    prefix = Column(String(255))
    first_name = Column(String(255))
    middle_name = Column(String(255))
    last_name = Column(String(255))
    suffix = Column(String(255))
    pseudonym = Column(String(255))
    citizenship = Column(String(255))
    year_of_birth = Column(Integer)
    year_of_death = Column(Integer)
    organization = Column(Boolean)
    organization_name = Column(String(255))
    domicile = Column(String(255))


class Claimant(Model):
    id = Column(Integer, primary_key=True)
    copyright_application_id = Column(
        Integer,
        ForeignKey('copyright_application.id'), nullable=False
    )
    copyright_application = relationship("CopyrightApplication")
    organization = Column(Boolean)
    organization_name = Column(String(255))
    prefix = Column(String(255))
    first_name = Column(String(255))
    middle_name = Column(String(255))
    last_name = Column(String(255))
    suffix = Column(String(255))
    address = Column(String(255))
    address2 = Column(String(255))
    city = Column(String(255))
    state = Column(String(255))
    postal_code = Column(String(255))
    country = Column(String(255))
