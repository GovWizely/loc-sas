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
from app.models import Author, Claimant, CopyrightApplication
from . import appbuilder


def get_user():
    return g.user


class CopyrightApplicationApi(ModelRestApi):
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
        'authors',
        'claimants',
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


appbuilder.add_api(CopyrightApplicationApi)


class AuthorApi(ModelRestApi):
    resource_name = 'author'
    datamodel = SQLAInterface(Author)
    add_columns = [
        'copyright_application_id',
        'prefix',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'pseudonym',
        'citizenship',
        'year_of_birth',
        'year_of_death',
        'organization',
        'organization_name',
        'domicile'
    ]


appbuilder.add_api(AuthorApi)


class ClaimantApi(ModelRestApi):
    resource_name = 'claimant'
    datamodel = SQLAInterface(Claimant)
    add_columns = [
        'copyright_application_id',
        'organization',
        'organization_name',
        'prefix',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'address',
        'address2',
        'city',
        'state',
        'postal_code',
        'country',
    ]


appbuilder.add_api(ClaimantApi)


class CurrentUserApi(BaseApi):
    @expose('/current-user', methods=['GET'])
    @protect()
    def current_user(self):
        """An endpoint for returning the current user.
        ---
        get:
          responses:
            200:
              description: Returns the current user that is logged in
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                        user_id:
                            type: string
                        first_name:
                            type: string
                        last_name:
                            type: string
        """
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
    @expose('/generate-service-request', methods=['GET'])
    @protect()
    def generate_service_request(self):
        """An endpoint for generating a service request id.
        ---
        get:
          responses:
            200:
              description: Generates a service request id to be used when uploading a work deposit
                and submitting a copyright application
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: string
        """
        # TODO: This ID will eventually come from a different system
        return self.response(200, id=uuid.uuid1())


appbuilder.add_api(CopyrightApplicationServiceRequestApi)


class CopyrightApplicationFileApi(BaseApi):
    @expose('/file-upload', methods=['POST'])
    @protect()
    def upload_file(self):
        """An endpoint for uploading a work deposit.
        ---
        post:
          requestBody:
            content:
              multipart/form-data:
                schema:
                  type: object
                  properties:
                    filename:
                      type: array
                      items:
                        type: string
                        format: binary
          parameters:
          - in: path
            schema:
              type: string
            name: service_request_id
          responses:
            200:
              description: Uploads a file (work deposit) and returns it's URL
                to be used when submitting a copyright application
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      file_url:
                        type: string
        """
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
    @protect()
    def get_file(self, filename):
        """An endpoint for downloading a work deposit.
        ---
        get:
          parameters:
          - in: path
            schema:
              type: string
            name: filename
          responses:
            200:
              description: Downloads a file (work deposit)
        """
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


appbuilder.add_api(CopyrightApplicationFileApi)
