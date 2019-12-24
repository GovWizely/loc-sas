<template>
  <div>
    <h2 class="header-title">Create copyright applicaiton</h2>
    <form novalidate class="md-layout" @submit.prevent="validateCopyrightApplication">
      <md-card class="md-layout-item md-size-100">
        <md-card-content>
          <md-card>
            <md-card-header class="md-headline">Title</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('primaryTitle')">
                    <label for="primary-title">Primary Title</label>
                    <md-input
                      name="primary-title"
                      id="primary-title"
                      v-model="form.primaryTitle"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.primaryTitle.required"
                    >The primary title is required</span>
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
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('yearCompleted')">
                    <label for="year-completed">Year Completed</label>
                    <md-input
                      name="year-completed"
                      id="year-completed"
                      type="number"
                      v-model="form.yearCompleted"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.yearCompleted.required"
                    >The year completed is required</span>
                    <span
                      class="md-error"
                      v-else-if="!$v.form.yearCompleted.minValue"
                    >The year completed must be between 1894 and 2019</span>
                    <span
                      class="md-error"
                      v-else-if="!$v.form.yearCompleted.maxValue"
                    >The year completed must be between 1894 and 2019</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header class="md-headline">Author</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-autocomplete v-model="form.authorPrefix" :md-options="prefixes">
                    <label>Author Prefix</label>
                  </md-autocomplete>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('authorFirstName')">
                    <label for="author-first-name">Author First Name</label>
                    <md-input
                      name="author-first-name"
                      id="author-first-name"
                      autocomplete="given-name"
                      v-model="form.authorFirstName"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.authorFirstName.required"
                    >The author first name is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('authorLastName')">
                    <label for="author-last-name">Author Last Name</label>
                    <md-input
                      name="author-last-name"
                      id="author-last-name"
                      autocomplete="family-name"
                      v-model="form.authorLastName"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.authorLastName.required"
                    >The author last name is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-autocomplete v-model="form.authorSuffix" :md-options="suffixes">
                    <label>Author Suffix</label>
                  </md-autocomplete>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('authorCitizenship')">
                    <label for="author-citizenship">Author Citizenship</label>
                    <md-input
                      name="author-citizenship"
                      id="author-citizenship"
                      v-model="form.authorCitizenship"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.authorCitizenship.required"
                    >The author citizenship is required</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header class="md-headline">Claimant</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-autocomplete v-model="form.claimantPrefix" :md-options="prefixes">
                    <label>Claimant Prefix</label>
                  </md-autocomplete>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('claimantFirstName')">
                    <label for="claimant-first-name">Claimant First Name</label>
                    <md-input
                      name="claimant-first-name"
                      id="claimant-first-name"
                      v-model="form.claimantFirstName"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.claimantFirstName.required"
                    >The claimant first name is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('claimantLastName')">
                    <label for="claimant-first-name">Claimant Last Name</label>
                    <md-input
                      name="claimant-last-name"
                      id="claimant-last-name"
                      v-model="form.claimantLastName"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.claimantLastName.required"
                    >The claimant last name is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-autocomplete v-model="form.claimantSuffix" :md-options="suffixes">
                    <label>Claimant Suffix</label>
                  </md-autocomplete>
                </div>
              </div>
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header class="md-headline">Correspondence</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-autocomplete v-model="form.correspondenceContactPrefix" :md-options="prefixes">
                    <label>Correspondence Contact Prefix</label>
                  </md-autocomplete>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('correspondenceContactFirstName')">
                    <label for="correspondence_contact_first_name">Correspondence Contact First Name</label>
                    <md-input
                      name="correspondence_contact_first_name"
                      id="correspondence_contact_first_name"
                      v-model="form.correspondenceContactFirstName"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.correspondenceContactFirstName.required"
                    >The correspondence contact first name is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('correspondenceContactLastName')">
                    <label for="correspondence_contact_last_name">Correspondence Contact Last Name</label>
                    <md-input
                      name="correspondence_contact_last_name"
                      id="correspondence_contact_last_name"
                      v-model="form.correspondenceContactLastName"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.correspondenceContactLastName.required"
                    >The correspondence contact last name is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-autocomplete v-model="form.correspondenceContactSuffix" :md-options="suffixes">
                    <label>Correspondence Contact Suffix</label>
                  </md-autocomplete>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-20">
                  <md-field :class="getValidationClass('correspondencePhoneNumber')">
                    <label for="correspondence-phone-number">Correspondence Phone Number</label>
                    <md-input
                      name="correspondence-phone-number"
                      id="correspondence-phone-number"
                      autocomplete="tel"
                      v-model="form.correspondencePhoneNumber"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.correspondencePhoneNumber.required"
                    >The correspondence phone number is required</span>
                    <span
                      class="md-error"
                      v-else-if="!$v.form.correspondencePhoneNumber.isValidPhoneNumber"
                    >The correspondence phone number must be 10 digits</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-10">
                  <md-field>
                    <label for="correspondence-phone-number-extension">Ext.</label>
                    <md-input
                      name="correspondence-phone-number-extension"
                      id="correspondence-phone-number-extension"
                      autocomplete="tel"
                      type="number"
                      v-model="form.correspondencePhoneNumberExtension"
                      :disabled="sending"
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('correspondenceEmail')">
                    <label for="correspondence-email">Correspondence Email</label>
                    <md-input
                      type="email"
                      name="correspondence-email"
                      id="correspondence-email"
                      autocomplete="email"
                      v-model="form.correspondenceEmail"
                      :disabled="sending"
                      required
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.correspondenceEmail.required"
                    >The correspondence email is required</span>
                    <span class="md-error" v-else-if="$v.form.correspondenceEmail.email">Invalid email</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create</md-button>
        </md-card-actions>
      </md-card>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />

      <md-snackbar
        :md-active.sync="copyrightApplicationSaved"
      >{{ lastCopyrightApplication }} was saved with success!</md-snackbar>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  minValue,
  maxValue
} from 'vuelidate/lib/validators'
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/PhoneNumberFormatter'

