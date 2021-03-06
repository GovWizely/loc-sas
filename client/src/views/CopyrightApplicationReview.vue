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
      <div class="col" id="service-request-id">
        <div class="col-left">
          <label class="field-label">Service Request Number:</label>
        </div>
        <div class="col-right">
          <span>{{application.serviceRequestId}}</span>
        </div>
      </div>
      <div class="col" id="primary-title">
        <div class="col-left">
          <label class="field-label">Primary Title:</label>
        </div>
        <div class="col-right">
          <span>{{application.primaryTitle}}</span>
        </div>
      </div>
      <div class="col" id="alternate-title" v-if="application.alternateTitle">
        <div class="col-left">
          <label class="field-label">Alternate Title:</label>
        </div>
        <div class="col-right">
          <span>{{application.alternateTitle}}</span>
        </div>
      </div>
      <div class="col" id="year-completed">
        <div class="col-left">
          <label class="field-label">Year Completed:</label>
        </div>
        <div class="col-right">
          <span>{{application.yearCompleted}}</span>
        </div>
      </div>
      <div class="col" id="publication-date" v-if="application.publicationDate">
        <div class="col-left">
          <label class="field-label">Publication Date:</label>
        </div>
        <div class="col-right">
          <span>{{publicationDate()}}</span>
        </div>
      </div>
      <div class="col" id="nation-of-first-publication" v-if="application.publicationCountry">
        <div class="col-left">
          <label class="field-label">Nation of First Publication:</label>
        </div>
        <div class="col-right">
          <span>{{application.publicationCountry}}</span>
        </div>
      </div>
      <div v-for="author in application.authors" :key="'author-'+author.id" :id="'author-'+author.id">
        <div class="col organization-name" v-if="author.organization">
          <div class="col-left">
            <label class="field-label">Author:</label>
          </div>
          <div class="col-right">
            <span>{{author.organizationName}}</span>
          </div>
        </div>
        <div class="col full-name" v-if="!author.organization && (author.firstName || author.lastName)">
          <div class="col-left">
            <label class="field-label">Author:</label>
          </div>
          <div class="col-right">
            <span>{{formatName(
              author.prefix,
              author.firstName,
              author.middleName,
              author.lastName,
              author.suffix)}}</span>
          </div>
        </div>
        <div class="col pseudonym" v-if="!author.organization && author.pseudonym">
          <div class="col-left">
            <label class="field-label">Pseudonym:</label>
          </div>
          <div class="col-right">
            <span>{{author.pseudonym}}</span>
          </div>
        </div>
        <div class="col citizenship" v-if="!author.organization && author.citizenship">
          <div class="col-left">
            <label class="field-label">Citizenship:</label>
          </div>
          <div class="col-right">
            <span>{{author.citizenship}}</span>
          </div>
        </div>
        <div class="col domicile" v-if="author.domicile">
          <div class="col-left">
            <label class="field-label">Domicile:</label>
          </div>
          <div class="col-right">
            <span>{{author.domicile}}</span>
          </div>
        </div>
        <div class="col year-of-birth" v-if="!author.organization && author.yearOfBirth">
          <div class="col-left">
            <label class="field-label">Year of Birth:</label>
          </div>
          <div class="col-right">
            <span>{{author.yearOfBirth}}</span>
          </div>
        </div>
        <div class="col deceased" v-if="!author.organization && author.yearOfDeath">
          <div class="col-left">
            <label class="field-label">Deceased:</label>
          </div>
          <div class="col-right">
            <span>{{author.yearOfDeath}}</span>
          </div>
        </div>
        <div class="col work-made-for-hire">
          <div class="col-left">
            <label class="field-label">Work Made For Hire:</label>
          </div>
          <div class="col-right">
            <span v-if="author.organization">Yes</span>
            <span v-else>No</span>
          </div>
        </div>
      </div>

      <div v-for="claimant in application.claimants" :key="'claimant-'+claimant.id" :id="'claimant-'+ claimant.id">
        <div class="col">
          <div class="col-left">
            <label class="field-label">Copyright Claimant:</label>
          </div>
          <div class="col-right">
            <div class="organization-name" v-if="claimant.organization">
              <span>{{claimant.organizationName}}</span>
            </div>
            <div v-else class="full-name">
            <span>{{formatName(
              claimant.prefix,
              claimant.firstName,
              claimant.middleName,
              claimant.lastName,
              claimant.suffix)}}</span>
            </div>
            <span class="address-line-1">{{claimant.address}} {{claimant.address2}}</span><br />
            <span class="address-line-2">{{formatCityStateZipCountry(
              claimant.city,
              claimant.state,
              claimant.postalCode,
              claimant.country)}}</span>
          </div>
        </div>
      </div>

      <div id="possible-rights-and-permissions" class="col" v-if="hasRightsAndPermissonsAddress()">
        <div class="col-left">
          <label class="field-label">Rights and Permissions:</label>
        </div>
        <div class="col-right">
          <span class="full-name">{{formatName(
            application.possibleRightsAndPermissionsPrefix,
            application.possibleRightsAndPermissionsFirstName,
            application.possibleRightsAndPermissionsMiddleName,
            application.possibleRightsAndPermissionsLastName,
            application.possibleRightsAndPermissionsSuffix)}}</span><br />
          <div class="organization-name" v-if="application.possibleRightsAndPermissionsOrganizationName">
            <span>
              {{application.possibleRightsAndPermissionsOrganizationName}}
            </span><br />
          </div>
          <span class="address-line-1">{{application.possibleRightsAndPermissionsAddress}} {{application.possibleRightsAndPermissionsAddress2}}</span><br />
          <span class="address-line-2">{{formatCityStateZipCountry(
            application.possibleRightsAndPermissionsCity,
            application.possibleRightsAndPermissionsState,
            application.possibleRightsAndPermissionsPostalCode,
            application.possibleRightsAndPermissionsCountry)}}</span><br />
          <span class="phone-number">{{possibleRightsAndPermissionsPhoneNumber()}}</span><br />
          <span class="email">{{application.possibleRightsAndPermissionsEmail}}</span>
        </div>
      </div>
      <div class="col" v-if="application.notesToUsco">
        <div class="col-left">
          <label class="field-label">Notes to USCO</label>
        </div>
        <div id="notes-to-usco" class="col-right">
          <span>{{application.notesToUsco}}</span>
        </div>
      </div>
      <div class="col" id="work-deposit-name">
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
    publicationDate () {
      return this.application.publicationDate.substring(0, 2) + '/' +
        this.application.publicationDate.substring(2, 4) + '/' +
        this.application.publicationDate.substring(4, 8)
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
