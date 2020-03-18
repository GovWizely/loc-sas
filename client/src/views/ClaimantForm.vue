<template>
  <details open>
    <summary class="md-title">Claimant</summary>
    <div class="question-and-answer">
      <div class="question">
        <label class="field-label">Is the claimant an individual or organization?</label>
      </div>
      <div class="answer" ref="organization">
        <md-radio
          id="claimant-individual"
          v-model="form.organization"
          :value="false"
          @change="toggleClaimantOrganization"
        >Individual</md-radio>
        <md-radio
          id="claimant-organization"
          v-model="form.organization"
          :value="true"
          @change="toggleClaimantOrganization"
        >Organization</md-radio>
      </div>
    </div>
    <claimant-individual-form
      v-if="form.organization === false"
      ref="claimantIndividualForm"
      v-model="form"
      :sending="sending"
      @input="updateField()"
    />
    <claimant-organization-form
      v-if="form.organization === true"
      ref="claimantOrganizationForm"
      v-model="form"
      :sending="sending"
      @input="updateField()"
    />
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100">
        <md-field :class="getValidationClass('address')">
          <label for="address" ref="address">Address</label>
          <md-input
            name="address"
            id="address"
            v-model="form.address"
            :disabled="sending"
            required
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.address.required"
          >The claimant address is required</span>
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100">
        <md-field>
          <label for="address2">Address 2</label>
          <md-input
            name="address2"
            id="address2"
            v-model="form.address2"
            :disabled="sending"
            maxlength="255"
            @input="updateField()"
          />
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-20">
        <md-field :class="getValidationClass('city')">
          <label for="claimant-city" ref="city">City</label>
          <md-input
            name="city"
            id="city"
            v-model="form.city"
            :disabled="sending"
            required
            maxlength="255"
            @input="updateField()"
          />
          <span class="md-error" v-if="!$v.form.city.required">The claimant city is required</span>
        </md-field>
      </div>
      <div class="md-layout-item md-size-20" ref="state">
        <copyright-select-field
          v-model="form.state"
          name="state"
          label="State"
          required="true"
          :disabled="sending"
          :validationClass="getValidationClass('state')"
          :displayRequiredError="!$v.form.state.required"
          errorMessage="The claimant state is required"
          @input="updateField()"
        />
      </div>
      <div class="md-layout-item md-size-20">
        <md-field :class="getValidationClass('postalCode')">
          <label for="postal-code" ref="postalCode">Postal Code</label>
          <md-input
            name="postal-code"
            id="postal-code"
            v-model="form.postalCode"
            :disabled="sending"
            required
            maxlength="255"
            @input="updateField()"
          />
          <span
            class="md-error"
            v-if="!$v.form.postalCode.required"
          >The claimant postal code is required</span>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100" ref="country">
        <copyright-select-field
          v-model="form.country"
          name="country"
          label="Country"
          required="true"
          :disabled="sending"
          :validationClass="getValidationClass('country')"
          :displayRequiredError="!$v.form.country.required"
          errorMessage="The claimant country is required"
          @input="updateField()"
        />
      </div>
    </div>
  </details>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import CopyrightSelectField from '@/views/CopyrightSelectField'
import ClaimantIndividualForm from '@/views/ClaimantIndividualForm'
import ClaimantOrganizationForm from '@/views/ClaimantOrganizationForm'

export default {
  name: 'ClaimantForm',
  props: ['value', 'sending'],
  mixins: [validationMixin],
  components: {
    'copyright-select-field': CopyrightSelectField,
    'claimant-individual-form': ClaimantIndividualForm,
    'claimant-organization-form': ClaimantOrganizationForm
  },
  created () {
    this.form = this.value
  },
  data: () => ({
    invalid: false,
    form: null
  }),
  validations: {
    form: {
      organization: {
        required
      },
      address: {
        required
      },
      city: {
        required
      },
      state: {
        required
      },
      postalCode: {
        required
      },
      country: {
        required
      }
    }
  },
  methods: {
    updateField () {
      this.value = this.form
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
    toggleClaimantOrganization () {
      if (this.form.organization === true) {
        this.form.organizationName = null
        this.form.prefix = null
        this.form.firstName = null
        this.form.middleName = null
        this.form.lastName = null
        this.form.suffix = null
      }
    },
    validate () {
      this.$v.$touch()

      if (this.form.organization === true) {
        this.$refs.claimantOrganizationForm.validate()
      } else if (this.form.organization === false) {
        this.$refs.claimantIndividualForm.validate()
      }

      let invalid = false

      if (this.form.organization === true) {
        invalid = this.$refs.claimantOrganizationForm.invalid
      } else if (this.form.organization === false) {
        invalid = this.$refs.claimantIndividualForm.invalid
      }

      if (this.$v.$invalid || invalid) {
        this.invalid = true
        let element = this.$refs['organization']
        element.scrollIntoView()
      } else {
        this.invalid = false
      }
    }
  }
}
</script>
