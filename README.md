# LoC SAS

[![CircleCI](https://circleci.com/gh/GovWizely/loc-sas.svg?style=svg)](https://circleci.com/gh/GovWizely/loc-sas)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=GovWizely/loc-sas)](https://dependabot.com)

A web application that enables users to submit copyright applications via an online portal.

## Installation

### Dependencies

- This project is built on [Flask-AppBuilder](https://github.com/dpgaspar/Flask-AppBuilder) and tested against Python 3.6+ in [CircleCI](https://app.circleci.com/github/GovWizely/loc-sas/pipelines).
- The frontend utilizes Vue JS; NPM is required to build and run it [Install NPM](https://www.npmjs.com/get-npm)

### Local Development

Set up your virtual environment with all the necessary packages:

```bash
git clone git@github.com:GovWizely/loc-sas.git
cd loc-sas
mkvirtualenv -p /usr/local/bin/python3.7 -r requirements.txt loc-sas
```

If you are using PyCharm, make sure you enable code compatibility inspections for Python 3.6/3.7/3.8.

### Running locally

***Backend***

These commands will remove any stray local Sqlite database, create some test data and test users, create an admin user, and run the Flask application.

```bash
rm -f app.db
python testdata.py
flask fab create-admin --username admin --password admin --email admin@example.org --firstname admin --lastname user
FLASK_APP=app/__init__.py FLASK_DEBUG=1 flask run
```

Open `http://localhost:5000` and log in as `user1`, `user2`, or `user3` with password `password`. Or login with `admin/admin`.

***Frontend***

```bash
cd client
npm install
npm run serve
```

- Open `http://localhost:5001`, you will be automatically logged in as user1
- The client interfaces with backend API calls.
- A login screen will be added once OAUTH2 is configured with an authentication provider.  

To build the frontend into the flask server for production:

```bash
cd ..
./build-client.sh
```

### Testing

***Backend***

To run the backend test-suite along with linting:

```bash
make test-local
```

***Frontend***

To run the frontend test-suite:

```bash
cd client
npm test
```

***SonarQube***

You can run LoC's SonarQube analysis locally against your current feature branch.

[Download the sonar scanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/) for your development environment OS.

Set up this environment variable based on where you installed the scanner:

```bash
export SONAR_SCANNER=/Users/loren/Downloads/sonar-scanner-4.2.0.1873-macosx/bin/sonar-scanner
```

Ensure your LoC VPN is enabled.

Generate the test results in the Cobertura format that SonarQube requires and send the results in to the scanner:

```bash
make sonarqube
```

PyCharm users can integrate the SonarLint plugin and tie it into the LoC's SonarQube server to apply this project's Quality Profiles during development.

First, ensure your LoC VPN is enabled. In PyCharm, download and install the SonarQube Community Intellij Plugin and the SonarLint Plugin. You'll need to restart PyCharm afterwards.

![Download Plugins](screenshots/download_plugins.png)

Create the SonarQube Server connection:

![Connect to SonarQube Server](screenshots/configure_sonarqube.png)

Configure the SonarLint plugin for PyCharm:
![Configure SonarLint General](screenshots/configure_sonarlint_general.png)

Configure the SonarLint plugin for this project:
![Configure SonarLint Project](screenshots/configure_sonarlint_project.png)

Here is an example of what the integration looks like in PyCharm:
![Example SonarLint Issue](screenshots/example_sonarlint_issue.png)

## Applicantion Screenshots

Home Page
![Home Page](screenshots/loc-copyright-home-page.png)
Create Application
![Create Application](screenshots/loc-copyright-application.png)
Application Review
![Application Review](screenshots/loc-copyright-application-review.png)
