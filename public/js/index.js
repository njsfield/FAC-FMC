const xhr = new XMLHttpRequest();

const saveFilter = () => {
  console.log('button clicked');
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      window.location.reload();
    }
  };
  xhr.open('get', '/fetch-audio/' + file_id);
  xhr.send();
};

button.addEventListener('click', saveFilter);

// $( document ).ready(function() {
//
//   $('#save_filter').submit(function() {
//     $('#filter_search').submit = (e) => {
//       e.preventDefault();
//       console.log('submit action prevented');
//     };
//   });

// function saveFilter() {
//   console.log('save filter');
//   if (event.keyCode === 13) {
//     document.getElementById('filter').submit();
//   }
// }

  // function preventSearch () {
  //   console.log('stuff is happening');
  //   $('#save_filter').onkeypress = (e) => {
  //     console.log(e.which, '<------ e.which');
  //     console.log(e.keyCode, '<----- e.keycode');
  //     if (e.keyCode === 13) {
  //       document.getElementById('filter').submit();
  //     }
  //   };
  // }
  //

  // $('#filter_search').onkeypress = (e) => {
  //   if(e.keyCode == 13) {
  //     e.preventDefault();
  //   }
  // };
  // $('#filter').submit = (e) => {
  //   e.preventDefault();
  //   console.log('submit action prevented');
  // };
// });
