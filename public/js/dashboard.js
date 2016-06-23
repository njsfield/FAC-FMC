/** When /dashboard is hit, the fetchCalls and fetchAudio functions are called.
    Consider removing user_id and company_id from the xhr.open and insert them into the xhr.send as
    a stringified object. */

var fetchCalls = () => {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.responseText);
    }
  };
  var contact_id = '4387735';
  var company_id = '100';
  xhr.open('GET', '/fetch-calls/' + contact_id + '/' + company_id, true);
  xhr.send();
};

fetchCalls();

// var fetchAudio = () => {
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       console.log(xhr.responseText);
//     }
//   };
//   xhr.open('GET', '/fetch-audio/' + '100', true);
//   xhr.send();
// };
//
// fetchAudio();
