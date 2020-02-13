<template>
  <md-field :class="validationClass">
    <label v-if="!value" :class="getLabelClass()" :for="name">{{label}}</label>
    <select
      class="copyright-select"
      :name="name"
      :id="name"
      ref="copyrightSelectField"
      @input="updateField()"
      :disabled="disabled"
    >
      <option
        v-for="option in getOptions()"
        :key="option.id"
        :value="option.id"
        :selected="option.id === value"
      >{{option.name}}</option>
    </select>
    <span class="md-error" v-if="displayRequiredError">{{getErrorMessage()}}</span>
  </md-field>
</template>
<script>
import stateList from '@/utils/StateList'
import countryList from '@/utils/CountryList'

export default {
  name: 'FixField',
  props: ['value', 'options', 'name', 'label', 'validationClass', 'displayRequiredError', 'errorMessage', 'required', 'disabled'],
  methods: {
    updateField () {
      this.$emit('input', this.$refs.copyrightSelectField.value)
    },
    getFieldName () {
      return this.name.replace(/-/g, ' ')
    },
    getLabelClass () {
      if (this.required) {
        return 'select-label' + ' required'
      } else {
        return 'select-label'
      }
    },
    getErrorMessage () {
      if (this.errorMessage) return this.errorMessage
      else return 'The '.concat(this.getFieldName(), ' is required')
    },
    getOptions () {
      if (this.label === 'Prefix') {
        return [
          { id: '', name: '' },
          { id: 'Miss', name: 'Miss' },
          { id: 'Mr', name: 'Mr' },
          { id: 'Ms', name: 'Ms' },
          { id: 'Mrs', name: 'Mrs' },
          { id: 'Dr', name: 'Dr' },
          { id: 'Prof', name: 'Prof' }
        ]
      } else if (this.label === 'Suffix') {
        return [
          { id: '', name: '' },
          { id: 'II', name: 'II' },
          { id: 'III', name: 'III' },
          { id: 'Jr', name: 'Jr' },
          { id: 'Mrs', name: 'Sr' },
          { id: 'Esq', name: 'Esq' },
          { id: 'MD', name: 'MD' },
          { id: 'PhD', name: 'PhD' }
        ]
      } else if (this.label === 'State') {
        return stateList
      } else if (['Country', 'Citizenship', 'Domicile'].includes(this.label)) {
        return countryList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.copyright-select {
  width: 100%;
}

.select-label {
  padding-left: 10px;
}

label.select-label.required:after {
  content: " *";
}
</style>
