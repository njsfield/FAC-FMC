const xhr = new XMLHttpRequest();

const saveFilter = () => {
  const filterObj = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    duration_min: document.getElementById('duration_min').value,
    duration_max: document.getElementById('duration_max').value,
    date: document.getElementById('date').value,
    tags: document.getElementById('tags').value,
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

const searchFilter = () => {
  console.log('button clicked');
  const filterObj = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    duration_min: document.getElementById('duration_min').value,
    duration_max: document.getElementById('duration_max').value,
    date: document.getElementById('date').value,
    tags: document.getElementById('tags').value,
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
