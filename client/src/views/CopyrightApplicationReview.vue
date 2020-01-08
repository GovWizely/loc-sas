<template>
  <div class="application-review">
    <div>
      <label><strong>Registration #: </strong></label><span>*-APPLICATION-*</span><br />
      <label><strong>Service Request #: </strong></label><span>1-9019041701</span>
    </div>
    <hr>
    <div>
      <h2>Mail Certificate</h2>
      <p>
        ### ToDo Ln.<br />
        Washington, DC 12345
      </p>
    </div>
    <hr>
    <div>
      <h2>Correspondent</h2>
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
      <h2>Title</h2>
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
      <h2>Completion/Publication</h2>
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
      <h2>Author</h2>
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
      <h2>Copyright Claimant</h2>
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
      <h2>Rights and Permissions</h2>
      <div class="col">
        <div class="col-left">
          <strong>Name:</strong><br />
          <strong>Address:</strong>
        </div>
        <div class="col-right">
          <span>{{application.possibleRightsAndPermissionsFirstName}} {{application.possibleRightsAndPermissionsLastName}}</span><br />
          <span>{{application.possibleRightsAndPermissionsAddress}} {{application.possibleRightsAndPermissionsAddress2}}</span><br />
          <span>{{application.possibleRightsAndPermissionsCity}}, {{application.possibleRightsAndPermissionsState}} {{application.possibleRightsAndPermissionsPostalCode}} {{application.possibleRightsAndPermissionsCountry}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <h2>Certification</h2>
      <div class="col">
        <div class="col-left">
          <strong>Date:</strong><br />
        </div>
        <div class="col-right">
          <span>{{this.date}}</span><br />
        </div>
      </div>
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
    }
  },
  created () {
    let d = new Date()
    this.date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}
</script>
<style scoped>
.application-review {
  width: 800px;
  padding: 12px;
}

.col {
  display: flex;
  justify-content: space-between;
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
