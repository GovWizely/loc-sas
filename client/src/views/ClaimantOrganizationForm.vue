<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-small-size-100" ref="claimantOrganizationName">
      <md-field :class="getValidationClass('claimantOrganizationName')">
        <label for="claimant-organization-name">Organization Name</label>
        <md-input
          name="claimant-organization-name"
          id="claimant-organization-name"
          v-model="form.claimantOrganizationName"
          :disabled="sending"
          maxlength="255"
          required
          @input="updateField()"
        />
        <span
          class="md-error"
          v-if="!$v.form.claimantOrganizationName.required"
        >The organization name is required</span>
      </md-field>
    </div>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'ClaimantOrganizationForm',
  props: ['value', 'sending'],
  mixins: [validationMixin],
  created () {
    this.form = this.value
  },
  data: () => ({
    invalid: null,
    form: null
  }),
  validations: {
    form: {
      claimantOrganizationName: {
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
