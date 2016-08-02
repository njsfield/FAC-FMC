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
  const tagId = e.target.id;
  const pt = tagId.split(/\^/g);
  const tagName = pt[0];
  const callId = pt[1];
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('success');
      e.target.parentNode.remove();
      // window.location.href = '/dashboard';
    }
  };
  xhr.open('post', '/delete-tag/' + tagName + '/' + callId);
  xhr.send();
};

const deleteButton = document.getElementsByTagName('em');
for (var i=0; i < deleteButton.length; i++) {
  deleteButton[i].addEventListener('click', deleteTag);
}


const addTag = (e) => {
  console.log("ATTEMPT TO ADD TAG");

  const callId = e.target.id.replace(/^addtag_/,'');
  const nameElem = document.getElementById('addtag_name_'+callId);
  const tagName = nameElem.value;
  console.log("CALL ID: "+callId+" ADD TAG: "+tagName);
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('success');
      // e.target.parentNode.remove();
      // window.location.href = '/dashboard';

      /**** ADD CODE HERE TO CREATE THE NEW TAG DOM ELEMENT IN THE CALLS DISPLAY ****/
    }
  };
  xhr.open('post', '/tag-call/' + tagName + '/' + callId);
  xhr.send();

}

const addTagButtons = document.getElementsByClassName('btn_addtag');
for (var i=0; i < addTagButtons.length; i++) {
  addTagButtons[i].addEventListener('click', addTag);
}
