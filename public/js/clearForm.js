var clearFilterForm = () => {
  var filterSpecProperties = ['duration_min', 'duration_max', 'to', 'from', 'tags', 'date'];
  filterSpecProperties.forEach((id) => {
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

var clearForm = document.getElementById('clear-form');

clearForm.addEventListener('click', clearFilterForm);

var showAll = document.getElementById('show-all');

var showAllCalls = function() {
  clearFilterForm();
  document.getElementById('filter-form').submit();
};
showAll.addEventListener('click', showAllCalls);
