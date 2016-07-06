'use strict';

/** Fetches audio from the files table based on file_id.
* @param {object} dbClient - Client server from the Postgreql database.
* @param {integer} file_id - Id used to fetch audio files.
* @param {function} callback - Returns the wav file. */

const fetchAudio = (dbClient, file_id, callback) => {
  dbClient.query('SELECT * FROM files WHERE file_id = $1', [file_id], (error, result) => {
    if (error) throw error;
    callback(result.rows);
  });
};

module.exports = {
  fetchAudio
};
