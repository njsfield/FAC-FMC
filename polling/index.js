const storeCompanyCalls = require('./storeCompanyCalls.js').storeCompanyCalls;
const pollingCompanies = require('./api/pollingCompanies.js').pollingCompanies;

pollingCompanies(res => {
  res.user.companies.forEach(company => {
    storeCompanyCalls(company);
  });
});
