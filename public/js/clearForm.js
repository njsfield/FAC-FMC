const clearFilterForm = () => {
  const filterSpecProperties = ['duration_min', 'duration_min', 'to', 'from', 'tags', 'date'];
  filterSpecProperties.forEach((id) => {
    var elem = document.getElementById(id);
    elem.value = '';
  });
  const options = document.getElementById('dropdown');

};

const clearForm = document.getElementById('clear-form');

clearForm.addEventListener('click', clearFilterForm);
