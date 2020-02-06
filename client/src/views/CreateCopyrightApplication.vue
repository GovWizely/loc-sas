<template>
  <div>
    <div class="header">
      <div class="header-row-1">
        <h1 class="title">New Copyright Application for non-fiction literary work #{{this.form.serviceRequestId}}</h1>
        <span v-if="savingDraft" class="draft-message">Saving draft...</span>
        <button v-else class="secondary-button" @click="saveAndClose">Save &amp; return to home page</button>
      </div>
    </div>
    <form novalidate class="md-layout" @submit.prevent="validateCopyrightApplication" @change="saveDraft" v-if="!loading" >
      <div class="md-layout-item md-size-80 form">
        <span class="md-subheader">* Required fields</span>
        <details open>
          <summary class="md-title">Title</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('primaryTitle')">
                <label for="primary-title" ref="primaryTitle">Primary Title</label>
                <md-input
                  name="primary-title"
                  id="primary-title"
                  v-model="form.primaryTitle"
                  :disabled="sending"
                  required
                  @blur="validateField('primaryTitle')"
                  md-counter="2000"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.primaryTitle.required"
                >The primary title is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.primaryTitle.maxLength"
                >The primary title max length is 2000 characters</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('alternateTitle')">
                <label for="alternate-title">Alternate Title</label>
                <md-input
                  name="alternate-title"
                  id="alternate-title"
                  v-model="form.alternateTitle"
                  :disabled="sending"
                  @blur="validateField('alternateTitle')"
                  md-counter="2000"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.alternateTitle.maxLength"
                >The alternate title max length is 2000 characters</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('yearCompleted')">
                <label for="year-completed" ref="yearCompleted">Year Completed</label>
                <md-input
                  name="year-completed"
                  id="year-completed"
                  type="number"
                  v-model="form.yearCompleted"
                  :disabled="sending"
                  required
                  @blur="validateField('yearCompleted')"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.yearCompleted.required"
                >The year completed is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.yearCompleted.minValue || !$v.form.yearCompleted.maxValue"
                >The year completed must be between {{minYearCompleted}} and {{maxYearCompleted}}</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Author</summary>
          <div class="author-name">
            <label class="field-label">Name *</label>
            <div class="switches">
              <md-checkbox v-model="authorPseudonymous"
                name="author-pseudonymous"
                id="author-pseudonymous"
                @change="togglePseudonymity">Pseudonymous
              </md-checkbox>
              <md-checkbox v-model="form.authorAnonymous"
                name="author-anonymous"
                id="author-anonymous"
                @change="toggleAnonymity">Anonymous
              </md-checkbox>
            </div>
          </div>
          <div class="md-layout md-gutter" v-if="!form.authorAnonymous">
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Prefix</label>
                <md-select
                  v-model="form.authorPrefix"
                  name="author-prefix"
                  id="author-prefix"
                  :disabled="sending">
                  <md-option v-for="option in prefixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('authorFirstName')">
                <label for="author-first-name" ref="authorFirstName">First Name</label>
                <md-input
                  name="author-first-name"
                  id="author-first-name"
                  v-model="form.authorFirstName"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.authorFirstName.required"
                >The author first name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="author-middle-name">Middle Name</label>
                <md-input
                  name="author-middle-name"
                  id="author-middle-name"
                  v-model="form.authorMiddleName"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('authorLastName')">
                <label for="author-last-name" ref="authorLastName">Last Name</label>
                <md-input
                  name="author-last-name"
                  id="author-last-name"
                  v-model="form.authorLastName"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.authorLastName.required"
                >The author last name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Suffix</label>
                <md-select
                  v-model="form.authorSuffix"
                  name="author-suffix"
                  id="author-suffix"
                  :disabled="sending">
                  <md-option v-for="option in suffixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100" v-if="authorPseudonymous">
              <md-field :class="getValidationClass('authorPseudonym')">
                <label for="author-pseudonym" ref="authorPseudonym">Pseudonym</label>
                <md-input
                  name="author-pseudonym"
                  id="author-pseudonym"
                  v-model="form.authorPseudonym"
                  :disabled="sending"
                  maxlength=255
                  required
                />
                <span
                  class="md-error"
                  v-if="!$v.form.authorPseudonym.required"
                >The author pseudonym is required</span>
              </md-field>
            </div>
          </div>
          <div>
            <label class="field-label">Citizenship/Domicile *
              <md-tooltip md-direction="right">Citizenship and/or domicile is required</md-tooltip>
            </label>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('authorCitizenship')">
                  <label for="author-citizenship" ref="authorCitizenship">Citizenship</label>
                  <md-input
                    name="author-citizenship"
                    id="author-citizenship"
                    v-model="form.authorCitizenship"
                    :disabled="sending"
                    maxlength=255
                  />
                  <span
                    class="md-error"
                    v-if="customValidationFields.authorCitizenship.invalid"
                  >The author citizenship and/or domicile is required</span>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('authorDomicile')">
                  <label for="author-domicile" ref="authorDomicile">Domicile</label>
                  <md-input
                    name="author-domicile"
                    id="author-domicile"
                    v-model="form.authorDomicile"
                    :disabled="sending"
                    maxlength=255
                  />
                  <span
                    class="md-error"
                    v-if="customValidationFields.authorDomicile.invalid"
                  >The author citizenship and/or domicile is required</span>
                </md-field>
              </div>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Claimant</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Prefix</label>
                <md-select
                  v-model="form.claimantPrefix"
                  name="claimant-prefix"
                  id="claimant-prefix"
                  :disabled="sending">
                  <md-option v-for="option in prefixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('claimantFirstName')">
                <label for="claimant-first-name" ref="claimantFirstName">First Name</label>
                <md-input
                  name="claimant-first-name"
                  id="claimant-first-name"
                  v-model="form.claimantFirstName"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantFirstName.required"
                >The claimant first name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="claimant-middle-name">Middle Name</label>
                <md-input
                  name="claimant-middle-name"
                  id="claimant-middle-name"
                  v-model="form.claimantMiddleName"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('claimantLastName')">
                <label for="claimant-first-name" ref="claimantLastName">Last Name</label>
                <md-input
                  name="claimant-last-name"
                  id="claimant-last-name"
                  v-model="form.claimantLastName"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantLastName.required"
                >The claimant last name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Suffix</label>
                <md-select
                  v-model="form.claimantSuffix"
                  name="claimant-suffix"
                  id="claimant-suffix"
                  :disabled="sending">
                  <md-option v-for="option in suffixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('claimantAddress')">
                <label for="claimant-address" ref="claimantAddress">Address</label>
                <md-input
                  name="claimant-address"
                  id="claimant-address"
                  v-model="form.claimantAddress"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantAddress.required"
                >The claimant address is required</span>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="claimant-address2">Address 2</label>
                <md-input
                  name="claimant-address2"
                  id="claimant-address2"
                  v-model="form.claimantAddress2"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-30">
              <md-field :class="getValidationClass('claimantCity')">
                <label for="claimant-city" ref="claimantCity">City</label>
                <md-input
                  name="claimant-city"
                  id="claimant-city"
                  v-model="form.claimantCity"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantCity.required"
                >The claimant city is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-30">
              <md-field :class="getValidationClass('claimantState')">
                <label for="claimant-state" ref="claimantState">State</label>
                <md-input
                  name="claimant-state"
                  id="claimant-state"
                  v-model="form.claimantState"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantState.required"
                >The claimant state is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-40">
              <md-field :class="getValidationClass('claimantPostalCode')">
                <label for="claimant-postal-code" ref="claimantPostalCode">Postal Code</label>
                <md-input
                  name="claimant-postal-code"
                  id="claimant-postal-code"
                  v-model="form.claimantPostalCode"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantPostalCode.required"
                >The claimant postal code is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('claimantCountry')">
                <label for="claimant-country" ref="claimantCountry">Country</label>
                <md-input
                  name="claimant-country"
                  id="claimant-country"
                  v-model="form.claimantCountry"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.claimantCountry.required"
                >The claimant country is required</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Certificate</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Prefix</label>
                <md-select
                  v-model="form.certificateContactPrefix"
                  name="certificate-contact-prefix"
                  id="certificate-contact-prefix"
                  :disabled="sending">
                  <md-option v-for="option in prefixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('certificateContactFirstName')">
                <label for="certificate-contact-first-name" ref="certificateContactFirstName">First Name</label>
                <md-input
                  name="certificate-contact-first-name"
                  id="certificate-contact-first-name"
                  v-model="form.certificateContactFirstName"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.certificateContactFirstName.required"
                >The certificate contact first name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="certificate-contact-middle-name">Middle Name</label>
                <md-input
                  name="certificate-contact-middle-name"
                  id="certificate-contact-middle-name"
                  v-model="form.certificateContactMiddleName"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('certificateContactLastName')">
                <label for="certificate-contact-last-name" ref="certificateContactLastName">Last Name</label>
                <md-input
                  name="certificate-contact-last-name"
                  id="certificate-contact-last-name"
                  v-model="form.certificateContactLastName"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.certificateContactLastName.required"
                >The certificate contact last name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Suffix</label>
                <md-select
                  v-model="form.certificateContactSuffix"
                  name="certificate-contact-suffix"
                  id="certificate-contact-suffix"
                  :disabled="sending">
                  <md-option v-for="option in suffixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('certificateContactAddress')">
                <label for="certificate-contact-address" ref="certificateContactAddress">Address</label>
                <md-input
                  name="certificate-contact-address"
                  id="certificate-contact-address"
                  v-model="form.certificateContactAddress"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.certificateContactAddress.required"
                >The certificate address is required</span>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="certificate-contact-address2">Address 2</label>
                <md-input
                  name="certificate-contact-address2"
                  id="certificate-contact-address2"
                  v-model="form.certificateContactAddress2"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-30">
              <md-field :class="getValidationClass('certificateContactCity')">
                <label for="certificate-contact-city" ref="certificateContactCity">City</label>
                <md-input
                  name="certificate-contact-city"
                  id="certificate-contact-city"
                  v-model="form.certificateContactCity"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.certificateContactCity.required"
                >The certificate city is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-30">
              <md-field :class="getValidationClass('certificateContactState')">
                <label for="certificate-contact-state" ref="certificateContactState">State</label>
                <md-input
                  name="certificate-contact-state"
                  id="certificate-contact-state"
                  v-model="form.certificateContactState"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.certificateContactState.required"
                >The certificate state is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-40">
              <md-field :class="getValidationClass('certificateContactPostalCode')">
                <label for="certificate-contact-postal-code" ref="certificateContactPostalCode">Postal Code</label>
                <md-input
                  name="certificate-contact-postal-code"
                  id="certificate-contact-postal-code"
                  v-model="form.certificateContactPostalCode"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.certificateContactPostalCode.required"
                >The certificate postal code is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('certificateContactCountry')">
                <label for="certificate-contact-country" ref="certificateContactCountry">Country</label>
                <md-input
                  name="certificate-contact-country"
                  id="certificate-contact-country"
                  v-model="form.certificateContactCountry"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.certificateContactCountry.required"
                >The certificate country is required</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Correspondence</summary>
          <md-switch
            v-model="useClaimantAddress"
            @change="copyClaimantAddress"
            id="copy-claimant-address-btn"
            name="copy-claimant-address-btn">Use Claimant Address
          </md-switch>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Prefix</label>
                <md-select
                  v-model="form.correspondenceContactPrefix"
                  name="correspondence-contact-prefix"
                  id="correspondence-contact-prefix"
                  :disabled="sending">
                  <md-option v-for="option in prefixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('correspondenceContactFirstName')">
                <label for="correspondence-contact-first-name" ref="correspondenceContactFirstName">First Name</label>
                <md-input
                  name="correspondence-contact-first-name"
                  id="correspondence-contact-first-name"
                  v-model="form.correspondenceContactFirstName"
                  :disabled="sending || useClaimantAddress"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceContactFirstName.required"
                >The correspondence contact first name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="correspondence-contact-middle-name">Middle Name</label>
                <md-input
                  name="correspondence-contact-middle-name"
                  id="correspondence-contact-middle-name"
                  v-model="form.correspondenceContactMiddleName"
                  :disabled="sending || useClaimantAddress"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('correspondenceContactLastName')">
                <label for="correspondence-contact-last-name" ref="correspondenceContactLastName">Last Name</label>
                <md-input
                  name="correspondence-contact-last-name"
                  id="correspondence-contact-last-name"
                  v-model="form.correspondenceContactLastName"
                  :disabled="sending || useClaimantAddress"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceContactLastName.required"
                >The correspondence contact last name is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Suffix</label>
                <md-select
                  v-model="form.correspondenceContactSuffix"
                  name="correspondence-contact-suffix"
                  id="correspondence-contact-suffix"
                  :disabled="sending">
                  <md-option v-for="option in suffixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('correspondenceContactAddress')">
                <label for="correspondence-contact-address" ref="correspondenceContactAddress">Address</label>
                <md-input
                  name="correspondence-contact-address"
                  id="correspondence-contact-address"
                  v-model="form.correspondenceContactAddress"
                  :disabled="sending || useClaimantAddress"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceContactAddress.required"
                >The correspondence address is required</span>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="correspondence-contact-address2">Address 2</label>
                <md-input
                  name="correspondence-contact-address2"
                  id="correspondence-contact-address2"
                  v-model="form.correspondenceContactAddress2"
                  :disabled="sending || useClaimantAddress"
                  maxlength=255
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-30">
              <md-field :class="getValidationClass('correspondenceContactCity')">
                <label for="correspondence-contact-city" ref="correspondenceContactCity">City</label>
                <md-input
                  name="correspondence-contact-city"
                  id="correspondence-contact-city"
                  v-model="form.correspondenceContactCity"
                  :disabled="sending || useClaimantAddress"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceContactCity.required"
                >The correspondence city is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-30">
              <md-field :class="getValidationClass('correspondenceContactState')">
                <label for="correspondence-contact-state" ref="correspondenceContactState">State</label>
                <md-input
                  name="correspondence-contact-state"
                  id="correspondence-contact-state"
                  v-model="form.correspondenceContactState"
                  :disabled="sending || useClaimantAddress"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceContactState.required"
                >The correspondence state is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-40">
              <md-field :class="getValidationClass('correspondenceContactPostalCode')">
                <label for="correspondence-contact-postal-code" ref="correspondenceContactPostalCode">Postal Code</label>
                <md-input
                  name="correspondence-contact-postal-code"
                  id="correspondence-contact-postal-code"
                  v-model="form.correspondenceContactPostalCode"
                  :disabled="sending || useClaimantAddress"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceContactPostalCode.required"
                >The correspondence postal code is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('correspondenceContactCountry')">
                <label for="correspondence-contact-country" ref="correspondenceContactCountry">Country</label>
                <md-input
                  name="correspondence-contact-country"
                  id="correspondence-contact-country"
                  v-model="form.correspondenceContactCountry"
                  :disabled="sending || useClaimantAddress"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceContactCountry.required"
                >The correspondence country is required</span>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-60">
              <md-field :class="getValidationClass('correspondencePhoneNumber')">
                <label for="correspondence-phone-number" ref="correspondencePhoneNumber">Phone Number</label>
                <md-input
                  name="correspondence-phone-number"
                  id="correspondence-phone-number"
                  autocomplete="tel"
                  v-model="form.correspondencePhoneNumber"
                  :disabled="sending"
                  required
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondencePhoneNumber.required"
                >The correspondence phone number is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.correspondencePhoneNumber.isValidPhoneNumber"
                >The correspondence phone number must be 10 digits</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-30">
              <md-field>
                <label for="correspondence-phone-number-extension">Ext.</label>
                <md-input
                  name="correspondence-phone-number-extension"
                  id="correspondence-phone-number-extension"
                  autocomplete="tel"
                  type="number"
                  v-model="form.correspondencePhoneNumberExtension"
                  :disabled="sending"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('correspondenceEmail')">
                <label for="correspondence-email" ref="correspondenceEmail">Email</label>
                <md-input
                  type="email"
                  name="correspondence-email"
                  id="correspondence-email"
                  autocomplete="email"
                  v-model="form.correspondenceEmail"
                  :disabled="sending"
                  required
                  maxlength=255
                />
                <span
                  class="md-error"
                  v-if="!$v.form.correspondenceEmail.required"
                >The Correspondence email is required</span>
                <span class="md-error" v-else-if="!$v.form.correspondenceEmail.email">Invalid email</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Rights &amp; Permissions</summary>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Prefix</label>
                <md-select
                  v-model="form.possibleRightsAndPermissionsPrefix"
                  name="possible-rights-and-permissions-prefix"
                  id="possible-rights-and-permissions-prefix">
                  <md-option v-for="option in prefixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-first-name">First Name</label>
                <md-input
                  name="possible-rights-and-permissions-first-name"
                  id="possible-rights-and-permissions-first-name"
                  v-model="form.possibleRightsAndPermissionsFirstName"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-middle-name">Middle Name</label>
                <md-input
                  name="possible-rights-and-permissions-middle-name"
                  id="possible-rights-and-permissions-middle-name"
                  v-model="form.possibleRightsAndPermissionsMiddleName"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-last-name">Last Name</label>
                <md-input
                  name="possible-rights-and-permissions-last-name"
                  id="possible-rights-and-permissions-last-name"
                  v-model="form.possibleRightsAndPermissionsLastName"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Suffix</label>
                <md-select
                  v-model="form.possibleRightsAndPermissionsSuffix"
                  name="possible-rights-and-permissions-suffix"
                  id="possible-rights-and-permissions-suffix">
                  <md-option v-for="option in suffixes" :key="option" :value="option">{{option}}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-address">Address</label>
                <md-input
                  name="possible-rights-and-permissions-address"
                  id="possible-rights-and-permissions-address"
                  v-model="form.possibleRightsAndPermissionsAddress"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-address2">Address 2</label>
                <md-input
                  name="possible-rights-and-permissions-address2"
                  id="possible-rights-and-permissions-address2"
                  v-model="form.possibleRightsAndPermissionsAddress2"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-30">
              <md-field>
                <label for="possible-rights-and-permissions-city">City</label>
                <md-input
                  name="possible-rights-and-permissions-city"
                  id="possible-rights-and-permissions-city"
                  v-model="form.possibleRightsAndPermissionsCity"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-size-30">
              <md-field>
                <label for="possible-rights-and-permissions-state">State</label>
                <md-input
                  name="possible-rights-and-permissions-state"
                  id="possible-rights-and-permissions-state"
                  v-model="form.possibleRightsAndPermissionsState"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-size-40">
              <md-field>
                <label for="possible-rights-and-permissions-postal-code">Postal Code</label>
                <md-input
                  name="possible-rights-and-permissions-postal-code"
                  id="possible-rights-and-permissions-postal-code"
                  v-model="form.possibleRightsAndPermissionsPostalCode"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="possible-rights-and-permissions-country">Country</label>
                <md-input
                  name="possible-rights-and-permissions-country"
                  id="possible-rights-and-permissions-country"
                  v-model="form.possibleRightsAndPermissionsCountry"
                  :disabled="sending"
                  maxlength=255
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-60">
              <md-field :class="getValidationClass('possibleRightsAndPermissionsPhoneNumber')">
                <label for="possible-rights-and-permissions--phone-number" ref="possibleRightsAndPermissionsPhoneNumber">Phone Number</label>
                <md-input
                  name="possible-rights-and-permissions-phone-number"
                  id="possible-rights-and-permissions-phone-number"
                  autocomplete="tel"
                  v-model="form.possibleRightsAndPermissionsPhoneNumber"
                  :disabled="sending"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.possibleRightsAndPermissionsPhoneNumber.isValidPhoneNumber"
                >The Possible Rights and Permissions phone number must be 10 digits</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-30">
              <md-field>
                <label for="possible-rights-and-permissions-phone-number-extension">Ext.</label>
                <md-input
                  name="possible-rights-and-permissions-phone-number-extension"
                  id="possible-rights-and-permissions-phone-number-extension"
                  autocomplete="tel"
                  type="number"
                  v-model="form.possibleRightsAndPermissionsPhoneNumberExtension"
                  :disabled="sending"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('possibleRightsAndPermissionsEmail')">
                <label for="possible-rights-and-permissions-email" ref="possibleRightsAndPermissionsEmail">Email</label>
                <md-input
                  type="email"
                  name="possible-rights-and-permissions-email"
                  id="possible-rights-and-permissions-email"
                  autocomplete="email"
                  v-model="form.possibleRightsAndPermissionsEmail"
                  :disabled="sending"
                  maxlength=255
                />
                <span class="md-error" v-if="!$v.form.possibleRightsAndPermissionsEmail.email">Invalid email</span>
              </md-field>
            </div>
          </div>
        </details>
        <details open>
          <summary class="md-title">Notes to USCO</summary>
          <md-field :class="getValidationClass('notesToUsco')">
            <label ref="notesToUsco">Notes</label>
            <md-textarea v-model="form.notesToUsco" md-counter="2000" />
            <span
              class="md-error"
              v-if="!$v.form.notesToUsco.maxLength"
            >The USCO notes max length is 2000 characters</span>
          </md-field>
        </details>
        <details open>
          <summary class="md-title">Work Deposit</summary>
          <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-85">
            <md-field :class="getValidationClass('workDepositUrl')">
              <label ref="workDepositUrl">Work Deposit (.pdf)</label>
              <md-file required accept="application/pdf" @change="onWorkDepositsSelection($event.target.files)" />
              <span
                class="md-error"
                v-if="!$v.form.workDepositUrl.required"
              >The work deposit is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-5">
            <md-button :disabled="uploadingWorkDeposit" class="md-primary" @click="uploadWorkDeposits()">Upload</md-button>
          </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-progress-bar v-if="uploadingWorkDeposit" md-mode="indeterminate"></md-progress-bar>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <div v-if="form.workDepositUrl" class="uploaded-work-deposits">
                <a class="field-label" :href="form.workDepositUrl">{{form.workDepositName}}</a>
              </div>
            </div>
          </div>
        </details>
        <div class="form-actions">
          <md-button class="md-raised md-accent" type="submit">Next</md-button>
        </div>
      </div>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
      <md-dialog :md-active.sync="reviewCopyrightApplication">
        <md-dialog-title>Review</md-dialog-title>
        <md-dialog-content>
          <copyright-application-review :application="form" />
          <span class="md-title">Certification</span>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <p><strong>17 USC 506(e): Any person who knowingly makes a false representation of a material fact in the application
              for copyright registration provided by section 409, or in any written statement filed with the application,
              shall be fined not more than $2500.</strong></p>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-90">
              <p>*<strong>I certify</strong> that I am the author, copyright claimant, or owner of exclusive rights, or the authorized agent of the
              author, copyright claimant, or owner of exclusive rights of this work and that the information given in this
              application is correct to the best of my knowledge.</p>
            </div>
            <div class="md-layout-item md-size-10 certification">
              <md-checkbox v-model="certification" id="certification" name="certification"></md-checkbox>
            </div>
          </div>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-secondary" @click="closeFormReview()">Back</md-button>
          <md-button class="md-accent" @click="createCopyrightApplication()" id="submit" :disabled="sending || !certification">Submit</md-button>
        </md-dialog-actions>
      </md-dialog>
    </form>
    <div v-else class="loading-message"><span class="md-subheading">loading...</span></div>
    <md-dialog-alert class="error" :md-active.sync="errorOccured" md-title="Error Occured!" :md-content="errorMessage" />
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  minValue,
  maxValue,
  maxLength
} from 'vuelidate/lib/validators'
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/PhoneNumberFormatter'
import { replaceNonIso8895 } from '@/utils/ISO8895-15validator'
import { empty } from '@/utils/ValidationHelpers'
import CopyrightApplicationReview from './CopyrightApplicationReview'
let d = new Date()
let maxYearCompleted = d.getFullYear()
let minYearCompleted = maxYearCompleted - 125

