<template>
  <div class="md-layout-item md-size-80 form">
    <h2 class="md-title">Review, certify and submit</h2>
    <p>Please review the information in this application carefully. After reviewing, you must certify the application before you can submit it. If you make changes to the application, you must certify it again, prior to submitting.</p>
    <details open>
      <summary class="md-title">Application Review</summary>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Registration Number:</label>
        </div>
        <div class="col-right">
          <span>*-APPLICATION-*</span>
        </div>
      </div>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Service Request Number:</label>
        </div>
        <div class="col-right">
          <span>{{application.serviceRequestId}}</span>
        </div>
      </div>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Certificate:</label>
        </div>
        <div class="col-right">
          <span>{{formatName(
            application.certificateContactPrefix,
            application.certificateContactFirstName,
            application.certificateContactMiddleName,
            application.certificateContactLastName,
            application.certificateContactSuffix)}}</span><br />
          <span>{{application.certificateContactAddress}} {{application.certificateContactAddress2}}</span><br />
          <span>{{formatCityStateZipCountry(
            application.certificateContactCity,
            application.certificateContactState,
            application.certificateContactPostalCode,
            application.certificateContactCountry)}}</span>
        </div>
      </div>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Correspondence:</label>
        </div>
        <div class="col-right">
          <span>{{formatName(
            application.correspondenceContactPrefix,
            application.correspondenceContactFirstName,
            application.correspondenceContactMiddleName,
            application.correspondenceContactLastName,
            application.correspondenceContactSuffix)}}</span><br />
          <span>{{application.correspondenceContactAddress}} {{application.correspondenceContactAddress2}}</span><br />
          <span>{{formatCityStateZipCountry(
            application.correspondenceContactCity,
            application.correspondenceContactState,
            application.correspondenceContactPostalCode,
            application.correspondenceContactCountry)}}</span><br />
          <span>{{correspondencePhoneNumber()}}</span><br />
          <span>{{application.correspondenceEmail}}</span>
        </div>
      </div>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Primary Title:</label>
        </div>
        <div class="col-right">
          <span>{{application.primaryTitle}}</span>
        </div>
      </div>
      <div class="col" v-if="application.alternateTitle">
        <div class="col-left">
          <label class="field-label">Alternate Title:</label>
        </div>
        <div class="col-right">
          <span>{{application.alternateTitle}}</span>
        </div>
      </div>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Year Completed:</label>
        </div>
        <div class="col-right">
          <span>{{application.yearCompleted}}</span>
        </div>
      </div>
      <div class="col" v-if="application.authorFirstName || application.authorLastName">
        <div class="col-left">
          <label class="field-label">Author:</label>
        </div>
        <div class="col-right">
          <span>{{formatName(
            application.authorPrefix,
            application.authorFirstName,
            application.authorMiddleName,
            application.authorLastName,
            application.authorSuffix)}}</span>
        </div>
      </div>
      <div class="col" v-if="application.authorPseudonym">
        <div class="col-left">
          <label class="field-label">Pseudonym:</label>
        </div>
        <div class="col-right">
          <span>{{application.authorPseudonym}}</span>
        </div>
      </div>
      <div class="col" v-if="application.authorCitizenship">
        <div class="col-left">
          <label class="field-label">Citizenship:</label>
        </div>
        <div class="col-right">
          <span>{{application.authorCitizenship}}</span>
        </div>
      </div>
       <div class="col" v-if="application.authorDomicile">
        <div class="col-left">
          <label class="field-label">Domicile:</label>
        </div>
        <div class="col-right">
          <span>{{application.authorDomicile}}</span>
        </div>
      </div>
      <div class="col" v-if="application.authorYearOfBirth">
        <div class="col-left">
          <label class="field-label">Year of Birth:</label>
        </div>
        <div class="col-right">
          <span>{{application.authorYearOfBirth}}</span>
        </div>
      </div>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Copyright Claimant:</label>
        </div>
        <div class="col-right">
          <span>{{formatName(
            application.claimantPrefix,
            application.claimantFirstName,
            application.claimantMiddleName,
            application.claimantLastName,
            application.claimantSuffix)}}</span><br />
          <span>{{application.claimantAddress}} {{application.claimantAddress2}}</span><br />
          <span>{{formatCityStateZipCountry(
            application.claimantCity,
            application.claimantState,
            application.claimantPostalCode,
            application.claimantCountry)}}</span>
        </div>
      </div>
      <div class="col" v-if="hasRightsAndPermissonsAddress()">
        <div class="col-left">
          <label class="field-label">Rights and Permissions:</label>
        </div>
        <div class="col-right">
          <span>{{formatName(
            application.possibleRightsAndPermissionsPrefix,
            application.possibleRightsAndPermissionsFirstName,
            application.possibleRightsAndPermissionsMiddleName,
            application.possibleRightsAndPermissionsLastName,
            application.possibleRightsAndPermissionsSuffix)}}</span><br />
          <span>{{application.possibleRightsAndPermissionsAddress}} {{application.possibleRightsAndPermissionsAddress2}}</span><br />
          <span>{{formatCityStateZipCountry(
            application.possibleRightsAndPermissionsCity,
            application.possibleRightsAndPermissionsState,
            application.possibleRightsAndPermissionsPostalCode,
            application.possibleRightsAndPermissionsCountry)}}</span><br />
          <span>{{possibleRightsAndPermissionsPhoneNumber()}}</span><br />
          <span>{{application.possibleRightsAndPermissionsEmail}}</span>
        </div>
      </div>
      <div class="col" v-if="application.notesToUsco">
        <div class="col-left">
          <label class="field-label">Notes to USCO</label>
        </div>
        <div class="col-right">
          <span>{{application.notesToUsco}}</span>
        </div>
      </div>
      <div class="col">
        <div class="col-left">
          <label class="field-label">Work Deposit:</label>
        </div>
        <div class="col-right">
          <span>{{application.workDepositName}}</span>
        </div>
      </div>
    </details>
    <details open>
      <summary class="md-title">Certify and submit</summary>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-small-size-100">
          <p>
            <strong>
              17 USC 506(e): Any person who knowingly makes a false representation of a material fact in the application
              for copyright registration provided by section 409, or in any written statement filed with the application,
              shall be fined not more than $2500.
            </strong>
          </p>
        </div>
      </div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-small-size-100 certification">
          <md-checkbox v-model="certification" id="certification" name="certification"></md-checkbox>
          <p>
            *
            <strong>I certify</strong> that I am the author, copyright claimant, or owner of exclusive rights, or the authorized agent of the
            author, copyright claimant, or owner of exclusive rights of this work and that the information given in this
            application is correct to the best of my knowledge.
          </p>
        </div>
      </div>
    </details>
    <div class="review-form-buttons">
      <md-button @click="closeApplicationReview()">Back</md-button>
      <md-button
        class="md-raised md-accent"
        @click="submit()"
        id="submit"
        :disabled="!certification"
      >Submit</md-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CopyrightApplicationReview',
  props: ['application', 'show', 'close', 'submit'],
  data: () => ({
    date: null,
    certification: false
  }),
  methods: {
    correspondencePhoneNumber (phoneNumber, extension) {
      if (this.application.correspondencePhoneNumberExtension) {
        return this.application.correspondencePhoneNumber.concat(' X', this.application.correspondencePhoneNumberExtension)
      } else {
        return this.application.correspondencePhoneNumber
      }
    },
    possibleRightsAndPermissionsPhoneNumber (phoneNumber, extension) {
      if (this.application.possibleRightsAndPermissionsPhoneNumberExtension) {
        return this.application.possibleRightsAndPermissionsPhoneNumber.concat(' X', this.application.possibleRightsAndPermissionsPhoneNumberExtension)
      } else {
        return this.application.possibleRightsAndPermissionsPhoneNumber
      }
    },
    formatCityStateZipCountry (city, state, zip, country) {
      return ''.concat(city, ', ', state, ' ', zip, ' ', country)
    },
    formatName (prefix, first, middle, last, suffix) {
      let appendBlankSpace = (v) => {
        return v ? v + ' ' : ''
      }

      return ''.concat(
        appendBlankSpace(prefix),
        appendBlankSpace(first),
        appendBlankSpace(middle),
        appendBlankSpace(last),
        appendBlankSpace(suffix))
    },
    hasRightsAndPermissonsAddress () {
      return this.application.possibleRightsAndPermissionsFirstName ||
        this.application.possibleRightsAndPermissionsLastName ||
        this.application.possibleRightsAndPermissionsAddress ||
        this.application.possibleRightsAndPermissionsAddress2 ||
        this.application.possibleRightsAndPermissionsCity ||
        this.application.possibleRightsAndPermissionsState ||
        this.application.possibleRightsAndPermissionsPostalCode ||
        this.application.possibleRightsAndPermissionsCountry ||
        this.application.possibleRightsAndPermissionsPhoneNumber
    },
    closeApplicationReview () {
      this.certification = false
      this.close()
    }
  }
}
</script>
<style scoped lang="scss">
.application-review {
  margin: auto;
}

.col {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.col-left {
  width: 20%;
  text-align: end;
  padding-right: 12px;
}

.col-right {
  width: 80%;
}

hr {
  margin-top: 22px;
}

.certification {
  display: flex;
}

.review-form-buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
