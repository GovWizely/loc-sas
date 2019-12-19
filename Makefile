PROJECT=loc-sas
SHELL=/bin/bash


# ========================
# = Local env management =
# ========================

clean:  ## Remove build, cache, pyc files, test Sqlite DBs, and build artifacts
	rm -rf build/ dist/ .eggs/ $PROJECT.egg-info/ test.db
	find . -iname '*.pyc' -o -iname '__pycache__' | xargs rm -rf

ensure-venv:
	@ ( \
		[ \( "x${VIRTUAL_ENV}" != "x" \) -o \( "x${CI}" != "x" \) ] || \
		( echo 'Please activate your venv using "workon ${PROJECT}"'; exit 1 ) \
	)

pip-install:  ## Pip install `requirements-test.txt`, which also installs `requirements.txt`
	pip install -r requirements-test.txt

# =========
# = Tests =
# =========

test-local: ensure-venv clean  ## Run lint and tests
	flake8
	python -m pytest -s --disable-pytest-warnings tests --cov=app --cov-report=html:/tmp/test-artifacts/coverage --cov-fail-under=90 --junitxml=/tmp/test-results/pytest.xml

sonarqube: test-local
	python -m pytest -s --disable-pytest-warnings tests --cov=app --cov-report=xml:/tmp/scannerwork/coverage.xml --junitxml=/tmp/scannerwork/pytest.xml
	${SONAR_SCANNER} -Dsonar.projectKey=loc-sas -Dsonar.sources=app -Dsonar.host.url=https://code-quality-test.loc.gov -Dsonar.login=c5149db772b1643dc92b6778c2e44d8d2fa6b961 -Dsonar.python.coverage.reportPaths=/tmp/scannerwork/coverage.xml -Dsonar.python.xunit.reportPath=/tmp/scannerwork/pytest.xml -Dsonar.projectVersion=`git rev-parse --abbrev-ref HEAD`
