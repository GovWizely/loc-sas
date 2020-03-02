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
            v-if="!$v.form.tmpAuthorFirstName.requriredIf"
          >First name &amp; last name or pseudonym is required</span>
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
            v-if="!$v.form.tmpAuthorLastName.requriredIf"
          >First name &amp; last name or pseudonym is required</span>
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
            v-if="!$v.form.tmpAuthorPseudonym.requiredIf"
          >First name &amp; last name or pseudonym is required</span>
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
          :displayRequiredError="!$v.form.tmpAuthorCitizenship.requiredIf"
          errorMessage="The author citizenship or domicile is required'"
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
          :displayRequiredError="!$v.form.tmpDomicile.requiredIf"
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
            v-model.number="form.tmpAuthorYearOfBirth"
            :disabled="sending"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.tmpAuthorYearOfBirth.minValue || !$v.form.tmpAuthorYearOfBirth.maxValue"
          >The year of birth must be between {{minAuthorYearOfBirth}} and {{maxAuthorYearOfBirth}}</span>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100" ref="tmpAuthorYearOfDeath">
        <md-field :class="getValidationClass('tmpAuthorYearOfDeath')">
          <label for="author-year-of-death">Deceased</label>
          <md-input
            name="author-year-of-death"
            id="author-year-of-death"
            type="number"
            v-model.number="form.tmpAuthorYearOfDeath"
            :disabled="sending"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.tmpAuthorYearOfDeath.minYearOfDeath"
          >The author's year of death, if applicable, must be after the year of birth</span>
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
  name: 'AuthorIndividualForm',
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
    this.form.tmpAuthorYearOfDeath = this.value.authorYearOfDeath
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
      tmpAuthorYearOfBirth: null,
      tmpAuthorYearOfDeath: null
    }
  }),
  validations () {
    return {
      form: {
        tmpAuthorYearOfBirth: {
          minValue: minValue(minAuthorYearOfBirth),
          maxValue: maxValue(maxAuthorYearOfBirth)
        },
        tmpAuthorYearOfDeath: {
          minYearOfDeath: (yearOfDeath) => {
            let yearOfBirth = this.form.tmpAuthorYearOfBirth
            return (!empty(yearOfBirth) && !empty(yearOfDeath)) ? yearOfBirth <= yearOfDeath : true
          }
        },
        tmpDomicile: {
          requiredIf: (domicile) => {
            return (empty(this.form.tmpAuthorCitizenship)) ? !empty(domicile) : true
          }
        },
        tmpAuthorCitizenship: {
          requiredIf: (authorCitizenship) => {
            return (empty(this.form.tmpDomicile)) ? !empty(authorCitizenship) : true
          }
        },
        tmpAuthorFirstName: {
          requiredIf: (authorFirstName) => {
            return (empty(this.form.tmpAuthorPseudonym))
              ? !empty(authorFirstName) && !empty(this.form.tmpAuthorLastName)
              : true
          }
        },
        tmpAuthorLastName: {
          requiredIf: (authorLastName) => {
            return (empty(this.form.tmpAuthorPseudonym))
              ? !empty(authorLastName) && !empty(this.form.tmpAuthorFirstName)
              : true
          }
        },
        tmpAuthorPseudonym: {
          requiredIf: (authorPseudonym) => {
            return (empty(this.form.tmpAuthorFirstName) && empty(this.form.tmpAuthorLastName))
              ? !empty(authorPseudonym)
              : true
          }
        }
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
      this.value.authorYearOfDeath = this.form.tmpAuthorYearOfDeath
      this.$emit('input', this.value)
    },
    getValidationClass (fieldName) {
      let field = this.$v.form[fieldName]
      if (field && field.$invalid && field.$dirty) {
        return {
          'md-invalid': true
        }
      }
    },
    validate () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.invalid = true
        const fields = Object.keys(this.form)
        for (let i = 0; i < fields.length; i++) {
          let field = fields[i]
          if (this.$v.form[field] && this.$v.form[field].$invalid) {
            let element = this.$refs[field]
            element.scrollIntoView()
            break
          }
        }
      } else {
        this.invalid = false
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
