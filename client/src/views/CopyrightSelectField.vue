<template>
  <md-field :class="validationClass">
    <label v-if="!value" :class="getLabelClass()" :for="name">{{label}}</label>
    <select
      class="copyright-select"
      :name="name"
      :id="name"
      ref="copyrightSelectField"
      @input="updatField()"
    >
      <option
        v-for="option in getOptions()"
        :key="option.id"
        :value="option.id"
        :selected="option.id === value"
      >{{option.name}}</option>
    </select>
    <span class="md-error" v-if="displayRequiredError">The {{getFieldName()}} is required</span>
  </md-field>
</template>
<script>
import { states } from '@/utils/StateList'

export default {
  name: 'FixField',
  props: ['value', 'options', 'name', 'label', 'validationClass', 'displayRequiredError', 'required'],
  methods: {
    updatField () {
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
        return states
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
