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
          v-model="form.prefix"
          name="prefix"
          label="Prefix"
          :disabled="sending"
          @input="updateField()"
        />
      </div>
      <div class="md-layout-item md-small-size-100" ref="firstName">
        <md-field :class="getValidationClass('firstName')">
          <label for="first-name">First Name</label>
          <md-input
            name="first-name"
            id="first-name"
            v-model="form.firstName"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.firstName.requiredIf"
          >First name &amp; last name or pseudonym is required</span>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100">
        <md-field>
          <label for="middle-name">Middle Name</label>
          <md-input
            name="middle-name"
            id="middle-name"
            v-model="form.middleName"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100" ref="lastName">
        <md-field :class="getValidationClass('lastName')">
          <label for="last-name">Last Name</label>
          <md-input
            name="last-name"
            id="last-name"
            v-model="form.lastName"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.lastName.requiredIf"
          >First name &amp; last name or pseudonym is required</span>
        </md-field>
      </div>
      <div class="md-layout-item md-size-10">
        <copyright-select-field
          v-model="form.suffix"
          name="suffix"
          label="Suffix"
          :disabled="sending"
          @input="updateField()"
        />
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100" ref="pseudonym">
        <md-field :class="getValidationClass('pseudonym')">
          <label for="pseudonym">Pseudonym</label>
          <md-input
            name="pseudonym"
            id="pseudonym"
            v-model="form.pseudonym"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.pseudonym.requiredIf"
          >First name &amp; last name or pseudonym is required</span>
        </md-field>
      </div>
    </div>
    <label class="field-label">
      Citizenship/Domicile *
      <md-tooltip md-direction="right">Citizenship or domicile is required</md-tooltip>
    </label>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100" ref="citizenship">
        <copyright-select-field
          v-model="form.citizenship"
          name="citizenship"
          label="Citizenship"
          :disabled="sending"
          :validationClass="getValidationClass('citizenship')"
          :displayRequiredError="!$v.form.citizenship.requiredIf"
          errorMessage="The author citizenship or domicile is required'"
          @input="updateField()"
        />
      </div>
      <div class="or">- or -</div>
      <div class="md-layout-item md-small-size-100" ref="domicile">
        <copyright-select-field
          v-model="form.domicile"
          name="domicile"
          label="Domicile"
          :disabled="sending"
          :validationClass="getValidationClass('domicile')"
          :displayRequiredError="!$v.form.domicile.requiredIf"
          errorMessage="The author citizenship or domicile is required"
          @input="updateField()"
        />
      </div>
      <div class="md-layout-item md-small-size-100" ref="yearOfBirth">
        <md-field :class="getValidationClass('yearOfBirth')">
          <label for="year-of-birth">Year of Birth (YYYY)</label>
          <md-input
            name="year-of-birth"
            id="year-of-birth"
            type="number"
            v-model.number="form.yearOfBirth"
            :disabled="sending"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.yearOfBirth.minValue || !$v.form.yearOfBirth.maxValue"
          >The year of birth must be between {{minAuthorYearOfBirth}} and {{maxAuthorYearOfBirth}}</span>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100" ref="yearOfDeath">
        <md-field :class="getValidationClass('yearOfDeath')">
          <label for="year-of-death">Deceased (YYYY)</label>
          <md-input
            name="year-of-death"
            id="year-of-death"
            type="number"
            v-model.number="form.yearOfDeath"
            :disabled="sending"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.yearOfDeath.minYearOfDeath"
          >The author's year of death, if applicable, must be after the year of birth</span>
        </md-field>
      </div>
    </div>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { minValue, maxValue } from 'vuelidate/lib/validators'
import { empty, emptyStringToNull } from '@/utils/ValidationHelpers'
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
    this.form = this.value
  },
  data: () => ({
    minAuthorYearOfBirth,
    maxAuthorYearOfBirth,
    invalid: null,
    form: null
  }),
  validations () {
    return {
      form: {
        yearOfBirth: {
          minValue: minValue(minAuthorYearOfBirth),
          maxValue: maxValue(maxAuthorYearOfBirth)
        },
        yearOfDeath: {
          minYearOfDeath: (yearOfDeath) => {
            let yearOfBirth = this.form.yearOfBirth
            return (!empty(yearOfBirth) && !empty(yearOfDeath)) ? yearOfBirth <= yearOfDeath : true
          }
        },
        domicile: {
          requiredIf: (domicile) => {
            return (empty(this.form.citizenship)) ? !empty(domicile) : true
          }
        },
        citizenship: {
          requiredIf: (citizenship) => {
            return (empty(this.form.domicile)) ? !empty(citizenship) : true
          }
        },
        firstName: {
          requiredIf: (firstName) => {
            return (empty(this.form.pseudonym))
              ? !empty(firstName) && !empty(this.form.lastName)
              : true
          }
        },
        lastName: {
          requiredIf: (lastName) => {
            return (empty(this.form.pseudonym))
              ? !empty(lastName) && !empty(this.form.firstName)
              : true
          }
        },
        pseudonym: {
          requiredIf: (pseudonym) => {
            return (empty(this.form.firstName) && empty(this.form.lastName))
              ? !empty(pseudonym)
              : true
          }
        }
      }
    }
  },
  methods: {
    updateField () {
      this.form.yearOfBirth = emptyStringToNull(this.form.yearOfBirth)
      this.form.yearOfDeath = emptyStringToNull(this.form.yearOfDeath)
      this.$emit('input', this.form)
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
