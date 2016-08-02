const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;

module.exports = (decoded, file_id, callback) => {
  let queryString = '';
  let queryArray = [];
  queryArray.push(file_id);
  if (decoded.userRole !== 'admin') {
    queryString = 'select 1 from calls where company_id = $1 and file_id = $2 and call_id in (select call_id from participants where contact_id = $3);';
    queryArray.push(decoded.company_id);
    queryArray.push(file_id);
    queryArray.push(decoded.contact_id);
  } else {
    queryString = 'select 1 from calls where file_id = $1 and ';
    decoded.adminCompanies.forEach( (company, i) => {
      queryString += 'company_id = $' + (i + 2);
      queryArray.push( company.company_id);
      if (i < decoded.adminCompanies.length -1) {
        queryString += ' OR ';
      }
    });
    console.log(queryString);
    console.log(queryArray);
    pg.connect(postgresURL, (error, dbClient, done) => {
      if (error) {
        callback(error);
        done();
      } else {
        dbClient.query(queryString, queryArray, (err, response) => {
          if (response.rowCount === 1){
            callback(null, true);
          } else {
            callback(null, false);
          }
          done();
        }
    );}
    });
  }

  // pg.connect(postgresURL, (err, dbClient, done)=> {
  //   if (admin) {
  //     companies
  //     queryString
  //   }
  //   const queryString = 'select 1 from calls where company_id = 100 and file_id = 125 and call_id in (select call_id from participants where contact_id = 472); ';
  //
  //
  //   dbClient.query(queryString, queryArray, (err, response) => {
  //
  //   })

};
