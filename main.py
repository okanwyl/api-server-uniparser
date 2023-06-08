import random
import sys
import time
from utils import (
    Publication,
    create_publication_from_obj,
    get_all_instructors,
    insert_university_data,
    parse_scholarly,
    read_scraper_api_key,
    update_instructor_object,
)
import json
import click
from unidecode import unidecode
from scholarly import scholarly, ProxyGenerator


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
@click.option(
    "--do-not-insert-csv",
    help="Disables insertion filtered csv",
    is_flag=True,
    show_default=True,
)
def app(filename, initials, do_not_use_scholarly, do_not_insert_csv):
    if do_not_insert_csv is False:
        inserted_filename = f"./dataset/{filename}.csv"
        insert_university_data(inserted_filename)
    if do_not_use_scholarly is False:
        instructors = get_all_instructors()
        pg = ProxyGenerator()
        API_KEY = read_scraper_api_key()
        success = pg.ScraperAPI(API_KEY)
        if success is False:
            sys.exit("API Key is not successfully used")
        scholarly.use_proxy(pg)
        for instructor in instructors:
            # put sleep here!
            print(instructor.filtered_name)
            random_wait = random.uniform(60, 2 * 60)
            time.sleep(random_wait)
            json_str = parse_scholarly(
                scholarly, instructor.filtered_name, str(initials)
            )
            if json_str is None:
                json_str = parse_scholarly(
                    unidecode(instructor.filtered_name), str(initials)
                )
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
