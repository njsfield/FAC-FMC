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
