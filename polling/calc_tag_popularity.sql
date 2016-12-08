/***** calc_tag_popularity.sql ****/


/******************************************************************************************
 This SQL script will calculate the most popular 50 tags for each known company and add these into
 the 'popular_tags' table, replacing the data previously stored there. This allows an application
 to read the most popular tags in an efficient way without the need to re-calculate popularity for
 each page.

 This script should be run periodically (eg. daily/hourly) usin 'cron' or a similar
 scheduling program. Example:

 > psql fmc postgres -f ./calc_tag_popularity.sql

 Where 'fmc' is the name of the FMC database schema and 'postgres' is the name of the
 PostgreSQL role to be used to execute the command.
 ******************************************************************************************/
BEGIN;
DELETE FROM popular_tags;
INSERT INTO popular_tags(company_id, tag_id, tag_name, refs)
SELECT c_id, t_id, t_name, my_index FROM (
	SELECT *, row_number() OVER (PARTITION BY c_id ORDER BY refs DESC) AS my_index
	FROM (
		SELECT t.company_id AS c_id,t.tag_id AS t_id, t.tag_name AS t_name, count(c.tag_id) AS refs FROM tags t INNER JOIN tags_calls c ON t.tag_id=c.tag_id GROUP BY t.tag_id ORDER BY c_id
	) AS temp
) AS temp2  WHERE my_index<50;
COMMIT;
