<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-small-size-100" ref="tmpClaimantOrganizationName">
      <md-field :class="getValidationClass('tmpClaimantOrganizationName')">
        <label for="claimant-organization-name">Organization Name</label>
        <md-input
          name="claimant-organization-name"
          id="claimant-organization-name"
          v-model="form.tmpClaimantOrganizationName"
          :disabled="sending"
          maxlength="255"
          required
          @input="updateField()"
        />
        <span
          class="md-error"
          v-if="!$v.form.tmpClaimantOrganizationName.required"
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
    this.form.tmpClaimantOrganizationName = this.value.claimantOrganizationName
  },
  data: () => ({
    invalid: false,
    form: {
      tmpClaimantOrganizationName: null
    }
  }),
  validations: {
    form: {
      tmpClaimantOrganizationName: {
        required
      }
    }
  },
  methods: {
    updateField () {
      this.value.claimantOrganizationName = this.form.tmpClaimantOrganizationName
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
