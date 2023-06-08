import random
import time
from utils import (
    Publication,
    create_publication_from_obj,
    get_all_instructors,
    insert_university_data,
    parse_scholarly,
    update_instructor_object,
)
import json
import click


@click.command(no_args_is_help=True)
@click.option(
    "--filename",
    help="Specify filename",
)
@click.option(
    "--initials",
    help="Specify university initials",
)
@click.option(
    "--do-not-use-scholarly",
    help="Disables publication resolver",
    is_flag=True,
    show_default=True,
)
def app(filename, initials, do_not_use_scholarly):
    inserted_filename = f"./dataset/{filename}.csv"
    insert_university_data(inserted_filename)
    if do_not_use_scholarly is False:
        print("hi")
        instructors = get_all_instructors()
        for instructor in instructors:
            # put sleep here!
            random_wait = random.uniform(60, 2 * 60)
            time.sleep(random_wait)
            json_str = parse_scholarly(instructor.filtered_name, initials)
            if json_str is not None:
                json_object = json.loads(json_str)
                instructor.scholar_id = json_object["scholar_id"]
                instructor.profile_picture = json_object["url_picture"]
                instructor.email_domain = json_object["email_domain"]
                instructor.citedby = json_object["citedby"]
                instructor.citedby5y = json_object["citedby5y"]
                instructor.hindex = json_object["hindex"]
                instructor.hindex5y = json_object["hindex5y"]
                instructor.i10index = json_object["i10index"]
                instructor.i10index5y = json_object["i10index5y"]
                instructor.parsable = True
                instructor.affilation = json_object["affiliation"]
                interest_joined = ",".join(json_object["interests"])
                instructor.interests = interest_joined
                instructor.visited = True
                instructor.email_domain = json_object["email_domain"]

                publications_l = json_object["publications"]

                for publication in publications_l:
                    pub = Publication(
                        author_pub_id=publication["author_pub_id"],
                        title=publication["bib"]["title"],
                        citation=publication["bib"]["citation"],
                        num_citation=publication["num_citations"],
                        instructor_id=instructor.db_uid,
                        university_id=instructor.university_id,
                    )
                    create_publication_from_obj(pub)

            else:
                instructor.parsable = False

            update_instructor_object(instructor)


if __name__ == "__main__":
    app()
