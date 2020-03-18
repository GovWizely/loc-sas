<template>
  <div>
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
            required
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.firstName.required"
          >The claimant first name is required</span>
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
          <label for="first-name">Last Name</label>
          <md-input
            name="last-name"
            id="last-name"
            v-model="form.lastName"
            :disabled="sending"
            required
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.lastName.required"
          >The claimant last name is required</span>
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
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import CopyrightSelectField from '@/views/CopyrightSelectField'

export default {
  name: 'ClaimantIndividualForm',
  props: ['value', 'sending'],
  mixins: [validationMixin],
  components: {
    'copyright-select-field': CopyrightSelectField
  },
  created () {
    this.form = this.value
  },
  data: () => ({
    invalid: null,
    form: null
  }),
  validations: {
    form: {
      firstName: {
        required
      },
      lastName: {
        required
      }
    }
  },
  methods: {
    updateField () {
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
          if ((this.$v.form[field] && this.$v.form[field].$invalid)) {
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
