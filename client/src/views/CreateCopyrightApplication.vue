<template>
  <div>
    <div class="header">
      <div class="header-row-1">
        <h1
          class="title"
        >New Copyright Application for non-fiction literary work #{{this.form.serviceRequestId}}</h1>
        <span v-if="savingDraft" class="draft-message">Saving draft...</span>
        <button v-else class="secondary-button" @click="saveAndClose">Save &amp; return to home page</button>
      </div>
    </div>
    <form
      novalidate
      class="md-layout"
      @submit.prevent="validateCopyrightApplication"
      @change="saveDraft"
      v-if="!loading && !reviewCopyrightApplication"
    >
      <div class="md-layout-item md-size-80 form">
        <span class="md-subheader">* Required fields</span>
        <details open>
          <summary class="md-title">Title</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('primaryTitle')">
                <label for="primary-title" ref="primaryTitle">Primary Title</label>
                <md-input
                  name="primary-title"
                  id="primary-title"
                  v-model="form.primaryTitle"
                  :disabled="sending"
                  required
                  @blur="validateField('primaryTitle')"
                  md-counter="2000"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.primaryTitle.required"
                >The primary title is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.primaryTitle.maxLength"
                >The primary title max length is 2000 characters</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('alternateTitle')">
                <label for="alternate-title">Alternate Title</label>
                <md-input
                  name="alternate-title"
                  id="alternate-title"
                  v-model="form.alternateTitle"
                  :disabled="sending"
                  @blur="validateField('alternateTitle')"
                  md-counter="2000"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.alternateTitle.maxLength"
                >The alternate title max length is 2000 characters</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('yearCompleted')">
                <label for="year-completed" ref="yearCompleted">Year Completed</label>
                <md-input
                  name="year-completed"
                  id="year-completed"
                  type="number"
                  v-model="form.yearCompleted"
                  :disabled="sending"
                  required
                  @blur="validateField('yearCompleted')"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.yearCompleted.required"
                >The year completed is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.yearCompleted.minValue || !$v.form.yearCompleted.maxValue"
                >The year completed must be between {{minYearCompleted}} and {{maxYearCompleted}}</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Upload</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-85">
              <md-field :class="getValidationClass('workDepositUrl')">
                <label ref="workDepositUrl">Work Deposit (.pdf)</label>
                <md-file
                  required
                  accept="application/pdf"
                  @change="onWorkDepositsSelection($event.target.files)"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.workDepositUrl.required"
                >The work deposit is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-5">
              <md-button
                :disabled="uploadingWorkDeposit"
                class="md-primary"
                @click="uploadWorkDeposits()"
              >Upload</md-button>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-progress-bar v-if="uploadingWorkDeposit" md-mode="indeterminate"></md-progress-bar>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <div v-if="form.workDepositUrl" class="uploaded-work-deposits">
                <a class="field-label" :href="form.workDepositUrl">{{form.workDepositName}}</a>
              </div>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Author</summary>
          <div class="author-name">
            <label class="field-label">
              Name *
              <md-tooltip
                md-direction="right"
              >First name &amp; last name or pseudonym is required</md-tooltip>
            </label>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
              <copyright-select-field
                v-model="form.authorPrefix"
                name="author-prefix"
                label="Prefix"
                :disabled="sending"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('authorFirstName')">
                <label for="author-first-name" ref="authorFirstName">First Name</label>
                <md-input
                  name="author-first-name"
                  id="author-first-name"
                  v-model="form.authorFirstName"
                  :disabled="sending"
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="customValidationFields.authorFirstName.invalid"
                >{{customValidationFields.authorFirstName.message}}</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="author-middle-name">Middle Name</label>
                <md-input
                  name="author-middle-name"
                  id="author-middle-name"
                  v-model="form.authorMiddleName"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('authorLastName')">
                <label for="author-last-name" ref="authorLastName">Last Name</label>
                <md-input
                  name="author-last-name"
                  id="author-last-name"
                  v-model="form.authorLastName"
                  :disabled="sending"
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="customValidationFields.authorLastName.invalid"
                >{{customValidationFields.authorLastName.message}}</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <copyright-select-field
                v-model="form.authorSuffix"
                name="author-suffix"
                label="Suffix"
                :disabled="sending"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('authorPseudonym')">
                <label for="author-pseudonym" ref="authorPseudonym">Pseudonym</label>
                <md-input
                  name="author-pseudonym"
                  id="author-pseudonym"
                  v-model="form.authorPseudonym"
                  :disabled="sending"
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="customValidationFields.authorPseudonym.invalid"
                >{{customValidationFields.authorPseudonym.message}}</span>
              </md-field>
            </div>
          </div>
          <label class="field-label">
            Citizenship/Domicile *
            <md-tooltip md-direction="right">Citizenship or domicile is required</md-tooltip>
          </label>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100" ref="authorCitizenship">
              <copyright-select-field
                v-model="form.authorCitizenship"
                name="author-citizenship"
                label="Citizenship"
                :disabled="sending"
                :validationClass="getValidationClass('authorCitizenship')"
                :displayRequiredError="customValidationFields.authorCitizenship.invalid"
                errorMessage="'The author citizenship or domicile is required'"
              />
            </div>
            <div class="or">- or -</div>
            <div class="md-layout-item md-small-size-100" ref="authorDomicile">
               <copyright-select-field
                v-model="form.authorDomicile"
                name="author-domicile"
                label="Domicile"
                :disabled="sending"
                :validationClass="getValidationClass('authorDomicile')"
                :displayRequiredError="customValidationFields.authorDomicile.invalid"
                errorMessage="The author citizenship or domicile is required"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('authorYearOfBirth')">
                <label for="author-year-of-birth" ref="authorYearOfBirth">Year of Birth</label>
                <md-input
                  name="author-year-of-birth"
                  id="author-year-of-birth"
                  type="number"
                  v-model="form.authorYearOfBirth"
                  :disabled="sending"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.authorYearOfBirth.minValue || !$v.form.authorYearOfBirth.maxValue"
                >The year of birth must be between {{minAuthorYearOfBirth}} and {{maxAuthorYearOfBirth}}</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Claimant</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
              <copyright-select-field
                v-model="form.claimantPrefix"
                name="claimant-prefix"
                label="Prefix"
                :disabled="sending"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('claimantFirstName')">
                <label for="claimant-first-name" ref="claimantFirstName">First Name</label>
                <md-input
                  name="claimant-first-name"
                  id="claimant-first-name"
                  v-model="form.claimantFirstName"
                  :disabled="sending"
                  required
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantFirstName.required"
                >The claimant first name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="claimant-middle-name">Middle Name</label>
                <md-input
                  name="claimant-middle-name"
                  id="claimant-middle-name"
                  v-model="form.claimantMiddleName"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('claimantLastName')">
                <label for="claimant-first-name" ref="claimantLastName">Last Name</label>
                <md-input
                  name="claimant-last-name"
                  id="claimant-last-name"
                  v-model="form.claimantLastName"
                  :disabled="sending"
                  required
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantLastName.required"
                >The claimant last name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <copyright-select-field
                v-model="form.claimantSuffix"
                name="claimant-suffix"
                label="Suffix"
                :disabled="sending"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('claimantAddress')">
                <label for="claimant-address" ref="claimantAddress">Address</label>
                <md-input
                  name="claimant-address"
                  id="claimant-address"
                  v-model="form.claimantAddress"
                  :disabled="sending"
                  required
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantAddress.required"
                >The claimant address is required</span>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="claimant-address2">Address 2</label>
                <md-input
                  name="claimant-address2"
                  id="claimant-address2"
                  v-model="form.claimantAddress2"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-20">
              <md-field :class="getValidationClass('claimantCity')">
                <label for="claimant-city" ref="claimantCity">City</label>
                <md-input
                  name="claimant-city"
                  id="claimant-city"
                  v-model="form.claimantCity"
                  :disabled="sending"
                  required
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantCity.required"
                >The claimant city is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-20" ref="claimantState">
              <copyright-select-field
                v-model="form.claimantState"
                name="claimant-state"
                label="State"
                required="true"
                :disabled="sending"
                :validationClass="getValidationClass('claimantState')"
                :displayRequiredError="!$v.form.claimantState.required"
                errorMessage="The claimant state is required"
              />
            </div>
            <div class="md-layout-item md-size-20">
              <md-field :class="getValidationClass('claimantPostalCode')">
                <label for="claimant-postal-code" ref="claimantPostalCode">Postal Code</label>
                <md-input
                  name="claimant-postal-code"
                  id="claimant-postal-code"
                  v-model="form.claimantPostalCode"
                  :disabled="sending"
                  required
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantPostalCode.required"
                >The claimant postal code is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100" ref="claimantCountry">
              <copyright-select-field
                v-model="form.claimantCountry"
                name="claimant-country"
                label="Country"
                required="true"
                :disabled="sending"
                :validationClass="getValidationClass('claimantCountry')"
                :displayRequiredError="!$v.form.claimantCountry.required"
                errorMessage="The claimant country is required"
              />
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Rights &amp; Permissions</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
              <copyright-select-field
                v-model="form.possibleRightsAndPermissionsPrefix"
                name="possible-rights-and-permissions-prefix"
                label="Prefix"
                :disabled="sending"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-first-name">First Name</label>
                <md-input
                  name="possible-rights-and-permissions-first-name"
                  id="possible-rights-and-permissions-first-name"
                  v-model="form.possibleRightsAndPermissionsFirstName"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-middle-name">Middle Name</label>
                <md-input
                  name="possible-rights-and-permissions-middle-name"
                  id="possible-rights-and-permissions-middle-name"
                  v-model="form.possibleRightsAndPermissionsMiddleName"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-last-name">Last Name</label>
                <md-input
                  name="possible-rights-and-permissions-last-name"
                  id="possible-rights-and-permissions-last-name"
                  v-model="form.possibleRightsAndPermissionsLastName"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <copyright-select-field
                v-model="form.possibleRightsAndPermissionsSuffix"
                name="possible-rights-and-permissions-suffix"
                label="Suffix"
                :disabled="sending"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-address">Address</label>
                <md-input
                  name="possible-rights-and-permissions-address"
                  id="possible-rights-and-permissions-address"
                  v-model="form.possibleRightsAndPermissionsAddress"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-address2">Address 2</label>
                <md-input
                  name="possible-rights-and-permissions-address2"
                  id="possible-rights-and-permissions-address2"
                  v-model="form.possibleRightsAndPermissionsAddress2"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-20">
              <md-field>
                <label for="possible-rights-and-permissions-city">City</label>
                <md-input
                  name="possible-rights-and-permissions-city"
                  id="possible-rights-and-permissions-city"
                  v-model="form.possibleRightsAndPermissionsCity"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-size-20">
              <copyright-select-field
                v-model="form.possibleRightsAndPermissionsState"
                name="possible-rights-and-permissions-state"
                label="State"
                :disabled="sending"
              />
            </div>
            <div class="md-layout-item md-size-20">
              <md-field>
                <label for="possible-rights-and-permissions-postal-code">Postal Code</label>
                <md-input
                  name="possible-rights-and-permissions-postal-code"
                  id="possible-rights-and-permissions-postal-code"
                  v-model="form.possibleRightsAndPermissionsPostalCode"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <copyright-select-field
                v-model="form.possibleRightsAndPermissionsCountry"
                name="possible-rights-and-permissions-country"
                label="Country"
                :disabled="sending"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-60">
              <md-field :class="getValidationClass('possibleRightsAndPermissionsPhoneNumber')">
                <label
                  for="possible-rights-and-permissions-phone-number"
                  ref="possibleRightsAndPermissionsPhoneNumber"
                >Phone Number</label>
                <md-input
                  name="possible-rights-and-permissions-phone-number"
                  id="possible-rights-and-permissions-phone-number"
                  autocomplete="tel"
                  v-model="form.possibleRightsAndPermissionsPhoneNumber"
                  :disabled="sending"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.possibleRightsAndPermissionsPhoneNumber.isValidPhoneNumber"
                >The Possible Rights and Permissions phone number must be 10 digits</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-30">
              <md-field>
                <label for="possible-rights-and-permissions-phone-number-extension">Ext.</label>
                <md-input
                  name="possible-rights-and-permissions-phone-number-extension"
                  id="possible-rights-and-permissions-phone-number-extension"
                  autocomplete="tel"
                  type="number"
                  v-model="form.possibleRightsAndPermissionsPhoneNumberExtension"
                  :disabled="sending"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('possibleRightsAndPermissionsEmail')">
                <label
                  for="possible-rights-and-permissions-email"
                  ref="possibleRightsAndPermissionsEmail"
                >Email</label>
                <md-input
                  type="email"
                  name="possible-rights-and-permissions-email"
                  id="possible-rights-and-permissions-email"
                  autocomplete="email"
                  v-model="form.possibleRightsAndPermissionsEmail"
                  :disabled="sending"
                  maxlength="255"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.possibleRightsAndPermissionsEmail.email"
                >Invalid email</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Notes to USCO</summary>
          <md-field :class="getValidationClass('notesToUsco')">
            <label ref="notesToUsco">Notes</label>
            <md-textarea v-model="form.notesToUsco" md-counter="2000" />
            <span
              class="md-error"
              v-if="!$v.form.notesToUsco.maxLength"
            >The USCO notes max length is 2000 characters</span>
          </md-field>
        </details>
        <div class="form-actions">
          <md-button class="md-raised md-accent" type="submit">Next</md-button>
        </div>
      </div>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </form>
    <copyright-application-review
      v-if="!sending && !loading && reviewCopyrightApplication"
      :application="form"
      :show="reviewCopyrightApplication"
      :close="closeFormReview"
      :submit="createCopyrightApplication"
    />
    <div v-if="loading" class="loading-message">
      <span class="md-subheading">loading...</span>
    </div>
    <md-dialog-alert
      class="error"
      :md-active.sync="errorOccured"
      md-title="Error Occured!"
      :md-content="errorMessage"
    />
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  minValue,
  maxValue,
  maxLength
} from 'vuelidate/lib/validators'
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/PhoneNumberFormatter'
import { replaceNonIso8895 } from '@/utils/ISO8895-15validator'
import { empty } from '@/utils/ValidationHelpers'
import CopyrightApplicationReview from './CopyrightApplicationReview'
import CopyrightSelectField from './CopyrightSelectField'

