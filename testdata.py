import logging
import random
import uuid
from datetime import datetime

from app import appbuilder, db
from app.models import CopyrightApplication

log = logging.getLogger(__name__)


def get_random_name(names_list, size=1):
    name_lst = [
        names_list[random.randrange(0, len(names_list))].decode("utf-8").capitalize()
        for _ in range(0, size)
    ]
    return " ".join(name_lst)


role_user = appbuilder.sm.find_role("User")
users_exist = appbuilder.sm.find_user("user1")

if not users_exist:
    user1 = appbuilder.sm.add_user(
        "user1", "user1", "test", "user1@example.org", role_user, "password"
    )
    user2 = appbuilder.sm.add_user(
        "user2", "user2", "test", "user2@example.org", role_user, "password"
    )
    user3 = appbuilder.sm.add_user(
        "user3", "user3", "test", "user3@example.org", role_user, "password"
    )

    f = open("NAMES.DIC", "rb")
    names_list = [x.strip() for x in f.readlines()]

    f.close()

    j = 1
    for i in range(1, 75):
        c = CopyrightApplication()
        c.primary_title = get_random_name(names_list, random.randrange(2, 5))
        c.year_completed = random.choice(range(2013, 2019))
        name = c.primary_title.split()
        c.author_first_name = name[0]
        c.author_last_name = name[-1]
        c.author_citizenship = random.choice(["US", "GB", "CA", "MX", "JP"])
        c.author_domicile = random.choice(["GR", "IT", "KY", "MD"])
        c.author_year_of_birth = "1990"
        c.claimant_first_name = name[0]
        c.claimant_last_name = name[-1]
        c.claimant_address = "3333 Fairfax Dr"
        c.claimant_city = "Arlington"
        c.claimant_state = "VA"
        c.claimant_postal_code = "22203"
        c.claimant_country = "US"
        month = random.choice(range(1, 12))
        day = random.choice(range(1, 28))
        c.created_on = datetime(int(c.year_completed), month, day)
        c.changed_on = datetime.now()
        if j == 1:
            j += 1
            _user = user1
        elif j == 2:
            j += 1
            _user = user2
        else:
            j = 1
            _user = user3
        c.created_by = _user
        c.changed_by = _user
        c.service_request_id = str(uuid.uuid1())
        c.application_status = random.choice(["draft", "under_review", "approved"])
        c.work_deposit_name = "The Best Book.pdf"
        c.work_deposit_url = "https://some-cloud-storage.io/us-copyright-office/the_best_book.pdf"
        db.session.add(c)
        try:
            db.session.commit()
            print("inserted", c)
        except Exception as e:
            log.error("CopyrightApplication creation error: %s", e)
            db.session.rollback()
