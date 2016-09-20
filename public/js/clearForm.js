var showAll = document.getElementById('show-all');
var clearForm = document.getElementById('clear-form');

var clearFilterForm = function () {
  var filterSpecProperties = ['duration_min', 'duration_max', 'to', 'from', 'tags', 'date', 'dateRange'];
  filterSpecProperties.forEach(function (id) {
    var elem = document.getElementById(id);
    elem.value = '';

  });
  var checkboxArray = document.getElementsByClassName('saved-tag');
  for(var i = 0; i < checkboxArray.length; i++){
    checkboxArray[i].checked = false;
    checkboxArray[i].parentNode.setAttribute('class', 'popular-tag unchecked');
  }
  var options = document.getElementById('dropdown');
  options.selectedIndex = 0;

};

var showAllCalls = function() {
  clearFilterForm();
  document.getElementById('filter-form').submit();
};

/** event listener to show all calls */
showAll.addEventListener('click', showAllCalls);

/** event listener to clear the filter form */
clearForm.addEventListener('click', clearFilterForm);
