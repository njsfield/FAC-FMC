var xhr = new XMLHttpRequest();
var tagsList = document.getElementsByClassName('tags');
var deleteButton = document.getElementsByClassName('close');

/** ADD EVENT LISTENERS TO TAGS IN CALLS FOR THE DELETE CALL **/
var deleteListener = function (e) {
  if (e.key === 'Delete') {
    deleteTag(e);
  }
};

/** AJAX to delete tags from call*/
var deleteTag = function (node){
  var e ;
  var tagId;
  if (node.target) {
    e = node.target;
  } else {
    e = node[0];
  }
  if (e.nodeName === 'LI' && e.childNodes[2].nodeName === 'BUTTON') {
    tagId = e.childNodes[2].id.replace(/^delTag_/,'');
  } else if (e.nodeName === 'LI' && e.childNodes[3].nodeName === 'BUTTON') {
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
        if (typeof e.parentNode.removeNode !== 'undefined') {
          e.parentNode.removeNode(true);
        } else {
          e.parentNode.remove();
        }
      } else {
        if (typeof e.removeNode !== 'undefined') {
          e.removeNode(true);
        } else {
          e.remove();
        }
      }
      var callLine = document.getElementById('tag_container_'+ callId);
      var smallTags = 0;
      for(var k = 0; k < callLine.childNodes.length; k++ ){
        if (callLine.childNodes[k].innerHTML) {
          if (callLine.childNodes[k].innerHTML.trim() === tagName){
            if (typeof callLine.childNodes[k].removeNode !== 'undefined') {
              callLine.childNodes[k].removeNode(true);
            } else {
              callLine.childNodes[k].remove();
            }
          }
          if (callLine.childNodes[k].nodeName === 'DIV'){
            smallTags ++;
          }
        }
      }
      if (smallTags === 0) {
        document.getElementById('tag_container_text_' + callId).innerHTML = 'no tags';
      }
    }
  };
  xhr.open('post', '/delete-tag/' + tagName + '/' + callId);
  xhr.send();
};

// ************ADD TAG and DELETE TAG*************//
/* eslint-disable */
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
      $(this).parent().prev().addClass('danger');
      $(this).parent().prev().removeClass('orange-tag');
      backSpace++;
      if(backSpace == 2 ){
        backSpace = 0;
        deleteTag($(this).parent().prev());
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
        li.id = 'tag-card-' + callId;
        li.tabIndex = 0;
        li.innerHTML = tagName + '<label class="close-label" for="'+ emId +
          '"> <span class="sr-only sr-only-focusable"> delete tag' + tagName + 'from call ' +
           callId +'</span>' + '</label> <button type="button" tabindex=0 id="' +
            emId + '" class="close"> x </button>';
        var inputForm = document.getElementById('input_form_'+callId);
        inputForm.insertBefore(li, inputForm.childNodes[inputForm.childNodes.length-2]);
        document.getElementById(emId).addEventListener('click', deleteTag);
        li.addEventListener('keypress', deleteListener);
// ADD label to the saved tags section in the filterform
        var label = document.createElement('label');
        label.innerHTML = '<input type="checkbox" class="saved-tag" name="company_tag" value="' + tagName + '" id="checked_' + tagName +'"> ' + tagName;
        label.setAttribute('class', 'popular-tag unchecked');
        label.setAttribute('for', 'checked_'+tagName);
        var savedTags = document.getElementsByClassName('popular-tag');
        var duplicate = false;
        for (var l = 0 ; l < savedTags.length; l++) {
          var forAttribute = savedTags[l].getAttribute('for').replace(/^checked_/,'');
          if (forAttribute === tagName) {
            duplicate = true;
          }
          if (!duplicate && l === savedTags.length - 1 && savedTags.length < 20) {
            document.getElementsByClassName('scrollbar-tags')[0].appendChild(label);
          }
        }
// add tag to call line

        addFocus();
        //adds focus to new tags created
        var callLine = document.getElementById('tag_container_' + callId);
        var div = document.createElement('div');
        div.setAttribute('class', 'small-tags');
        div.innerHTML = tagName;
        var p = document.getElementById('tag_container_text_' + callId);
        callLine.insertBefore(div, p);
      } else {
        errorHandler('unable to save your tag'); // eslint-disable-line
      }
    }
  };
  xhr.open('post', '/tag-call/' + tagName + '/' + callId);
  xhr.send();
};
var close = '<button class="close" id="delTag_{{id}}"></button>'; // eslint-disable-line

// Focuses the parent of the delete button of tag call
/* eslint-disable */
var addFocus = function () {
  $('.close').focus(
    function(){
      $(this).css('width', '26px');
      $(this).parent().css('padding-right', '25px');
    });

  $('.close').on('focusout',
    function(){
      $(this).css('width', '0');
      $(this).parent().css('padding-right', '6px');
    });
};
/* eslint-enable */

addFocus();

for (var i=0; i < deleteButton.length; i++) {
  deleteButton[i].addEventListener('click', deleteTag);
}

for(var i = 0 ; i < tagsList.length; i++){
  tagsList[i].addEventListener('keypress', deleteListener);
}
