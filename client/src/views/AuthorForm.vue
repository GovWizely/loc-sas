<template>
  <details open class="author-form">
      <summary class="md-title">Author</summary>
      <div class="delete-container" v-if="!hideDelete">
        <md-button class="delete-btn md-mini" @click="deleteAuthor(form.id)">Delete
          <md-icon>delete</md-icon>
        </md-button>
      </div>
      <div class="question-and-answer">
      <div class="question">
        <label class="field-label">Is the author an individual or organization?</label>
      </div>
      <div class="answer" ref="organization">
        <md-radio
          id="author-individual"
          v-model="form.organization"
          :value="false"
          @change="toggleAuthorOrganization()"
          @input="updateField()"
        >Individual</md-radio>
        <md-radio
          id="author-organization"
          v-model="form.organization"
          :value="true"
          @change="toggleAuthorOrganization()"
          @input="updateField()"
        >Organization</md-radio>
      </div>
    </div>
    <author-individual-form
      v-if="form.organization === false"
      ref="authorIndividualForm"
      v-model="form"
      :sending="sending"
      @input="updateField()"
    />
    <author-organization-form
      v-if="form.organization === true"
      ref="authorOrganizationForm"
      v-model="form"
      :sending="sending"
      @input="updateField()"
    />
  </details>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import AuthorIndividualForm from '@/views/AuthorIndividualForm'
import AuthorOrganizationForm from '@/views/AuthorOrganizationForm'

export default {
  name: 'AuthorForm',
  props: ['value', 'sending', 'deleteFn', 'hideDelete'],
  mixins: [validationMixin],
  components: {
    'author-individual-form': AuthorIndividualForm,
    'author-organization-form': AuthorOrganizationForm
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
      }
    }
  },
  methods: {
    updateField () {
      this.value = this.form
      this.$emit('input', this.form)
    },
    toggleAuthorOrganization () {
      if (this.form.organization === true) {
        this.form.organizationName = null
        this.form.prefix = null
        this.form.firstName = null
        this.form.middleName = null
        this.form.lastName = null
        this.form.suffix = null
        this.form.pseudonym = null
        this.form.citizenship = null
        this.form.domicile = null
        this.form.yearOfBirth = null
        this.form.yearOfDeath = null
      }
    },
    validate () {
      this.$v.$touch()

      if (this.form.organization === true) {
        this.$refs.authorOrganizationForm.validate()
      } else if (this.form.organization === false) {
        this.$refs.authorIndividualForm.validate()
      }

      let invalid = false

      if (this.form.organization === true) {
        invalid = this.$refs.authorOrganizationForm.invalid
      } else if (this.form.organization === false) {
        invalid = this.$refs.authorIndividualForm.invalid
      }

      if (this.$v.$invalid || invalid) {
        this.invalid = true
        let element = this.$refs['organization']
        element.scrollIntoView()
      } else {
        this.invalid = false
      }
    },
    deleteAuthor (id) {
      this.deleteFn(id)
    }
  }
}
</script>
<style scoped>
summary {
  width: 90%;
  margin: 0;
}

.delete-btn {
  top: -32px;
}

.delete-container {
  height: 0;
  display: flex;
  justify-content: flex-end;
}
</style>
