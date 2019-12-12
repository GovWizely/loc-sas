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

pip-install:  ## Pip install `requirements.txt`
	pip install -r requirements.txt

# =========
# = Tests =
# =========

test-local: ensure-venv clean  ## Run lint and tests
	flake8
	python -m pytest -s --disable-pytest-warnings --cov=app --cov-report=html:/tmp/test-artifacts/coverage --cov-fail-under=90 --junitxml=/tmp/test-results/pytest.xml
