<template>
  <div>
    <div class="name-field">
      <label class="field-label">
        Name *
        <md-tooltip md-direction="right">First name &amp; last name or pseudonym is required</md-tooltip>
      </label>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-10">
        <copyright-select-field
          v-model="form.tmpAuthorPrefix"
          name="author-prefix"
          label="Prefix"
          :disabled="sending"
          @input="updateField()"
        />
      </div>
      <div class="md-layout-item md-small-size-100" ref="tmpAuthorFirstName">
        <md-field :class="getValidationClass('tmpAuthorFirstName')">
          <label for="author-first-name">First Name</label>
          <md-input
            name="author-first-name"
            id="author-first-name"
            v-model="form.tmpAuthorFirstName"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="customValidationFields.tmpAuthorFirstName.invalid"
          >{{customValidationFields.tmpAuthorFirstName.message}}</span>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100">
        <md-field>
          <label for="author-middle-name">Middle Name</label>
          <md-input
            name="author-middle-name"
            id="author-middle-name"
            v-model="form.tmpAuthorMiddleName"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100" ref="tmpAuthorLastName">
        <md-field :class="getValidationClass('tmpAuthorLastName')">
          <label for="author-last-name">Last Name</label>
          <md-input
            name="author-last-name"
            id="author-last-name"
            v-model="form.tmpAuthorLastName"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="customValidationFields.tmpAuthorLastName.invalid"
          >{{customValidationFields.tmpAuthorLastName.message}}</span>
        </md-field>
      </div>
      <div class="md-layout-item md-size-10">
        <copyright-select-field
          v-model="form.tmpAuthorSuffix"
          name="author-suffix"
          label="Suffix"
          :disabled="sending"
          @input="updateField()"
        />
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100" ref="tmpAuthorPseudonym">
        <md-field :class="getValidationClass('tmpAuthorPseudonym')">
          <label for="author-pseudonym">Pseudonym</label>
          <md-input
            name="author-pseudonym"
            id="author-pseudonym"
            v-model="form.tmpAuthorPseudonym"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="customValidationFields.tmpAuthorPseudonym.invalid"
          >{{customValidationFields.tmpAuthorPseudonym.message}}</span>
        </md-field>
      </div>
    </div>
    <label class="field-label">
      Citizenship/Domicile *
      <md-tooltip md-direction="right">Citizenship or domicile is required</md-tooltip>
    </label>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100" ref="tmpAuthorCitizenship">
        <copyright-select-field
          v-model="form.tmpAuthorCitizenship"
          name="author-citizenship"
          label="Citizenship"
          :disabled="sending"
          :validationClass="getValidationClass('tmpAuthorCitizenship')"
          :displayRequiredError="customValidationFields.tmpAuthorCitizenship.invalid"
          errorMessage="'The author citizenship or domicile is required'"
          @input="updateField()"
        />
      </div>
      <div class="or">- or -</div>
      <div class="md-layout-item md-small-size-100" ref="tmpDomicile">
        <copyright-select-field
          v-model="form.tmpDomicile"
          name="domicile"
          label="Domicile"
          :disabled="sending"
          :validationClass="getValidationClass('tmpDomicile')"
          :displayRequiredError="customValidationFields.tmpDomicile.invalid"
          errorMessage="The author citizenship or domicile is required"
          @input="updateField()"
        />
      </div>
      <div class="md-layout-item md-small-size-100" ref="tmpAuthorYearOfBirth">
        <md-field :class="getValidationClass('tmpAuthorYearOfBirth')">
          <label for="author-year-of-birth">Year of Birth</label>
          <md-input
            name="author-year-of-birth"
            id="author-year-of-birth"
            type="number"
            v-model="form.tmpAuthorYearOfBirth"
            :disabled="sending"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.tmpAuthorYearOfBirth.minValue || !$v.form.tmpAuthorYearOfBirth.maxValue"
          >The year of birth must be between {{minAuthorYearOfBirth}} and {{maxAuthorYearOfBirth}}</span>
        </md-field>
      </div>
    </div>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { minValue, maxValue } from 'vuelidate/lib/validators'
import { empty } from '@/utils/ValidationHelpers'
import CopyrightSelectField from '@/views/CopyrightSelectField'

let d = new Date()
let maxYearCompleted = d.getFullYear()
let maxAuthorYearOfBirth = maxYearCompleted
let minAuthorYearOfBirth = maxAuthorYearOfBirth - 225