export default {
  name: 'CreateCopyrightApplication',
  props: ['repository'],
  mixins: [validationMixin],
  data: () => ({
    form: {
      primaryTitle: null,
      alternateTitle: null,
      yearCompleted: null,
      authorPrefix: null,
      authorFirstName: null,
      authorLastName: null,
      authorSuffix: null,
      authorCitizenship: null,
      claimantPrefix: null,
      claimantFirstName: null,
      claimantLastName: null,
      claimantSuffix: null,
      correspondenceContactPrefix: null,
      correspondenceContactFirstName: null,
      correspondenceContactLastName: null,
      correspondenceContactSuffix: null,
      correspondenceEmail: null,
      correspondencePhoneNumber: null,
      correspondencePhoneNumberExtension: null
    },
    copyrightApplicationSaved: false,
    lastCopyrightApplication: null,
    sending: false,
    prefixes: ['Dr', 'Mr', 'Mrs', 'Ms'],
    suffixes: ['Jr', 'Sr', 'III', 'Esq', 'MD', 'PhD']
  }),
  validations: {
    form: {
      primaryTitle: {
        required
      },
      yearCompleted: {
        required,
        minValue: minValue(1894),
        maxValue: maxValue(2019)
      },
      authorFirstName: {
        required
      },
      authorLastName: {
        required
      },
      authorCitizenship: {
        required
      },
      claimantFirstName: {
        required
      },
      claimantLastName: {
        required
      },
      correspondenceContactFirstName: {
        required
      },
      correspondenceContactLastName: {
        required
      },
      correspondenceEmail: {
        required,
        email
      },
      correspondencePhoneNumber: {
        required,
        isValidPhoneNumber
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    clearForm () {
      this.$v.$reset()
      Object.keys(this.form).map(k => {
        this.form[k] = null
      })
    },
    async createCopyrightApplication () {
      this.sending = true
      this.lastCopyrightApplication = this.form.primaryTitle
      await this.repository._createCopyrightApplication(this.form)
      this.copyrightApplicationSaved = true
      this.sending = false
      this.clearForm()
    },
    async validateCopyrightApplication () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        await this.createCopyrightApplication()
      }
    }
  },
  updated () {
    this.form.correspondencePhoneNumber = formatPhoneNumber(this.form.correspondencePhoneNumber)
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

.md-card {
  margin: 14px;
}
</style>
