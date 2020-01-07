<template>
  <div>
    <h2 class="header-title">Create copyright application</h2>
    <form novalidate class="md-layout" @submit.prevent="validateCopyrightApplication">
      <md-card class="md-layout-item md-size-80 form-card">
        <md-card-content>
          <md-card>
            <md-card-header class="md-headline">Title</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('primaryTitle')">
                    <label for="primary-title">Primary Title</label>
                    <md-input
                      name="primary-title"
                      id="primary-title"
                      v-model="form.primaryTitle"
                      :disabled="sending"
                      required
                      maxlength=2000
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.primaryTitle.required"
                    >The primary title is required</span>
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
                      maxlength=2000
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('yearCompleted')">
                    <label for="year-completed">Year Completed</label>
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
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header class="md-headline">Author</md-card-header>
            <md-card-content>
              <md-switch
                v-model="form.authorAnonymous"
                name="author-anonymous-btn"
                id="author-anonymous-btn"
                @change="toggleAuthorAnonymity">Anonymous
              </md-switch>
              <div class="md-layout md-gutter" v-if="!form.authorAnonymous">
                <div class="md-layout-item md-size-10">
                  <md-autocomplete
                    v-model="form.authorPrefix"
                    :md-options="prefixes"
                    md-input-name="author-prefix"
                    md-input-id="author-prefix"
                    md-input-maxlength=255>
                    <label>Prefix</label>
                  </md-autocomplete>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('authorFirstName')">
                    <label for="author-first-name">First Name</label>
                    <md-input
                      name="author-first-name"
                      id="author-first-name"
                      autocomplete="given-name"
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
                      autocomplete="given-name"
                      v-model="form.authorMiddleName"
                      :disabled="sending"
                      maxlength=255
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('authorLastName')">
                    <label for="author-last-name">Last Name</label>
                    <md-input
                      name="author-last-name"
                      id="author-last-name"
                      autocomplete="family-name"
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
                  <md-autocomplete
                    v-model="form.authorSuffix"
                    :md-options="suffixes"
                    md-input-name="author-suffix"
                    md-input-id="author-suffix"
                    md-input-maxlength=255>
                    <label>Suffix</label>
                  </md-autocomplete>
                </div>
              </div>
                <div class="md-layout md-gutter"  v-if="!form.authorAnonymous">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="author-pseudonym">Pseudonym</label>
                      <md-input
                        name="author-pseudonym"
                        id="author-pseudonym"
                        v-model="form.authorPseudonym"
                        :disabled="sending"
                        maxlength=255
                      />
                    </md-field>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field :class="getValidationClass('authorCitizenship')">
                      <label for="author-citizenship">Citizenship</label>
                      <md-input
                        name="author-citizenship"
                        id="author-citizenship"
                        v-model="form.authorCitizenship"
                        :disabled="sending"
                        required
                        maxlength=255
                      />
                      <span
                        class="md-error"
                        v-if="!$v.form.authorCitizenship.required"
                      >The author citizenship is required</span>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="author-domicile">Domicile</label>
                      <md-input
                        name="author-domicile"
                        id="author-domicile"
                        v-model="form.authorDomicile"
                        :disabled="sending"
                        maxlength=255
                      />
                    </md-field>
                  </div>
                </div>
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header class="md-headline">Claimant</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-10">
                  <md-autocomplete
                    v-model="form.claimantPrefix"
                    :md-options="prefixes"
                    md-input-name="claimant-prefix"
                    md-input-id="claimant-prefix"
                    md-input-maxlength=255>
                    <label>Prefix</label>
                  </md-autocomplete>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('claimantFirstName')">
                    <label for="claimant-first-name">First Name</label>
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
                      autocomplete="given-name"
                      v-model="form.claimantMiddleName"
                      :disabled="sending"
                      maxlength=255
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('claimantLastName')">
                    <label for="claimant-first-name">Last Name</label>
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
                  <md-autocomplete
                    v-model="form.claimantSuffix"
                    :md-options="suffixes"
                    md-input-name="claimant-suffix"
                    md-input-id="claimant-suffix"
                    md-input-maxlength=255>
                    <label>Suffix</label>
                  </md-autocomplete>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('claimantAddress')">
                    <label for="claimant-address">Address</label>
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
                    <label for="claimant-city">City</label>
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
                    <label for="claimant-state">State</label>
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
                    <label for="claimant-postal-code">Postal Code</label>
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
                <div class="md-layout-item md-size-100">
                  <md-field :class="getValidationClass('claimantCountry')">
                    <label for="claimant-country">Country</label>
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
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header class="md-headline">Correspondence</md-card-header>
            <md-card-content>
              <md-switch
                v-model="useClaimantAddress"
                @change="copyClaimantAddress"
                id="copy-claimant-address-btn"
                name="copy-claimant-address-btn">Use Claimant Address
              </md-switch>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-10">
                  <md-autocomplete
                    v-model="form.correspondenceContactPrefix"
                    :md-options="prefixes"
                    :disabled="sending || useClaimantAddress"
                    md-input-name="correspondence-contact-prefix"
                    md-input-id="correspondence-contact-prefix"
                    md-input-maxlength=255>
                    <label>Prefix</label>
                  </md-autocomplete>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('correspondenceContactFirstName')">
                    <label for="correspondence-contact-first-name">First Name</label>
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
                      autocomplete="given-name"
                      v-model="form.correspondenceContactMiddleName"
                      :disabled="sending || useClaimantAddress"
                      maxlength=255
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('correspondenceContactLastName')">
                    <label for="correspondence-contact-last-name">Last Name</label>
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
                  <md-autocomplete
                    v-model="form.correspondenceContactSuffix"
                    :md-options="suffixes"
                    :disabled="sending || useClaimantAddress"
                    md-input-name="correspondence-contact-suffix"
                    md-input-id="correspondence-contact-suffix"
                    md-input-maxlength=255>
                    <label>Suffix</label>
                  </md-autocomplete>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('correspondenceContactAddress')">
                    <label for="correspondence-contact-address">Address</label>
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
                    <label for="correspondence-contact-city">City</label>
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
                    <label for="correspondence-contact-state">State</label>
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
                    <label for="correspondence-contact-postal-code">Postal Code</label>
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
                <div class="md-layout-item md-size-100">
                  <md-field :class="getValidationClass('correspondenceContactCountry')">
                    <label for="correspondence-contact-country">Country</label>
                    <md-input
                      name="correspondence-contact-country"
                      id="correspondence-contact-postal-code"
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
                <div class="md-layout-item md-size-60">
                  <md-field :class="getValidationClass('correspondencePhoneNumber')">
                    <label for="correspondence-phone-number">Phone Number</label>
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
                <div class="md-layout-item md-size-40">
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
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('correspondenceEmail')">
                    <label for="correspondence-email">Email</label>
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
                    >The correspondence email is required</span>
                    <span class="md-error" v-else-if="$v.form.correspondenceEmail.email">Invalid email</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header class="md-headline">Rights &amp; Permissions</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-10">
                  <md-autocomplete
                    v-model="form.possibleRightsAndPermissionsPrefix"
                    :md-options="prefixes"
                    :disabled="sending"
                    md-input-name="possible-rights-and-permissions-prefix"
                    md-input-id="possible-rights-and-permissions-prefix"
                    md-input-maxlength=255>
                    <label>Prefix</label>
                  </md-autocomplete>
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
                      autocomplete="given-name"
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
                  <md-autocomplete
                    v-model="form.possibleRightsAndPermissionsSuffix"
                    :md-options="suffixes"
                    :disabled="sending"
                    md-input-name="possible-rights-and-permissions-suffix"
                    md-input-id="possible-rights-and-permissions-suffix"
                    md-input-maxlength=255>
                    <label>Suffix</label>
                  </md-autocomplete>
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
                <div class="md-layout-item md-size-100">
                  <md-field>
                    <label for="possible-rights-and-permissions-country">Country</label>
                    <md-input
                      name="possible-rights-and-permissions-country"
                      id="possible-rights-and-permissions-postal-code"
                      v-model="form.possibleRightsAndPermissionsCountry"
                      :disabled="sending"
                      maxlength=255
                    />
                  </md-field>
                </div>
              </div>
            </md-card-content>
          </md-card>
          <md-card>
            <md-card-header  class="md-headline">Certification</md-card-header>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <p><strong>17 USC 506(e): Any person who knowingly makes a false representation of a material fact in the application
                  for copyright registration provided by section 409, or in any written statement filed with the application,
                  shall be fined not more than $2500.</strong></p>
                </div>
                <div class="md-layout-item md-size-95">
                  <p>*<strong>I certify</strong> that I am the author, copyright claimant, or owner of exclusive rights, or the authorized agent of the
                  author, copyright claimant, or owner of exclusive rights of this work and that the information given in this
                  application is correct to the best of my knowledge.</p>
                </div>
                <div class="md-layout-item md-size-5">
                  <md-checkbox v-model="certification" id="certification" name="certification"></md-checkbox>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending || !certification">Create</md-button>
        </md-card-actions>
      </md-card>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
      <md-dialog :md-active.sync="copyrightApplicationSaved">
        <md-dialog-title>Success!</md-dialog-title>
        <md-dialog-content>{{lastCopyrightApplication}} was saved!</md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" to="/">Close</md-button>
        </md-dialog-actions>
      </md-dialog>
    </form>
    <md-dialog-alert class="error" :md-active.sync="errorOccured" md-title="Error Occured!" :md-content="errorMessage" />
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  minValue,
  maxValue
} from 'vuelidate/lib/validators'
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/PhoneNumberFormatter'
import { replaceNonIso8895 } from '@/utils/ISO8895-15validator'

