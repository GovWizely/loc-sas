import logging
import os
import uuid

import boto3
from botocore.exceptions import ClientError
from config import S3_BUCKET
from flask import g
from flask import request, send_from_directory
from flask_appbuilder.api import BaseApi, expose, ModelRestApi
from flask_appbuilder.models.sqla.filters import FilterEqualFunction
from flask_appbuilder.models.sqla.interface import SQLAInterface
from flask_appbuilder.security.decorators import protect
from werkzeug.utils import secure_filename

from app import app
from app.models import CopyrightApplication
from . import appbuilder


def get_user():
    return g.user


class CopyrightApplicationModelApi(ModelRestApi):
    resource_name = 'copyright_application'
    datamodel = SQLAInterface(CopyrightApplication)
    base_filters = [['created_by', FilterEqualFunction, get_user]]
    base_order = ('created_on', 'desc')
    add_columns = [
        'primary_title',
        'alternate_title',
        'year_completed',
        'publication_date',
        'publication_country',
        'author_prefix',
        'author_first_name',
        'author_middle_name',
        'author_last_name',
        'author_suffix',
        'author_pseudonym',
        'author_citizenship',
        'author_year_of_birth',
        'author_year_of_death',
        'author_organization',
        'author_organization_name',
        'domicile',
        'claimant_organization',
        'claimant_organization_name',
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
        'possible_rights_and_permissions_organization_name',
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
        'possible_rights_and_permissions_email',
        'possible_rights_and_permissions_phone_number',
        'possible_rights_and_permissions_phone_number_extension',
        'application_status',
        'work_deposit_name',
        'work_deposit_url',
        'service_request_id',
        'notes_to_usco'
    ]


appbuilder.add_api(CopyrightApplicationModelApi)


class CurrentUserApi(BaseApi):
    @expose('/current-user')
    @protect()
    def current_user(self):
        try:
            user = get_user()
            user_id = user.username
            first_name = user.first_name
            last_name = user.last_name
            return self.response(200, user={
                'user_id': user_id,
                'first_name': first_name,
                'last_name': last_name
                })
        except KeyError:
            return self.response(200, user=None)


appbuilder.add_api(CurrentUserApi)


class CopyrightApplicationServiceRequestApi(BaseApi):
    @expose('/generate-service-request')
    def generate_service_request(self):
        # TODO: This ID will eventually come from a different system
        return self.response(200, id=uuid.uuid1())


appbuilder.add_api(CopyrightApplicationServiceRequestApi)


class CopyrightApplicationFileApi(BaseApi):
    @expose('/file-upload', methods=['POST'])
    def upload_file(self):
        service_request_id = request.args.get('service_request_id')
        file = request.files['file']
        filename = secure_filename(service_request_id + '_' + file.filename)
        fullpath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(fullpath)

        if S3_BUCKET:
            bucket = S3_BUCKET
            s3_client = boto3.client('s3')
            try:
                s3_client.upload_file(fullpath, bucket, filename)
            except ClientError as e:
                logging.error(e)
                return False
            finally:
                os.remove(fullpath)
            return self.response(
                201,
                file_url=f's3://{bucket}/{filename}')

        return self.response(
            201,
            file_url='/api/v1/copyrightapplicationfileapi/file-download/' + filename)

    @expose("/file-download/<filename>")
    def get_file(self, filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


appbuilder.add_api(CopyrightApplicationFileApi)
