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
          <summary class="md-title">Work Details</summary>
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
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('yearCompleted')">
                <label for="year-completed" ref="yearCompleted">Year Completed (YYYY)</label>
                <md-input
                  name="year-completed"
                  id="year-completed"
                  type="number"
                  v-model.number="form.yearCompleted"
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
                >The year completed must be between {{minYearCompleted}} and {{currentYear}}</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('publicationDate')">
                <label for="publication-date" ref="publicationDate">Publication Date (MMDDYYYY)</label>
                <md-input
                  name="publication-date"
                  id="publication-date"
                  v-model="form.publicationDate"
                  :disabled="sending"
                  maxlength="8"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.publicationDate.mmddyyyy"
                >The publication date must be valid and formatted as MMDDYYYY</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.publicationDate.withinLast95years"
                >The work must have been published within the last 95 years</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.publicationDate.afterYearCompleted"
                >The publication year can not be earlier than the year completed</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.publicationDate.onOrBeforeToday"
                >The work must have been published prior to today</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100" ref="publicationCountry">
              <copyright-select-field
                v-model="form.publicationCountry"
                name="publication-country"
                label="Nation of First Publication"
                :disabled="sending"
              />
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Upload</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
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
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-progress-bar v-if="uploadingWorkDeposit" md-mode="indeterminate"></md-progress-bar>
              <div v-if="form.workDepositUrl && !uploadingWorkDeposit" class="uploaded-work-deposits">
                <a class="field-label" @click="downloadWorkDeposit(form.workDepositUrl, form.workDepositName)">
                  {{form.workDepositName}}
                </a>
              </div>
            </div>
          </div>
        </details>
        <div v-for="(author, index) in form.authors" :key="'author_'+author.id">
          <author-form
            :id="'author-'+author.id"
            :ref="'authorForm'+index"
            v-model="form.authors[index]"
            :sending="sending"
            :deleteFn="deleteAuthor"
            :hideDelete="index === 0"
          />
        </div>
        <md-button class="md-raised md-accent add-btn" @click="addAuthor">Add Author</md-button>
        <div v-for="(claimant, index) in form.claimants" :key="'claimant_'+claimant.id">
          <claimant-form
            :id="'claimant-'+claimant.id"
            :ref="'claimantForm'+index"
            v-model="form.claimants[index]"
            :sending="sending"
            :deleteFn="deleteClaimant"
            :hideDelete="index === 0"
          />
        </div>
        <md-button class="md-raised md-accent add-btn" @click="addClaimant">Add Claimant</md-button>
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
                <label for="possible-rights-and-permissions-organization-name">Organization Name</label>
                <md-input
                  name="possible-rights-and-permissions-organization-name"
                  id="possible-rights-and-permissions-organization-name"
                  v-model="form.possibleRightsAndPermissionsOrganizationName"
                  :disabled="sending"
                  maxlength="255"
                />
              </md-field>
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
                  type="number"
                  autocomplete="tel"
                  v-model.number="form.possibleRightsAndPermissionsPhoneNumberExtension"
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
import { mmddyyyy, empty } from '@/utils/ValidationHelpers'
import { removeNonIso8895 } from '@/utils/InvalidCharacters'
import CopyrightApplicationReview from '@/views/CopyrightApplicationReview'
import CopyrightSelectField from '@/views/CopyrightSelectField'
import AuthorForm from '@/views/AuthorForm'
import ClaimantForm from '@/views/ClaimantForm'
import moment from 'moment'

let currentYear = moment().year()
let minYearCompleted = currentYear - 125

