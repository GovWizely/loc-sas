import logging
import random
from datetime import datetime

from app import appbuilder, db
from app.models import CopyrightApplication, Organization

log = logging.getLogger(__name__)


def get_random_name(names_list, size=1):
    name_lst = [
        names_list[random.randrange(0, len(names_list))].decode("utf-8").capitalize()
        for _dummy in range(0, size)
    ]
    return " ".join(name_lst)


role_user = appbuilder.sm.find_role("User")
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
for i in range(1, 100):
    c = CopyrightApplication()
    c.title = get_random_name(names_list, random.randrange(2, 5))
    c.alternative_title = get_random_name(names_list, random.randrange(2, 5))
    c.year_completed = random.choice(range(2013, 2019))
    name = c.title.split()
    c.author_first_name = name[0]
    c.author_last_name = name[-1]
    c.author_citizenship = random.choice(["USA", "GB", "CA", "MX", "JP"])
    c.claimant_first_name = name[0]
    c.claimant_last_name = name[-1]
    c.claimant_address = "foo"
    c.claimant_city = "foo"
    c.claimant_state = "foo"
    c.claimant_postal_code = "foo"
    c.contact_first_name = name[0]
    c.contact_last_name = name[-1]
    c.contact_address = "foo"
    c.contact_city = "foo"
    c.contact_state = "foo"
    c.contact_postal_code = "foo"
    c.contact_2_first_name = name[0]
    c.contact_2_last_name = name[-1]
    c.contact_2_address = "foo"
    c.contact_2_city = "foo"
    c.contact_2_state = "foo"
    c.contact_2_postal_code = "foo"
    c.application_status = "New"
    c.correspondence_email = "foo@bar.baz"
    c.correspondence_phone_number = "800-555-1212"
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

    db.session.add(c)
    try:
        db.session.commit()
        print("inserted", c)
    except Exception as e:
        log.error("CopyrightApplication creation error: %s", e)
        db.session.rollback()