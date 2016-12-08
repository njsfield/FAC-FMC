BEGIN
/****** PARTICIPANTS TABLE *******
 ****** Add a 'hidden' flag against each participant entry. If 'true' then the contact_d in that participant
 ****** row no longer wants to see this message (unless show all messages is selected).
 ******/
ALTER TABLE participants ADD COLUMN hidden boolean NOT NULL DEFAULT false;

DROP TABLE IF EXISTS managers CASCADE;

/****** MANAGER TABLE *******
 ****** A simple table that allows one contact_id to be identified as a 'manager' of another
 ****** contact_id. This could be recursive, subject to working out the right SQL, so:
 ****** A -> manages -> B
 ******        and
 ****** B -> manages -> C
 ******
 ****** So A effectively manages B and C.
 ******
 ****** The contact_ids are managed by the PABX and at the moment we don't store any information about the contact.
 ******/
CREATE TABLE managers (
   manager_contact_id  BIGINT  NOT NULL,
   managed_contact_id  BIGINT  NOT NULL,
   CONSTRAINT list_pk PRIMARY KEY(manager_contact_id, managed_contact_id)
)
WITHOUT OIDS;

/****** POPULAR TAG TABLE *******
 ******
 ****** The UI should show 'most popular' tags, which is expensive to calculate for every page
 ****** view. Instead create a separate pre-sorted table that includes the most popular 'n'
 ****** tags for each managed company. This table should be rebuild periodically using
 ****** a background SQL script (provided).
 ******/
CREATE TABLE popular_tags (
	company_id   BIGINT NOT NULL,
	tag_id       BIGINT NOT NULL,
	refs         INT NOT NULL DEFAULT 0,
	tag_name     VARCHAR NOT NULL,

	CONSTRAINT poptags_pk PRIMARY KEY(company_id, tag_id)
) WITHOUT OIDS;


ALTER TABLE popular_tags ADD CONSTRAINT pop_comp_fk
      FOREIGN KEY (company_id)
      REFERENCES companies (company_id)
      ON DELETE CASCADE;

ALTER TABLE popular_tags ADD CONSTRAINT pop_tag_fk
      FOREIGN KEY (tag_id)
      REFERENCES tags (tag_id)
      ON DELETE CASCADE;

COMMIT;