export default {
  name: 'CreateCopyrightApplication',
  props: ['repository'],
  mixins: [validationMixin],
  components: {
    'copyright-application-review': CopyrightApplicationReview,
    'copyright-select-field': CopyrightSelectField,
    'author-form': AuthorForm,
    'claimant-form': ClaimantForm
  },
  data: () => ({
    minYearCompleted,
    currentYear,
    form: {
      id: null,
      primaryTitle: null,
      alternateTitle: null,
      yearCompleted: null,
      publicationDate: null,
      publicationCountry: null,
      workDepositName: null,
      workDepositUrl: null,
      domicile: null,
      authors: [],
      claimants: [],
      possibleRightsAndPermissionOrganizationName: null,
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
    uploadingWorkDeposit: false,
    workPublished: false
  }),
  async created () {
    const applicationId = parseInt(this.$route.query['id'])
    if (applicationId) {
      const draft = await this.repository._getCopyrightApplication(applicationId)
      Object.keys(this.form).forEach(k => { this.form[k] = draft[k] })
      this.form.id = applicationId
    } else {
      this.form.serviceRequestId = await this.repository._generateServiceRequest()
      const application = await this.repository._saveCopyrightApplication(this.form)
      this.form.id = application.id
      await this.addAuthor()
      await this.addClaimant()
    }

    this.loading = false
  },
  validations () {
    return {
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
          maxValue: maxValue(currentYear)
        },
        publicationDate: {
          mmddyyyy: mmddyyyy,
          withinLast95years: (publicationDate) => {
            if (!empty(publicationDate)) {
              let currentPubicationDate = moment(publicationDate, 'MMDDYYYY')
              let earliestPublicationDate = moment().subtract(95, 'year').subtract(1, 'day')
              return currentPubicationDate.isSameOrAfter(earliestPublicationDate)
            } else {
              return true
            }
          },
          afterYearCompleted: (publicationDate) => {
            if (!empty(publicationDate) && !empty(this.form.yearCompleted)) {
              return (parseInt(publicationDate.substring(4, 8)) >= this.form.yearCompleted)
            } else {
              return true
            }
          },
          onOrBeforeToday: (publicationDate) => {
            return (!empty(publicationDate))
              ? moment(publicationDate, 'MMDDYYYY').isSameOrBefore(moment())
              : true
          }
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
      let authorSectionInvalid = this.validateForm('authorForm')
      let claimantSectionInvalid = this.validateForm('claimantForm')
      if (!this.$v.$invalid && !authorSectionInvalid && !claimantSectionInvalid) {
        this.reviewCopyrightApplication = true
        window.scrollTo(0, 0)
      } else {
        this.scrollToInvalidField()
      }
    },
    validateForm (formName) {
      let invalid = false
      Object.keys(this.$refs).forEach(k => {
        if (k.startsWith(formName) && this.$refs[k][0]) {
          this.$refs[k][0].validate()
          if (this.$refs[k][0].invalid && !invalid) {
            invalid = true
          }
        }
      })
      return invalid
    },
    validateField (field) {
      if (this.$v.form[field]) {
        this.customValidationFields[field].invalid = this.$v.form[field].$invalid
      }
    },
    async saveDraft () {
      this.savingDraft = true
      await this.repository._saveCopyrightApplication(this.form)
      this.savingDraft = false
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
    async onWorkDepositsSelection (files) {
      const formData = new FormData()
      if (!files.length) return
      Array
        .from(Array(files.length).keys())
        .map(x => {
          this.form.workDepositName = files[x].name
          formData.append('file', files[x])
        })
      this.uploadingWorkDeposit = true
      const fileUrl = await this.repository._uploadFile(formData, this.form.serviceRequestId)
      this.form.workDepositUrl = fileUrl
      await this.saveDraft()
      this.uploadingWorkDeposit = false
    },
    async downloadWorkDeposit (url, fileName) {
      await this.repository._downloadFile(url, fileName)
    },
    async addAuthor () {
      const newAuthor = await this.repository._saveAuthor(this.form.id, {})
      this.form.authors.push(newAuthor)
    },
    deleteAuthor (id) {
      this.repository._deleteAuthor(id)
      this.form.authors = this.form.authors.filter(a => a.id !== id)
    },
    deleteClaimant (id) {
      this.repository._deleteClaimant(id)
      this.form.claimants = this.form.claimants.filter(c => c.id !== id)
    },
    async addClaimant () {
      const newClaimant = await this.repository._saveClaimant(this.form.id, {})
      this.form.claimants.push(newClaimant)
    }
  },
  updated () {
    Object.keys(this.form).forEach(k => {
      if (k === 'possibleRightsAndPermissionsPhoneNumber') {
        this.form[k] = formatPhoneNumber(this.form[k])
      } else {
        this.form[k] = removeNonIso8895(this.form[k])
      }
    })
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

.name-field {
  display: flex;
}

.name-field .field-label {
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

a.field-label {
  cursor: pointer;
}

.add-btn {
  margin-bottom: 25px;
}
</style>