let d = new Date()
let maxYearCompleted = d.getFullYear()
let minYearCompleted = maxYearCompleted - 125

export default {
  name: 'CreateCopyrightApplication',
  props: ['repository'],
  mixins: [validationMixin],
  data: () => ({
    minYearCompleted,
    maxYearCompleted,
    form: {
      primaryTitle: null,
      alternateTitle: null,
      yearCompleted: null,
      authorAnonymous: false,
      authorPrefix: null,
      authorFirstName: null,
      authorMiddleName: null,
      authorLastName: null,
      authorSuffix: null,
      authorPseudonym: null,
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
      possibleRightsAndPermissionsCountry: null
    },
    immediateValidationFields: {
      yearCompleted: {
        invalid: false
      }
    },
    copyrightApplicationSaved: false,
    lastCopyrightApplication: null,
    sending: false,
    prefixes: ['Dr', 'Mr', 'Mrs', 'Ms'],
    suffixes: ['Jr', 'Sr', 'III', 'Esq', 'MD', 'PhD'],
    useClaimantAddress: false,
    certification: false,
    errorOccured: false,
    errorMessage: null
  }),
  validations: {
    form: {
      primaryTitle: {
        required
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
      authorCitizenship: {
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
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      let ivField = this.immediateValidationFields[fieldName]
      if (ivField && ivField.invalid) {
        return {
          'md-invalid': true
        }
      }

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    clearForm () {
      this.$v.$reset()

      Object.keys(this.form).map(k => {
        if (typeof this.form[k] === 'boolean') {
          this.form[k] = false
        } else {
          this.form[k] = null
        }
      })

      Object.keys(this.immediateValidationFields).map(k => {
        this.immediateValidationFields[k].invalid = false
      })

      this.useClaimantAddress = false
      this.certification = false
    },
    async createCopyrightApplication () {
      this.sending = true
      this.lastCopyrightApplication = this.form.primaryTitle

      const response = await this.repository._createCopyrightApplication(this.form)
      if (response.error) {
        this.errorOccured = true
        this.errorMessage = response.error
      } else {
        this.copyrightApplicationSaved = true
        this.clearForm()
      }

      this.sending = false
    },
    async validateCopyrightApplication () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        await this.createCopyrightApplication()
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
    toggleAuthorAnonymity () {
      this.form.authorPrefix = null
      this.form.authorSuffix = null
      this.form.authorPseudonym = null
      this.form.authorCitizenship = null
      this.form.authorDomicile = null
      if (this.form.authorAnonymous) {
        this.form.authorFirstName = 'anonymous'
        this.form.authorLastName = 'anonymous'
        this.form.authorCitizenship = 'unk'
      } else {
        this.form.authorFirstName = null
        this.form.authorLastName = null
        this.form.authorCitizenship = null
      }
    },
    validateField (v) {
      this.immediateValidationFields[v].invalid = this.$v.form[v].$invalid
    }
  },
  updated () {
    this.form.correspondencePhoneNumber = formatPhoneNumber(this.form.correspondencePhoneNumber)
    Object.keys(this.form).map(k => {
      this.form[k] = replaceNonIso8895(this.form[k])
    })
  }
}
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.md-card {
  margin: 14px;
}

.form-card {
  margin: auto;
}
</style>
