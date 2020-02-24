<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-small-size-100" ref="tmpAuthorOrganizationName">
      <md-field :class="getValidationClass('tmpAuthorOrganizationName')">
        <label for="author-organization-name">Organization Name</label>
        <md-input
          name="author-organization-name"
          id="author-organization-name"
          v-model="form.tmpAuthorOrganizationName"
          :disabled="sending"
          maxlength="255"
          @input="updateField()"
        />
        <span
          class="md-error"
          v-if="!$v.form.tmpAuthorOrganizationName.required"
        >The organization name is required</span>
      </md-field>
    </div>
    <div class="md-layout-item md-small-size-100" ref="tmpDomicile">
      <copyright-select-field
        v-model="form.tmpDomicile"
        name="domicile"
        label="Domicile"
        required="true"
        :disabled="sending"
        :validationClass="getValidationClass('tmpDomicile')"
        :displayRequiredError="!$v.form.tmpDomicile.required"
        errorMessage="The domicile is required"
        @input="updateField()"
      />
    </div>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import CopyrightSelectField from '@/views/CopyrightSelectField'

export default {
  name: 'AuthorOrganizationForm',
  props: ['value', 'sending'],
  mixins: [validationMixin],
  components: {
    'copyright-select-field': CopyrightSelectField
  },
  created () {
    this.form.tmpAuthorOrganizationName = this.value.authorOrganizationName
    this.form.tmpDomicile = this.value.domicile
  },
  data: () => ({
    invalid: false,
    form: {
      tmpAuthorOrganizationName: null,
      tmpDomicile: null
    }
  }),
  validations: {
    form: {
      tmpAuthorOrganizationName: {
        required
      },
      tmpDomicile: {
        required
      }
    }
  },
  methods: {
    updateField () {
      this.value.authorOrganizationName = this.form.tmpAuthorOrganizationName
      this.value.domicile = this.form.tmpDomicile
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
