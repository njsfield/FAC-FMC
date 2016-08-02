const xhr = new XMLHttpRequest();

/** untagged checkbox event handler to disable the other tag checkboxes and tags field */
const untagged = document.getElementById('untagged');

const disableTags = () => {
  const scrollbarCheckboxes = document.getElementsByClassName('saved-tag');
  const tags = document.getElementById('tags');
  for(var i=0; i<scrollbarCheckboxes.length; i++)
    scrollbarCheckboxes[i].disabled = untagged.checked;
  tags.disabled = untagged.checked;
};

untagged.addEventListener('change', disableTags);

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
