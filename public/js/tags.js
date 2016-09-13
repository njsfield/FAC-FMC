var xhr = new XMLHttpRequest();

/** ADD EVENT LISTENDERS TO TAGS IN CALLS FOR THE DELETE CALL **/
var tagsList = document.getElementsByClassName('tags');
var deleteListener = function (e) {
  if (e.key === 'Delete') {
    deleteTag(e);
  }
};
for(var i = 0 ; i < tagsList.length; i++){
  tagsList[i].addEventListener('keypress', deleteListener);
}

/** AJAX to delete tags from call*/

var deleteTag = function (node){
  console.log('node', node);
  var e ;
  if (node.target) {
    e = node.target;
  } else {
    console.log('no target');
    e = node[0];
  }
  var tagId;
  console.log('eeeee', e);
  console.log('nodeName', e.nodeName);
  if (e.nodeName === 'LI') {
    tagId = e.childNodes[3].id.replace(/^delTag_/,'');
  }
  else if (e.nodeName === 'BUTTON') {
    tagId = e.id.replace(/^delTag_/,'');
  }
  else {
    tagId = e.childNodes[1].id.replace(/^delTag_/,'');
  }
  var pt = tagId.split(/\^/g);
  var tagName = pt[0];
  var callId = pt[1];

  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      if (e.nodeName === 'BUTTON') {
        e.parentNode.remove();
      } else {
        e.remove();
      }
    }
  };
  xhr.open('post', '/delete-tag/' + tagName + '/' + callId);
  xhr.send();
};
var deleteButton = document.getElementsByClassName('close');
for (var i=0; i < deleteButton.length; i++) {
  deleteButton[i].addEventListener('click', deleteTag);
}

// ************ADD TAG and DELETE TAG*************//
var backSpace = 0;
$('.input-tag').bind('keydown', function (kp) {
  var tag = $(this).val().trim();
  	$('.tags').removeClass('danger');
  if(tag.length > 0){
    if(kp.keyCode == 13){
      backspace='0';
      addTag($(this));
      $(this).val('');
    }
  } else {
    if(kp.keyCode == 8) {
      $('.new-tag').prev().addClass('danger');

      $('.new-tag').prev().removeClass('orange-tag');
      backSpace++;
      if(backSpace == 2 ){
        backSpace = 0;
        deleteTag($('.new-tag').prev());
      }
    }
  }
});
/* eslint-enable */

//************add tag ajax request and manipulating dom******//
var addTag = function (e) {
  var callId = e.context.id.replace(/^addtag_name_/,'');
  var nameElem = document.getElementById('addtag_name_'+callId);
  var tagName = (nameElem.value || '').replace(/^\s+|\s+$/g,'');
  tagName = tagName.replace(/\s\s+/g, ' ');
  tagName = tagName.toLowerCase();
  // Is the tag name valid?
  if (tagName.search(/[^\w\s]/)>=0) {
    // NOPE - invalid characters! SHOULD have a way to report errors here.
    // showUserError("Tag name contains invalid characters");
    errorHandler('tag name contains invalid characters'); // eslint-disable-line
    return;
  }

  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      if (response.success === 'success' && response.tag !== 'already exists') {
        /**** CODE HERE TO CREATE THE NEW TAG DOM ELEMENT IN THE CALLS DISPLAY ****/
        var li = document.createElement('li');
        var emId = 'delTag_' + tagName + '^' + callId;
        li.className = 'tags tag-name orange-tag';
        li.tabIndex = 0;
        li.innerHTML = '<label for="'+ emId + 
          '"> <span class="sr-only sr-only-focusable"> delete tag from ' +
           callId +'</span>' + tagName + '</label> <button type="button" tabindex=0 id="' +
            emId + '" class="close"> x </button>';
        var inputForm = document.getElementById('input_form_'+callId);
        inputForm.insertBefore(li, inputForm.childNodes[inputForm.childNodes.length-2]);
        document.getElementById(emId).addEventListener('click', deleteTag);
        li.addEventListener('keypress', deleteListener);
        // $('.new-tag').before('<li class="tags tag-name">'+tag+close+'</li>');

        var label = document.createElement('label');
        label.innerHTML = '<input type="checkbox" class="saved-tag" name="company_tag" value="' + tagName + '" id="checked_' + tagName +'"> ' + tagName;
        label.setAttribute('class', 'popular-tag unchecked');
        label.setAttribute('for', 'checked_'+tagName);
        document.getElementsByClassName('scrollbar-tags')[0].appendChild(label);
      } else {
        errorHandler('unable to save your tag'); // eslint-disable-line
      }
    }
  };
  xhr.open('post', '/tag-call/' + tagName + '/' + callId);
  xhr.send();
};
var close = '<button class="close" id="delTag_{{id}}"></button>'; // eslint-disable-line
