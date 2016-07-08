const xhr = new XMLHttpRequest();

/** AJAX to send saved filter spec and name to /save-filter route */
const saveFilter = () => {
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
  const arrTags = tags.split(';');

  const filterObj = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    duration_min: document.getElementById('duration_min').value,
    duration_max: document.getElementById('duration_max').value,
    date: document.getElementById('date').value,
    tags: arrTags,
    saved_tags: savedTagsArr,
    untagged: document.getElementById('untagged').value,
    filter_name: document.getElementById('filter_name').value
  };
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('success');
      window.location.href = '/dashboard';
    }
  };
  xhr.open('post', '/save-filter');
  xhr.send(JSON.stringify(filterObj));
};

const saveButton = document.getElementById('save_filter');
saveButton.addEventListener('click', saveFilter);

/** AJAX to send filter spec and name to /filtered-calls route to filter user's calls*/
const searchFilter = () => {

  const scrollbarCheckboxes = document.getElementsByClassName('saved-tag');
  const savedTagsArr = [];
  for(var i=0; i<scrollbarCheckboxes.length; i++) {
    if(scrollbarCheckboxes[i].checked) {
      savedTagsArr.push(scrollbarCheckboxes[i].value);
    }
  }
  const tags = document.getElementById('tags').value;
  const arrTags = tags.split(';');

  const filterObj = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    duration_min: document.getElementById('duration_min').value,
    duration_max: document.getElementById('duration_max').value,
    date: document.getElementById('date').value,
    tags: arrTags,
    saved_tags: savedTagsArr,
    untagged: document.getElementById('untagged').value
  };
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('success');
      window.location.href = '/dashboard';
    }
  };
  xhr.open('post', '/filtered-calls');
  xhr.send(JSON.stringify(filterObj));
};

const searchButton = document.getElementById('filter_search');
searchButton.addEventListener('click', searchFilter);

/** AJAX to send filter spec and name to /filtered-calls route to filter calls by saved filter_name*/
const getFilterSpec = () => {
  const filterSpec = select.options[select.selectedIndex].value;
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('success');
    }
  };
  xhr.open('post', '/filtered-calls');
  xhr.send(JSON.stringify(filterSpec));
};

const select = document.getElementById('dropdown');
select.addEventListener('change', getFilterSpec);

/** delete saved tag from filter form from the client side */

var deleteButton = document.getElementById('deleteButton');
console.log(deleteButton, 'deleteButton-------');

deleteButton.addEventListener('click', ()=> {
  var removeCheckBoxes = document.getElementsByName('company_tag');
  for(var i=0; i<removeCheckBoxes.length; i++) {
    if(removeCheckBoxes[i].checked) {
      deleteTag(removeCheckBoxes[i]);
    }
  }
});

const deleteTag = (checkBox) => {
  checkBox.parentElement.removeChild(checkBox);
};
