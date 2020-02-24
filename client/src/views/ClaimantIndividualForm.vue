<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-10">
        <copyright-select-field
          v-model="form.tmpClaimantPrefix"
          name="claimant-prefix"
          label="Prefix"
          :disabled="sending"
          @input="updateField()"
        />
      </div>
      <div class="md-layout-item md-small-size-100" ref="tmpClaimantFirstName">
        <md-field :class="getValidationClass('tmpClaimantFirstName')">
          <label for="claimant-first-name">First Name</label>
          <md-input
            name="claimant-first-name"
            id="claimant-first-name"
            v-model="form.tmpClaimantFirstName"
            :disabled="sending"
            required
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.tmpClaimantFirstName.required"
          >The claimant first name is required</span>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100">
        <md-field>
          <label for="claimant-middle-name">Middle Name</label>
          <md-input
            name="claimant-middle-name"
            id="claimant-middle-name"
            v-model="form.tmpClaimantMiddleName"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100" ref="tmpClaimantLastName">
        <md-field :class="getValidationClass('tmpClaimantLastName')">
          <label for="claimant-first-name">Last Name</label>
          <md-input
            name="claimant-last-name"
            id="claimant-last-name"
            v-model="form.tmpClaimantLastName"
            :disabled="sending"
            required
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.tmpClaimantLastName.required"
          >The claimant last name is required</span>
        </md-field>
      </div>
      <div class="md-layout-item md-size-10">
        <copyright-select-field
          v-model="form.claimantSuffix"
          name="claimant-suffix"
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
    this.form.tmpClaimantPrefix = this.value.claimantPrefix
    this.form.tmpClaimantFirstName = this.value.claimantFirstName
    this.form.tmpClaimantMiddleName = this.value.claimantMiddleName
    this.form.tmpClaimantLastName = this.value.claimantLastName
    this.form.tmpClaimantSuffix = this.value.claimantSuffix
  },
  data: () => ({
    form: {
      tmpClaimantPrefix: null,
      tmpClaimantFirstName: null,
      tmpClaimantMiddleName: null,
      tmpClaimantLastName: null,
      tmpClaimantSuffix: null
    }
  }),
  validations: {
    form: {
      tmpClaimantFirstName: {
        required
      },
      tmpClaimantLastName: {
        required
      }
    }
  },
  methods: {
    updateField () {
      this.value.claimantPrefix = this.form.tmpClaimantPrefix
      this.value.claimantFirstName = this.form.tmpClaimantFirstName
      this.value.claimantMiddleName = this.form.tmpClaimantMiddleName
      this.value.claimantLastName = this.form.tmpClaimantLastName
      this.value.claimantSuffix = this.form.tmpClaimantSuffix
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
