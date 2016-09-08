var clearFilterForm = function () {
  var filterSpecProperties = ['duration_min', 'duration_max', 'to', 'from', 'tags', 'date'];
  filterSpecProperties.forEach(function (id) {
    var elem = document.getElementById(id);
    elem.value = '';
  });
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