let d = new Date()
let maxYearCompleted = d.getFullYear()
let minYearCompleted = maxYearCompleted - 125
let maxAuthorYearOfBirth = maxYearCompleted
let minAuthorYearOfBirth = maxAuthorYearOfBirth - 225

export default {
  name: 'CreateCopyrightApplication',
  props: ['repository'],
  mixins: [validationMixin],
  components: {
    'copyright-application-review': CopyrightApplicationReview,
    'copyright-select-field': CopyrightSelectField
  },
  data: () => ({
    minYearCompleted,
    maxYearCompleted,
    minAuthorYearOfBirth,
    maxAuthorYearOfBirth,
    form: {
      id: null,
      primaryTitle: null,
      alternateTitle: null,
      yearCompleted: null,
      workDepositName: null,
      workDepositUrl: null,
      authorPrefix: null,
      authorFirstName: null,
      authorMiddleName: null,
      authorLastName: null,
      authorSuffix: null,
      authorPseudonym: null,
      authorCitizenship: null,
      authorDomicile: null,
      authorYearOfBirth: null,
      claimantPrefix: null,
      claimantFirstName: null,
      claimantMiddleName: null,
      claimantLastName: null,
      claimantSuffix: null,
      claimantAddress: null,
      claimantAddress2: null,
      claimantCity: null,
      claimantState: null,
      claimantPostalCode: null,
      claimantCountry: null,
      possibleRightsAndPermissionsPrefix: null,
      possibleRightsAndPermissionsFirstName: null,
      possibleRightsAndPermissionsMiddleName: null,
      possibleRightsAndPermissionsLastName: null,
      possibleRightsAndPermissionsSuffix: null,
      possibleRightsAndPermissionsAddress: null,
      possibleRightsAndPermissionsAddress2: null,
      possibleRightsAndPermissionsCity: null,
      possibleRightsAndPermissionsState: null,
      possibleRightsAndPermissionsPostalCode: null,
      possibleRightsAndPermissionsCountry: null,
      possibleRightsAndPermissionsPhoneNumber: null,
      possibleRightsAndPermissionsPhoneNumberExtension: null,
      possibleRightsAndPermissionsEmail: null,
      notesToUsco: null,
      serviceRequestId: null,
      applicationStatus: 'draft'
    },
    customValidationFields: {
      primaryTitle: {
        invalid: false
      },
      alternateTitle: {
        invalid: false
      },
      yearCompleted: {
        invalid: false
      },
      authorCitizenship: {
        invalid: false
      },
      authorDomicile: {
        invalid: false
      },
      authorFirstName: {
        invalid: false,
        message: null
      },
      authorLastName: {
        invalid: false,
        message: null
      },
      authorPseudonym: {
        invalid: false,
        message: null
      }
    },
    copyrightApplicationSaved: false,
    lastCopyrightApplication: '',
    sending: false,
    errorOccured: false,
    errorMessage: null,
    reviewCopyrightApplication: false,
    savingDraft: false,
    loading: true,
    workDepositsFormData: null,
    uploadingWorkDeposit: false
  }),
  async created () {
    const applicationId = parseInt(this.$route.query['id'])
    if (applicationId) {
      const draft = await this.repository._getCopyrightApplication(applicationId)
      Object.keys(this.form).forEach(k => { this.form[k] = draft[k] })
      this.form.id = applicationId
    } else {
      this.form.serviceRequestId = await this.repository._generateServiceRequest()
      this.saveDraft()
    }
    this.loading = false
  },
  validations: {
    form: {
      primaryTitle: {
        required,
        maxLength: maxLength(2000)
      },
      alternateTitle: {
        maxLength: maxLength(2000)
      },
      yearCompleted: {
        required,
        minValue: minValue(minYearCompleted),
        maxValue: maxValue(maxYearCompleted)
      },
      authorYearOfBirth: {
        minValue: minValue(minAuthorYearOfBirth),
        maxValue: maxValue(maxAuthorYearOfBirth)
      },
      claimantFirstName: {
        required
      },
      claimantLastName: {
        required
      },
      claimantAddress: {
        required
      },
      claimantCity: {
        required
      },
      claimantState: {
        required
      },
      claimantPostalCode: {
        required
      },
      claimantCountry: {
        required
      },
      possibleRightsAndPermissionsEmail: {
        email
      },
      possibleRightsAndPermissionsPhoneNumber: {
        isValidPhoneNumber
      },
      notesToUsco: {
        maxLength: maxLength(2000)
      },
      workDepositUrl: {
        required
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      let field

      field = this.customValidationFields[fieldName]
      if (field && field.invalid) {
        return {
          'md-invalid': true
        }
      }

      field = this.$v.form[fieldName]
      if (field && field.$invalid && field.$dirty) {
        return {
          'md-invalid': true
        }
      }
    },
    clearForm () {
      this.$v.$reset()

      Object.keys(this.form).map(k => {
        typeof this.form[k] === 'boolean' ? this.form[k] = false : this.form[k] = null
      })

      Object.keys(this.customValidationFields).map(k => {
        this.customValidationFields[k].invalid = false
      })
    },
    async createCopyrightApplication () {
      this.sending = true
      this.lastCopyrightApplication = this.form.primaryTitle
      this.form.applicationStatus = 'under_review'
      const response = await this.repository._saveCopyrightApplication(this.form)
      if (response.error) {
        this.errorOccured = true
        this.errorMessage = response.error
      } else {
        this.copyrightApplicationSaved = true
        this.clearForm()
        this.$router.push({ name: 'Home' }).catch(_ => {})
      }

      this.sending = false
    },
    async validateCopyrightApplication () {
      this.$v.$touch()
      this.updateCustomValidations()

      if (!this.$v.$invalid && !this.invalidCustomValidationFields()) {
        this.reviewCopyrightApplication = true
        window.scrollTo(0, 0)
      } else {
        this.scrollToInvalidField()
      }
    },
    validateField (field) {
      if (!this.$v.form[field]) {
        this.updateCustomValidations()
      } else {
        this.customValidationFields[field].invalid = this.$v.form[field].$invalid
      }
    },
    async saveDraft () {
      this.savingDraft = true
      const application = await this.repository._saveCopyrightApplication(this.form)
      if (application.id) { this.form.id = application.id }
      this.savingDraft = false
    },
    saveDraftWatchFn (oldVal, newVal) {
      if (oldVal !== newVal) this.saveDraft()
    },
    async saveAndClose () {
      await this.saveDraft()
      this.$router.push({ name: 'Home' }).catch(_ => {})
    },
    scrollToInvalidField () {
      const fields = Object.keys(this.form)
      for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
        if ((this.$v.form[field] && this.$v.form[field].$invalid) ||
            (this.customValidationFields[field] && this.customValidationFields[field].invalid)) {
          let element = this.$refs[field]
          element.scrollIntoView()
          break
        }
      }
    },
    closeFormReview () {
      this.reviewCopyrightApplication = false
    },
    updateCustomValidations () {
      if (empty(this.form.authorCitizenship) && empty(this.form.authorDomicile)) {
        this.customValidationFields.authorCitizenship.invalid = true
        this.customValidationFields.authorDomicile.invalid = true
      } else {
        this.customValidationFields.authorCitizenship.invalid = false
        this.customValidationFields.authorDomicile.invalid = false
      }

      if (empty(this.form.authorPseudonym) && empty(this.form.authorFirstName) && empty(this.form.authorLastName)) {
        this.customValidationFields.authorFirstName.invalid = true
        this.customValidationFields.authorLastName.invalid = true
        this.customValidationFields.authorPseudonym.invalid = true
        this.customValidationFields.authorFirstName.message = 'First name & last name or pseudonym is required'
        this.customValidationFields.authorLastName.message = 'First name & last name or pseudonym is required'
        this.customValidationFields.authorPseudonym.message = 'First name & last name or pseudonym is required'
      } else if (empty(this.form.authorFirstName) && !empty(this.form.authorLastName)) {
        this.customValidationFields.authorFirstName.invalid = true
        this.customValidationFields.authorFirstName.message = 'First name is required when last name is populated'
        this.customValidationFields.authorLastName.invalid = false
        this.customValidationFields.authorLastName.message = null
      } else if (!empty(this.form.authorFirstName) && empty(this.form.authorLastName)) {
        this.customValidationFields.authorFirstName.invalid = false
        this.customValidationFields.authorFirstName.message = null
        this.customValidationFields.authorLastName.invalid = true
        this.customValidationFields.authorLastName.message = 'Last name is required when first name is populated'
      } else {
        this.customValidationFields.authorFirstName.invalid = false
        this.customValidationFields.authorLastName.invalid = false
        this.customValidationFields.authorPseudonym.invalid = false
      }
    },
    invalidCustomValidationFields () {
      const fields = Object.keys(this.customValidationFields)
      for (let i = 0; i < fields.length; i++) {
        if (this.customValidationFields[fields[i]].invalid) {
          return true
        }
      }
      return false
    },
    onWorkDepositsSelection (files) {
      const formData = new FormData()
      if (!files.length) return
      Array
        .from(Array(files.length).keys())
        .map(x => {
          this.form.workDepositName = files[x].name
          formData.append('file', files[x])
        })

      this.workDepositsFormData = formData
    },
    async uploadWorkDeposits () {
      this.uploadingWorkDeposit = true
      const fileUrl = await this.repository._uploadFile(this.workDepositsFormData, this.form.serviceRequestId)
      this.form.workDepositUrl = fileUrl
      this.uploadingWorkDeposit = false
      this.saveDraft()
    }
  },
  updated () {
    this.form.possibleRightsAndPermissionsPhoneNumber = formatPhoneNumber(this.form.possibleRightsAndPermissionsPhoneNumber)
    Object.keys(this.form).forEach(k => { this.form[k] = replaceNonIso8895(this.form[k]) })
  },
  watch: {
    'form.authorPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.authorSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.claimantPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.claimantSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.possibleRightsAndPermissionsPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.possibleRightsAndPermissionsSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) }
  }
}
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.form {
  margin: auto;
}

.draft-message {
  padding-top: 12px;
}

.loading-message {
  display: flex;
  justify-content: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.author-name {
  display: flex;
}

.author-name .field-label {
  padding-top: 12px;
}

.md-progress-bar {
  position: relative;
  margin: 24px;
}

.uploaded-work-deposits {
  display: flex;
  justify-content: center;
}

.or {
  padding-top: 28px;
}
</style>
