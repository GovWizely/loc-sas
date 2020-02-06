<template>
  <div class="application-review">
    <div>
      <label><strong>Registration #: </strong></label><span>*-APPLICATION-*</span><br />
      <label><strong>Service Request #: </strong></label><span>{{application.serviceRequestId}}</span><br />
    </div>
    <hr>
    <div>
      <span class="md-headline">Mail Certificate</span>
      <p>
        <span>{{application.certificateContactFirstName}} {{application.certificateContactLastName}}</span><br />
        <span>{{application.certificateContactAddress}} {{application.certificateContactAddress2}}</span><br />
        <span>{{application.certificateContactCity}}, {{application.certificateContactState}} {{application.certificateContactPostalCode}} {{application.certificateContactCountry}}</span>
      </p>
    </div>
    <hr>
    <div>
      <span class="md-headline">Correspondent</span>
      <div class="col">
        <div class="col-left">
          <strong>Name:</strong><br />
          <strong>Email:</strong><br />
          <strong>Telephone:</strong><br />
          <strong>Address:</strong>
        </div>
        <div class="col-right">
          <span>{{application.correspondenceContactFirstName}} {{application.correspondenceContactLastName}}</span><br />
          <span>{{application.correspondenceEmail}}</span><br />
          <span>{{correspondencePhoneNumber()}}</span><br />
          <span>{{application.correspondenceContactAddress}} {{application.correspondenceContactAddress2}}</span><br />
          <span>{{application.correspondenceContactCity}}, {{application.correspondenceContactState}} {{application.correspondenceContactPostalCode}} {{application.correspondenceContactCountry}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <span class="md-headline">Title</span>
      <div class="col">
        <div class="col-left">
          <strong>Title of Work:</strong><br />
          <strong>Previous or Alternate Title:</strong><br />
        </div>
        <div class="col-right">
          <span>{{application.primaryTitle}}</span><br />
          <span>{{application.alternateTitle}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <span class="md-headline">Completion/Publication</span>
      <div class="col">
        <div class="col-left">
          <strong>Year of Completion:</strong>
        </div>
        <div class="col-right">
          <span>{{application.yearCompleted}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <span class="md-headline">Author</span>
      <div class="col">
        <div class="col-left">
          <strong>Author:</strong><br />
          <strong>Pseudonym:</strong><br />
          <strong>Citizen of:</strong><br />
          <strong>Pseudonymous:</strong>
        </div>
        <div class="col-right">
          <span>{{application.authorFirstName}} {{application.authorLastName}}</span><br />
          <span>{{application.authorPseudonym}}</span><br />
          <span>{{application.authorCitizenship}}</span><br />
          <span>{{isPseudonymous()}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <span class="md-headline">Copyright Claimant</span>
      <div class="col">
        <div class="col-left">
          <strong>Copyright Claimant:</strong><br />
        </div>
        <div class="col-right">
          <span>{{application.claimantFirstName}} {{application.claimantLastName}}</span><br />
          <span>{{application.claimantAddress}} {{application.claimantAddress2}}</span><br />
          <span>{{application.claimantCity}}, {{application.claimantState}} {{application.claimantPostalCode}} {{application.claimantCountry}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <span class="md-headline">Certificate</span>
      <div class="col">
        <div class="col-left">
          <strong>Name:</strong><br />
          <strong>Address:</strong>
        </div>
        <div class="col-right">
          <span>{{application.certificateContactFirstName}} {{application.certificateContactLastName}}</span><br />
          <span>{{application.certificateContactAddress}} {{application.certificateContactAddress2}}</span><br />
          <span>{{application.certificateContactCity}}, {{application.certificateContactState}} {{application.certificateContactPostalCode}} {{application.certificateContactCountry}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <span class="md-headline">Rights and Permissions</span>
      <div class="col">
        <div class="col-left">
          <strong>Name:</strong><br />
          <strong>Email:</strong><br />
          <strong>Telephone:</strong><br />
          <strong>Address:</strong>
        </div>
        <div class="col-right">
          <span>{{application.possibleRightsAndPermissionsFirstName}} {{application.possibleRightsAndPermissionsLastName}}</span><br />
          <span>{{application.possibleRightsAndPermissionsEmail}}</span><br />
          <span>{{possibleRightsAndPermissionsPhoneNumber()}}</span><br />
          <span>{{application.possibleRightsAndPermissionsAddress}} {{application.possibleRightsAndPermissionsAddress2}}</span><br />
          <span>{{application.possibleRightsAndPermissionsCity}}, {{application.possibleRightsAndPermissionsState}} {{application.possibleRightsAndPermissionsPostalCode}} {{application.possibleRightsAndPermissionsCountry}}</span><br />
        </div>
      </div>
    </div>
    <hr>
    <div v-if="application.notesToUsco">
      <span class="md-headline">Notes to USCO</span>
      <div class="col">
        <div class="col-left">
          <strong>Notes:</strong>
        </div>
        <div class="col-right">
          <span>{{application.notesToUsco}}</span>
        </div>
      </div>
      <hr>
    </div>
    <div>
      <span class="md-headline">Work Deposit</span>
      <div class="col">
        <div class="col-left">
          <strong>File:</strong>
        </div>
        <div class="col-right">
          <span>{{application.workDepositName}}</span>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CopyrightApplicationReview',
  props: ['application'],
  data: () => ({
    date: null
  }),
  methods: {
    isPseudonymous () {
      return this.application.authorPseudonym !== null ? 'Yes' : 'No'
    },
    correspondencePhoneNumber (phoneNumber, extension) {
      if (this.application.correspondencePhoneNumberExtension) {
        return this.application.correspondencePhoneNumber + ' X' + this.application.correspondencePhoneNumberExtension
      } else {
        return this.application.correspondencePhoneNumber
      }
    },
    possibleRightsAndPermissionsPhoneNumber (phoneNumber, extension) {
      if (this.application.possibleRightsAndPermissionsPhoneNumberExtension) {
        return this.application.possibleRightsAndPermissionsPhoneNumber + ' X' + this.application.possibleRightsAndPermissionsPhoneNumberExtension
      } else {
        return this.application.possibleRightsAndPermissionsPhoneNumber
      }
    }
  }
}
</script>
<style scoped lang="scss">
.application-review {
  width: 800px;
  padding: 12px;
}

.col {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.col-left {
  width: 30%;
  text-align: end;
  padding-right: 12px;
}

.col-right {
  width: 70%;
}

hr {
  margin-top: 22px;
}
</style>
