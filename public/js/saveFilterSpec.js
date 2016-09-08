/******************* SAVED FILTERS******************/
/** Fills form with filter values of selected saved filter*/
const getFilterSpec = () => {
  const filterSpec = select.options[select.selectedIndex].value;
  var spec = JSON.parse(filterSpec);
  for (var f in spec) {
    var elem = document.getElementById(f);
    if (elem!=null) {
      elem.value = f === 'duration_min' && typeof spec[f] === 'number' || f === 'duration_max' && typeof spec[f] === 'number' ? spec[f] / 60 : spec[f];
    }
  }
};

/**************TAGGING*******************/
/***************** grabs tags input in the filter form and splits it
into an array *************/
const fetchTagsList = () => {
  const tags = document.getElementById('tags').value;
  var array = [];
  if (tags!=null && tags.search(/\S/)>=0) array = tags.split(';');
  return array;
};
const arrTags = fetchTagsList();

/*************FILTER POPULAR TAGS FUNCTIONALITY*************/
// if the popular tags listed have also been searched, they will turn
// blue otherwise it will leave it orange
const popularTagArray = document.getElementsByClassName('popular-tag');
function compareTags() {
  for(var i = 0; i < popularTagArray.length; i++){
    if(arrTags.indexOf(popularTagArray[i].childNodes[0].value) >-1){
      popularTagArray[i].setAttribute('class', 'popular-tag checked');
    }
  }
};
compareTags();

// This functionailty changes the color of popular tags when they are selected or unselected
const scrollbarCheckboxes = document.getElementsByClassName('saved-tag');
const changeColor = function(e) {
  if (e.target.checked && e.target.disabled === false) {
    e.target.parentNode.setAttribute('class', 'popular-tag checked');
    // add to list
    if (arrTags.indexOf(e.target.value) === -1) {
      arrTags.push(e.target.value);
      document.getElementById('tags').value = arrTags.join(';');
    }
  } else {
    e.target.parentNode.setAttribute('class', 'popular-tag unchecked');
    // remove from list
    const index = arrTags.indexOf(e.target.value);
    if (arrTags.indexOf(e.target.value) > -1){
      arrTags.splice(index, 1);
      document.getElementById('tags').value = arrTags.join(';');
    }
  }
};

/****UNTAGGED search query ******/
/** untagged checkbox event handler to disable the other tag checkboxes and tags field */
const untagged = document.getElementById('untagged');

const disableTags = () => {
  const scrollbarCheckboxesArray = document.getElementsByClassName('saved-tag');
  const tags = document.getElementById('tags');
  for(var i=0; i<scrollbarCheckboxesArray.length; i++)
    scrollbarCheckboxesArray[i].disabled = untagged.checked;
  tags.disabled = untagged.checked;
};

untagged.addEventListener('change', disableTags);

// event listener that checks as to whether the checkboxes have been selected
for(var i = 0; i < scrollbarCheckboxes.length; i++) {
  scrollbarCheckboxes[i].addEventListener('click', changeColor);
}

/** event listener that listens to whether saved filter has been selected*/

const select = document.getElementById('dropdown');
select.addEventListener('change', getFilterSpec);

/** AJAX to send saved filter spec when SAVE button has been selected and name to /save-filter route */

const saveFilter = (e) => {
  const xhr = new XMLHttpRequest();
  const error = document.getElementById('filter-error-message');
  error.innerHTML = '';

  e.stopPropagation();
  e.preventDefault();
  /** get checked input from the scrollbar checboxes div */
  const savedTagsArr = [];
  for(var j=0; j<scrollbarCheckboxes.length; j++) {
    if(scrollbarCheckboxes[j].checked && scrollbarCheckboxes[j].disabled === false) {
      savedTagsArr.push(scrollbarCheckboxes[j].value);
    }
  }

  ESCAPE = function(s) { // eslint-disable-line
    return s.replace(/\"|\<|\>/g,function(s){ // eslint-disable-line
      return ({'"': '&quot;', '<': '&lt;','>': '&gt;'})[s];
    });
  };

  //**************************SAVE FILTER FUNCTIONALITY
  // filter obj structure to be saved
  const filterObj = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    duration_min: document.getElementById('duration_min').value * 60,
    duration_max: document.getElementById('duration_max').value * 60,
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
        jQuery('#dropdown').append( // eslint-disable-line
          '<option id="dropdown-option" value="'+ESCAPE(response.description)+'">'+ESCAPE(filterObj.filter_name)+'</option>' // eslint-disable-line
        );
        jQuery('#myModal').modal('hide'); // eslint-disable-line
        document.getElementById('filter_name').value = '';
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
