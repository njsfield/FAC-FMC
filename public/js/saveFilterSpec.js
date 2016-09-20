$('#date').datepicker({
  dateFormat: 'yy-mm-dd',
  dayNamesMin: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
});
$('#dateRange').datepicker({
  dateFormat: 'yy-mm-dd',
  dayNamesMin: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
});

var dateRangeCheckbox = document.getElementById('date_range_checkbox');
var dateRangeBox = document.getElementById('date_range_box');
var date = document.getElementById('date');

if (dateRangeCheckbox.value === 'true') {
  dateRangeCheckbox.setAttribute('checked', true);
}

var showRange = function () {
  if (dateRangeCheckbox.checked) {
    dateRangeBox.className = 'list-group-item';
    date.placeholder = 'Date from:  yyyy-mm-dd';
  } else {
    dateRangeBox.className = 'list-group-item hidden';
    date.placeholder = 'Select date:  yyyy-mm-dd';
  }
};

dateRangeCheckbox.addEventListener('change', showRange);
window.addEventListener('load', showRange);

/** Fills form with filter values of selected saved filter*/
var getFilterSpec = function () {
  var filterSpec = select.options[select.selectedIndex].value;
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
function fetchTagsList(tags) {
  var array = [];
  if (tags!=null && tags.search(/\S/)>=0) array = tags.split(';');
  return array;
};
/*** check duplicates ***/

function removeDuplicates(filterObj) {
  filterObj;
}
/*************FILTER POPULAR TAGS FUNCTIONALITY*************/
// if the popular tags listed have also been searched, they will turn
// blue otherwise it will leave it orange
var popularTagArray = document.getElementsByClassName('popular-tag');
function compareTags() {
  var tags = document.getElementById('tags').value;
  var arrTags = fetchTagsList(tags);
  for(var i = 0; i < popularTagArray.length; i++){
    if(arrTags.indexOf(popularTagArray[i].childNodes[0].value) >-1){
      popularTagArray[i].setAttribute('class', 'popular-tag checked');
    }
  }
};
compareTags();

// This functionailty changes the color of popular tags when they are selected or unselected
var scrollbarCheckboxes = document.getElementsByClassName('saved-tag');
var changeColor = function (e) {
  var tags = document.getElementById('tags').value;
  var arrTags = fetchTagsList(tags);
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
    var index = arrTags.indexOf(e.target.value);
    if (arrTags.indexOf(e.target.value) > -1){
      arrTags.splice(index, 1);
      document.getElementById('tags').value = arrTags.join(';');
    }
  }
};

/****UNTAGGED search query ******/
/** untagged checkbox event handler to disable the other tag checkboxes and tags field */
var untagged = document.getElementById('untagged');

var disableTags = function () {
  var scrollbarCheckboxesArray = document.getElementsByClassName('saved-tag');
  var tags = document.getElementById('tags');
  for(var i=0; i<scrollbarCheckboxesArray.length; i++)
    scrollbarCheckboxesArray[i].disabled = untagged.checked;
  tags.disabled = untagged.checked;

  if (untagged.checked){
    document.getElementsByClassName('popular-tags')[0].setAttribute('id', 'fade');
    document.getElementById('tags')[0].setAttribute('id', 'fade');
  } else {
    document.getElementsByClassName('popular-tags')[0].removeAttribute('id');
    document.getElementById('tags')[0].setAttribute('id');
  }
};

untagged.addEventListener('change', disableTags);

// event listener that checks as to whether the checkboxes have been selected
for(var i = 0; i < scrollbarCheckboxes.length; i++) {
  scrollbarCheckboxes[i].addEventListener('click', changeColor);
}

/** event listener that listens to whether saved filter has been selected*/

var select = document.getElementById('dropdown');
select.addEventListener('change', getFilterSpec);

/** AJAX to send saved filter spec when SAVE button has been selected and name to /save-filter route */

var saveFilter = function (e) {
  var xhr = new XMLHttpRequest();
  var error = document.getElementById('filter-error-message');
  error.innerHTML = '';

  e.stopPropagation();
  e.preventDefault();
  /** get checked input from the scrollbar checboxes div */
  var savedTagsArr = [];
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
  var tags = document.getElementById('tags').value;
  var arrTags = fetchTagsList(tags);
  //**************************SAVE FILTER FUNCTIONALITY
  // filter obj structure to be saved
  var filterObj = {
    to: document.getElementById('to').value.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').toLowerCase(),
    from: document.getElementById('from').value.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').toLowerCase(),
    duration_min: document.getElementById('duration_min').value,
    duration_max: document.getElementById('duration_max').value,
    date: document.getElementById('date').value,
    dateRange: document.getElementById('dateRange').value,
    dateRangeCheckbox: document.getElementById('dateRange').checked,
    tags: arrTags.concat(savedTagsArr),
    untagged: document.getElementById('untagged').value,
    filter_name: document.getElementById('filter_name').value.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').toLowerCase()
  };

  if (filterObj.to.search(/[^\w\s]/)>=0 || filterObj.from.search(/[^\w\s]/)>=0 || filterObj.filter_name.search(/[^\w\s]/)>=0) {
    // NOPE - invalid characters! SHOULD have a way to report errors here.
    // showUserError("Tag name contains invalid characters");
    errorHandler('filter contains invalid characters'); // eslint-disable-line
    return;
  }
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

var saveButton = document.getElementById('save_filter');
saveButton.addEventListener('submit', saveFilter);