export default {
  name: 'IndividualForm',
  props: ['value', 'sending'],
  mixins: [validationMixin],
  components: {
    'copyright-select-field': CopyrightSelectField
  },
  created () {
    this.form.tmpAuthorPrefix = this.value.authorPrefix
    this.form.tmpAuthorFirstName = this.value.authorFirstName
    this.form.tmpAuthorMiddleName = this.value.authorMiddleName
    this.form.tmpAuthorLastName = this.value.authorLastName
    this.form.tmpAuthorSuffix = this.value.authorSuffix
    this.form.tmpAuthorPseudonym = this.value.authorPseudonym
    this.form.tmpAuthorCitizenship = this.value.authorCitizenship
    this.form.tmpDomicile = this.value.domicile
    this.form.tmpAuthorYearOfBirth = this.value.authorYearOfBirth
  },
  data: () => ({
    minAuthorYearOfBirth,
    maxAuthorYearOfBirth,
    form: {
      tmpAuthorPrefix: null,
      tmpAuthorFirstName: null,
      tmpAuthorMiddleName: null,
      tmpAuthorLastName: null,
      tmpAuthorSuffix: null,
      tmpAuthorPseudonym: null,
      tmpAuthorCitizenship: null,
      tmpDomicile: null,
      tmpAuthorYearOfBirth: null
    },
    customValidationFields: {
      invalid: false,
      tmpAuthorCitizenship: {
        invalid: false
      },
      tmpDomicile: {
        invalid: false
      },
      tmpAuthorFirstName: {
        invalid: false,
        message: null
      },
      tmpAuthorLastName: {
        invalid: false,
        message: null
      },
      tmpAuthorPseudonym: {
        invalid: false,
        message: null
      }
    }
  }),
  validations: {
    invalid: false,
    form: {
      tmpAuthorYearOfBirth: {
        minValue: minValue(minAuthorYearOfBirth),
        maxValue: maxValue(maxAuthorYearOfBirth)
      }
    }
  },
  methods: {
    updateField () {
      this.value.authorPrefix = this.form.tmpAuthorPrefix
      this.value.authorFirstName = this.form.tmpAuthorFirstName
      this.value.authorMiddleName = this.form.tmpAuthorMiddleName
      this.value.authorLastName = this.form.tmpAuthorLastName
      this.value.authorSuffix = this.form.tmpAuthorSuffix
      this.value.authorPseudonym = this.form.tmpAuthorPseudonym
      this.value.authorCitizenship = this.form.tmpAuthorCitizenship
      this.value.domicile = this.form.tmpDomicile
      this.value.authorYearOfBirth = this.form.tmpAuthorYearOfBirth

      this.$emit('input', this.value)
    },
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
    validate () {
      this.$v.$touch()

      let authorNameInvalid = false
      let authorCitizenshipDomicileInvalid = false

      if (empty(this.form.tmpAuthorCitizenship) && empty(this.form.tmpDomicile)) {
        this.customValidationFields.tmpAuthorCitizenship.invalid = true
        this.customValidationFields.tmpDomicile.invalid = true
        authorCitizenshipDomicileInvalid = true
      } else {
        this.customValidationFields.tmpAuthorCitizenship.invalid = false
        this.customValidationFields.tmpDomicile.invalid = false
      }

      if (empty(this.form.tmpAuthorPseudonym) &&
          empty(this.form.tmpAuthorFirstName) &&
          empty(this.form.tmpAuthorLastName)) {
        this.customValidationFields.tmpAuthorFirstName.invalid = true
        this.customValidationFields.tmpAuthorLastName.invalid = true
        this.customValidationFields.tmpAuthorPseudonym.invalid = true
        this.customValidationFields.tmpAuthorFirstName.message = 'First name & last name or pseudonym is required'
        this.customValidationFields.tmpAuthorLastName.message = 'First name & last name or pseudonym is required'
        this.customValidationFields.tmpAuthorPseudonym.message = 'First name & last name or pseudonym is required'
        authorNameInvalid = true
      } else if (empty(this.form.tmpAuthorFirstName) && !empty(this.form.tmpAuthorLastName)) {
        this.customValidationFields.tmpAuthorFirstName.invalid = true
        this.customValidationFields.tmpAuthorFirstName.message = 'First name is required when last name is populated'
        this.customValidationFields.tmpAuthorLastName.invalid = false
        this.customValidationFields.tmpAuthorLastName.message = null
        authorNameInvalid = true
      } else if (!empty(this.form.tmpAuthorFirstName) && empty(this.form.tmpAuthorLastName)) {
        this.customValidationFields.tmpAuthorFirstName.invalid = false
        this.customValidationFields.tmpAuthorFirstName.message = null
        this.customValidationFields.tmpAuthorLastName.invalid = true
        this.customValidationFields.tmpAuthorLastName.message = 'Last name is required when first name is populated'
        authorNameInvalid = true
      } else {
        this.customValidationFields.tmpAuthorFirstName.invalid = false
        this.customValidationFields.tmpAuthorLastName.invalid = false
        this.customValidationFields.tmpAuthorPseudonym.invalid = false
      }

      if (authorNameInvalid || authorCitizenshipDomicileInvalid || this.$v.$invalid) {
        this.invalid = true
      }

      if (this.$v.$invalid || authorNameInvalid || authorCitizenshipDomicileInvalid) {
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
      }
    }
  }
}
</script>
<style scoped>
.or {
  padding-top: 28px;
}
</style>