export default {
  name: 'CreateCopyrightApplication',
  props: ['repository'],
  mixins: [validationMixin],
  components: {
    'copyright-application-review': CopyrightApplicationReview
  },
  data: () => ({
    minYearCompleted,
    maxYearCompleted,
    form: {
      id: null,
      primaryTitle: null,
      alternateTitle: null,
      yearCompleted: null,
      authorAnonymous: false,
      authorPrefix: null,
      authorFirstName: null,
      authorMiddleName: null,
      authorLastName: null,
      authorSuffix: null,
      authorPseudonym: 'n/a',
      authorCitizenship: null,
      authorDomicile: null,
      claimantPrefix: null,
      claimantFirstName: null,
      claimantMiddleName: null,
      claimantLastName: null,
      claimantSuffix: null,
      claimantAddress: null,
      claimantAddress2: null,
      claimantCity: null,
      claimantState: null,
      claimantPostalCode: null,
      claimantCountry: null,
      certificateContactPrefix: null,
      certificateContactFirstName: null,
      certificateContactMiddleName: null,
      certificateContactLastName: null,
      certificateContactSuffix: null,
      certificateContactAddress: null,
      certificateContactAddress2: null,
      certificateContactCity: null,
      certificateContactState: null,
      certificateContactPostalCode: null,
      certificateContactCountry: null,
      correspondenceContactPrefix: null,
      correspondenceContactFirstName: null,
      correspondenceContactMiddleName: null,
      correspondenceContactLastName: null,
      correspondenceContactSuffix: null,
      correspondenceEmail: null,
      correspondencePhoneNumber: null,
      correspondencePhoneNumberExtension: null,
      correspondenceContactAddress: null,
      correspondenceContactAddress2: null,
      correspondenceContactCity: null,
      correspondenceContactState: null,
      correspondenceContactPostalCode: null,
      correspondenceContactCountry: null,
      possibleRightsAndPermissionsPrefix: null,
      possibleRightsAndPermissionsFirstName: null,
      possibleRightsAndPermissionsMiddleName: null,
      possibleRightsAndPermissionsLastName: null,
      possibleRightsAndPermissionsSuffix: null,
      possibleRightsAndPermissionsAddress: null,
      possibleRightsAndPermissionsAddress2: null,
      possibleRightsAndPermissionsCity: null,
      possibleRightsAndPermissionsState: null,
      possibleRightsAndPermissionsPostalCode: null,
      possibleRightsAndPermissionsCountry: null,
      possibleRightsAndPermissionsPhoneNumber: null,
      possibleRightsAndPermissionsPhoneNumberExtension: null,
      possibleRightsAndPermissionsEmail: null,
      notesToUsco: null,
      serviceRequestId: null,
      applicationStatus: 'draft',
      workDepositName: null,
      workDepositUrl: null
    },
    customValidationFields: {
      primaryTitle: {
        invalid: false
      },
      alternateTitle: {
        invalid: false
      },
      yearCompleted: {
        invalid: false
      },
      authorCitizenship: {
        invalid: false
      },
      authorDomicile: {
        invalid: false
      }
    },
    copyrightApplicationSaved: false,
    lastCopyrightApplication: '',
    sending: false,
    prefixes: ['', 'Miss', 'Mr', 'Ms', 'Mrs', 'Dr', 'Prof'],
    suffixes: ['', 'II', 'III', 'Jr', 'Sr', 'Esq', 'MD', 'PhD'],
    useClaimantAddress: false,
    certification: false,
    errorOccured: false,
    errorMessage: null,
    reviewCopyrightApplication: false,
    savingDraft: false,
    loading: true,
    authorPseudonymous: false,
    workDepositsFormData: null,
    uploadingWorkDeposit: false
  }),
  async created () {
    const applicationId = parseInt(this.$route.query['id'])
    if (applicationId) {
      const draft = await this.repository._getCopyrightApplication(applicationId)
      Object.keys(this.form).forEach(k => { this.form[k] = draft[k] })
      this.form.id = applicationId
    } else {
      this.form.serviceRequestId = await this.repository._generateServiceRequest()
      this.saveDraft()
    }
    this.loading = false
  },
  validations: {
    form: {
      primaryTitle: {
        required,
        maxLength: maxLength(2000)
      },
      alternateTitle: {
        maxLength: maxLength(2000)
      },
      yearCompleted: {
        required,
        minValue: minValue(minYearCompleted),
        maxValue: maxValue(maxYearCompleted)
      },
      authorFirstName: {
        required
      },
      authorLastName: {
        required
      },
      authorPseudonym: {
        required
      },
      claimantFirstName: {
        required
      },
      claimantLastName: {
        required
      },
      claimantAddress: {
        required
      },
      claimantCity: {
        required
      },
      claimantState: {
        required
      },
      claimantPostalCode: {
        required
      },
      claimantCountry: {
        required
      },
      certificateContactFirstName: {
        required
      },
      certificateContactLastName: {
        required
      },
      certificateContactAddress: {
        required
      },
      certificateContactCity: {
        required
      },
      certificateContactState: {
        required
      },
      certificateContactPostalCode: {
        required
      },
      certificateContactCountry: {
        required
      },
      correspondenceContactFirstName: {
        required
      },
      correspondenceContactLastName: {
        required
      },
      correspondenceEmail: {
        required,
        email
      },
      correspondencePhoneNumber: {
        required,
        isValidPhoneNumber
      },
      correspondenceContactAddress: {
        required
      },
      correspondenceContactCity: {
        required
      },
      correspondenceContactState: {
        required
      },
      correspondenceContactPostalCode: {
        required
      },
      correspondenceContactCountry: {
        required
      },
      possibleRightsAndPermissionsEmail: {
        email
      },
      possibleRightsAndPermissionsPhoneNumber: {
        isValidPhoneNumber
      },
      notesToUsco: {
        maxLength: maxLength(2000)
      },
      workDepositUrl: {
        required
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      let field

      field = this.customValidationFields[fieldName]
      if (field && field.invalid) {
        return {
          'md-invalid': true
        }
      }

      field = this.$v.form[fieldName]
      if (field && field.$invalid && field.$dirty) {
        return {
          'md-invalid': true
        }
      }
    },
    clearForm () {
      this.$v.$reset()

      Object.keys(this.form).map(k => {
        typeof this.form[k] === 'boolean' ? this.form[k] = false : this.form[k] = null
      })

      Object.keys(this.customValidationFields).map(k => {
        this.customValidationFields[k].invalid = false
      })

      this.useClaimantAddress = false
      this.certification = false
    },
    async createCopyrightApplication () {
      this.sending = true
      this.lastCopyrightApplication = this.form.primaryTitle
      this.form.applicationStatus = 'under_review'
      const response = await this.repository._saveCopyrightApplication(this.form)
      if (response.error) {
        this.errorOccured = true
        this.errorMessage = response.error
      } else {
        this.copyrightApplicationSaved = true
        this.clearForm()
        this.$router.push({ name: 'Home' }).catch(_ => {})
      }

      this.sending = false
    },
    async validateCopyrightApplication () {
      this.$v.$touch()
      this.updateCustomValidations()

      if (!this.$v.$invalid && !this.invalidCustomValidationFields()) {
        this.reviewCopyrightApplication = true
      } else {
        this.scrollToInvalidField()
      }
    },
    copyClaimantAddress () {
      if (this.useClaimantAddress) {
        this.form.correspondenceContactPrefix = this.form.claimantPrefix
        this.form.correspondenceContactFirstName = this.form.claimantFirstName
        this.form.correspondenceContactMiddleName = this.form.claimantMiddleName
        this.form.correspondenceContactLastName = this.form.claimantLastName
        this.form.correspondenceContactSuffix = this.form.claimantSuffix
        this.form.correspondenceContactAddress = this.form.claimantAddress
        this.form.correspondenceContactAddress2 = this.form.claimantAddress2
        this.form.correspondenceContactCity = this.form.claimantCity
        this.form.correspondenceContactState = this.form.claimantState
        this.form.correspondenceContactPostalCode = this.form.claimantPostalCode
        this.form.correspondenceContactCountry = this.form.claimantCountry
      } else {
        this.form.correspondenceContactPrefix = null
        this.form.correspondenceContactFirstName = null
        this.form.correspondenceContactMiddleName = null
        this.form.correspondenceContactLastName = null
        this.form.correspondenceContactSuffix = null
        this.form.correspondenceContactAddress = null
        this.form.correspondenceContactAddress2 = null
        this.form.correspondenceContactCity = null
        this.form.correspondenceContactState = null
        this.form.correspondenceContactPostalCode = null
        this.form.correspondenceContactCountry = null
      }
    },
    toggleAnonymity () {
      this.form.authorPrefix = null
      this.form.authorSuffix = null
      if (this.form.authorAnonymous) {
        this.form.authorFirstName = 'anonymous'
        this.form.authorLastName = 'anonymous'
      } else {
        this.form.authorFirstName = null
        this.form.authorLastName = null
      }
    },
    togglePseudonymity () {
      if (this.authorPseudonymous) {
        this.form.authorPseudonym = null
      } else {
        this.form.authorPseudonym = 'n/a'
      }
    },
    validateField (field) {
      if (!this.$v.form[field]) {
        this.updateCustomValidations()
      } else {
        this.customValidationFields[field].invalid = this.$v.form[field].$invalid
      }
    },
    async saveDraft () {
      this.savingDraft = true
      const application = await this.repository._saveCopyrightApplication(this.form)
      if (application.id) { this.form.id = application.id }
      this.savingDraft = false
    },
    saveDraftWatchFn (oldVal, newVal) {
      if (oldVal !== newVal) this.saveDraft()
    },
    async saveAndClose () {
      await this.saveDraft()
      this.$router.push({ name: 'Home' }).catch(_ => {})
    },
    scrollToInvalidField () {
      const fields = Object.keys(this.form)
      for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
        if ((this.$v.form[field] && this.$v.form[field].$invalid) ||
            (this.customValidationFields[field] && this.customValidationFields[field].invalid)) {
          let element = this.$refs[field]
          element.scrollIntoView()
          break
        }
      }
    },
    closeFormReview () {
      this.reviewCopyrightApplication = false
      this.certification = false
    },
    updateCustomValidations () {
      if (empty(this.form.authorCitizenship) && empty(this.form.authorDomicile)) {
        this.customValidationFields.authorCitizenship.invalid = true
        this.customValidationFields.authorDomicile.invalid = true
      } else {
        this.customValidationFields.authorCitizenship.invalid = false
        this.customValidationFields.authorDomicile.invalid = false
      }
    },
    invalidCustomValidationFields () {
      const fields = Object.keys(this.customValidationFields)
      for (let i = 0; i < fields.length; i++) {
        if (this.customValidationFields[fields[i]].invalid) {
          return true
        }
      }
      return false
    },
    onWorkDepositsSelection (files) {
      const formData = new FormData()
      if (!files.length) return
      Array
        .from(Array(files.length).keys())
        .map(x => {
          this.form.workDepositName = files[x].name
          formData.append('file', files[x])
        })

      this.workDepositsFormData = formData
    },
    async uploadWorkDeposits () {
      this.uploadingWorkDeposit = true
      const fileUrl = await this.repository._uploadFile(this.workDepositsFormData, this.form.serviceRequestId)
      this.form.workDepositUrl = fileUrl
      this.uploadingWorkDeposit = false
      this.saveDraft()
    }
  },
  updated () {
    this.form.correspondencePhoneNumber = formatPhoneNumber(this.form.correspondencePhoneNumber)
    this.form.possibleRightsAndPermissionsPhoneNumber = formatPhoneNumber(this.form.possibleRightsAndPermissionsPhoneNumber)
    Object.keys(this.form).forEach(k => { this.form[k] = replaceNonIso8895(this.form[k]) })
  },
  watch: {
    'form.authorAnonymous': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.authorPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.authorSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.claimantPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.claimantSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.certificateContactPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.certificateContactSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.correspondenceContactPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.correspondenceContactSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.possibleRightsAndPermissionsPrefix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    'form.possibleRightsAndPermissionsSuffix': function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) },
    useClaimantAddress: function (oldVal, newVal) { this.saveDraftWatchFn(oldVal, newVal) }
  }
}
</script>

<style scoped lang="scss">
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.form {
  margin: auto;
}

.certification {
  margin-top: 22px;
}

.draft-message {
  padding-top: 12px;
}

.loading-message {
  display: flex;
  justify-content: center;
}

details {
  padding: 16px;
  margin: 0 0 28px 0;
  border: lightgrey 1px solid;
}

details > summary:before {
    content: "+ ";
}

details[open] > summary:before {
    content: "- ";
}

summary {
  cursor: pointer;
}

summary::-webkit-details-marker {
    display: none
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.switches {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 32px;
}

.author-name {
  display: flex;
  margin-bottom: 12px;
}

.author-name .field-label {
  padding-top: 12px;
  width: 100px;
}

.md-progress-bar {
  position: relative;
  margin: 24px;
}

.uploaded-work-deposits {
  display: flex;
  justify-content: center;
}

</style>
