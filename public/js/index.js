const xhr = new XMLHttpRequest();

/** AJAX to send saved filter spec and name to /save-filter route */
const saveFilter = (e) => {

  const error = document.getElementById('error-message');
  error.innerHTML = '';
  document.getElementById('filter_name').value = '';

  e.stopPropagation();
  e.preventDefault();
  /** get checked input from the scrollbar checboxes div */
  const scrollbarCheckboxes = document.getElementsByClassName('saved-tag');
  const savedTagsArr = [];
  for(var i=0; i<scrollbarCheckboxes.length; i++) {
    if(scrollbarCheckboxes[i].checked) {
      savedTagsArr.push(scrollbarCheckboxes[i].value);
    }
  }
  /** split content on tags input to store each tag in a new array */
  const tags = document.getElementById('tags').value;
  var arrTags = [];
  if (tags!=null && tags.search(/\S/)>=0)
    arrTags = tags.split(';');

  ESCAPE = function(s) {
    return s.replace(/\"|\<|\>/g,function(s){
      return ({'"': '&quot;', '<': '&lt;','>': '&gt;'})[s];
    });
  };
  const filterObj = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    min: document.getElementById('duration_min').value,
    max: document.getElementById('duration_max').value,
    date: document.getElementById('date').value,
    tags: arrTags.concat(savedTagsArr),
    untagged: document.getElementById('untagged').value,
    filter_name: document.getElementById('filter_name').value
  };

  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('success');

      var response = JSON.parse(xhr.response.toString());
      if (response.success) {
        jQuery('#dropdown').append(
          '<option id="dropdown-option" value="'+ESCAPE(response.description)+'">'+ESCAPE(filterObj.filter_name)+'</option>'
        );
        jQuery('#myModal').modal('hide');
      }
      else {
        error.innerHTML = 'You are already using this name for another saved filter.';
        // FAILED!!! insert error message
      }
    }
  };
  xhr.open('post', '/save-filter');
  xhr.send(JSON.stringify(filterObj));
};

const saveButton = document.getElementById('save_filter');
saveButton.addEventListener('submit', saveFilter);

/** AJAX to send filter spec and name to /filtered-calls route to filter user's calls*/
// const searchFilter = () => {
//
//   const scrollbarCheckboxes = document.getElementsByClassName('saved-tag');
//   const savedTagsArr = [];
//   for(var i=0; i<scrollbarCheckboxes.length; i++) {
//     if(scrollbarCheckboxes[i].checked) {
//       savedTagsArr.push(scrollbarCheckboxes[i].value);
//     }
//   }
//
//   const tags = document.getElementById('tags').value;
//   var regex = /^\s+$/ ;
//   var arrTags = [];
//   if (tags.match(regex) || tags === '') {
//     return arrTags;
//   } else {
//     arrTags = tags.split(';');
//   }
//
//   const filterObj = {
//     to: document.getElementById('to').value,
//     from: document.getElementById('from').value,
//     min: document.getElementById('duration_min').value,
//     max: document.getElementById('duration_max').value,
//     date: document.getElementById('date').value,
//     tags: arrTags.concat(savedTagsArr)
//     // untagged: document.getElementById('untagged').value
//   };
//   xhr.onreadystatechange = function () {
//     if(xhr.readyState === 4 && xhr.status === 200) {
//       console.log('success');
//       // window.location.href = '/filtered-calls';
//     }
//   };
//   xhr.open('POST', '/filtered-calls');
//   xhr.send(JSON.stringify(filterObj));
// };

// const searchButton = document.getElementById('filter_search');
// searchButton.addEventListener('click', searchFilter);

/** AJAX to send filter spec and name to /filtered-calls route to filter calls by saved filter_name*/
const getFilterSpec = () => {
  const filterSpec = select.options[select.selectedIndex].value;
  var spec = JSON.parse(filterSpec);
  for (var f in spec) {
    var elem = document.getElementById(f);
    if (elem!=null)
      elem.value = spec[f];
  }
  // xhr.onreadystatechange = function () {
  //   if(xhr.readyState === 4 && xhr.status === 200) {
  //     console.log('success');
  //   }
  // };
  // xhr.open('GET', '/dashboard?filter_name=' + filterSpec);
  // xhr.send(); //JSON.stringify(filterSpec));
};

const select = document.getElementById('dropdown');
select.addEventListener('change', getFilterSpec);

/** AJAX to delete tags from call*/

const deleteTag = (e) => {
  const tagName = e.target.id;
  const callId = e.target.className;
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('success');
      window.location.href = '/dashboard';
    }
  };
  xhr.open('post', '/delete-tag/' + tagName + '/' + callId);
  xhr.send();
};

const deleteButton = document.getElementsByTagName('em');
for (var i=0; i < deleteButton.length; i++) {
  deleteButton[i].addEventListener('click', deleteTag);
}
