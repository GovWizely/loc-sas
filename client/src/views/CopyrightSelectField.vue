<template>
  <md-field :class="validationClass">
    <label :class="getLabelClass()" :for="name">{{getLabel()}}</label>
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
    <span class="md-error" v-if="displayRequiredError">{{errorMessage}}</span>
  </md-field>
</template>
<script>
import stateList from '@/utils/StateList'
import countryList from '@/utils/CountryList'

export default {
  name: 'CopyrightSelectField',
  props: ['value', 'options', 'name', 'label', 'validationClass', 'displayRequiredError', 'errorMessage', 'required', 'disabled'],
  methods: {
    updateField () {
      this.$emit('input', this.$refs.copyrightSelectField.value)
    },
    getFieldName () {
      return this.name.replace(/-/g, ' ')
    },
    getLabel () {
      return this.label + ((this.required) ? ' *' : '')
    },
    getLabelClass () {
      return 'select-label' + ((this.value) ? ' populated' : '')
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
      } else if (['Country', 'Citizenship', 'Domicile', 'Nation of First Publication'].includes(this.label)) {
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

label.select-label.populated {
  top: -5px;
  font-size: 12px;
}
</style>
