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
  const tagId = e.target.id.replace(/^delTag_/,'');
  const pt = tagId.split(/\^/g);
  const tagName = pt[0];
  const callId = pt[1];
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      e.target.parentNode.remove();
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

  const callId = e.target.id.replace(/^addtag_/,'');
  const nameElem = document.getElementById('addtag_name_'+callId);
  const tagName = nameElem.value;
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.success === 'success') {
        /**** CODE HERE TO CREATE THE NEW TAG DOM ELEMENT IN THE CALLS DISPLAY ****/
        const div = document.createElement('div');
        const emId = 'delTag_' + tagName + '^' + callId;
        div.className = 'tag-card';
        div.innerHTML = '<span class="tag-name">'+ tagName +'</span> <em id="' + emId + '">X</em> ';
        document.getElementById('calltags_'+ callId).appendChild(div);
        document.getElementById(emId).addEventListener('click', deleteTag);
      }
    }
  };
  xhr.open('post', '/tag-call/' + tagName + '/' + callId);
  xhr.send();

};

const addTagButtons = document.getElementsByClassName('btn_addtag');
for (var i=0; i < addTagButtons.length; i++) {
  addTagButtons[i].addEventListener('click', addTag);
}
