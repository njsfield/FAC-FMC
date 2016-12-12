/* global jQuery */
/******************* MODIFIED JS CODE USING JQUERY ************************/
(function($) {

  var select = document.getElementById('saved-filters');
  //var untagged = document.getElementById('untagged');
  var saveButton = document.getElementById('save_filter');
  //var popularTagArray = document.getElementsByClassName('popular-tag');
  var scrollbarCheckboxes = document.getElementsByClassName('saved-tag');

  /** Fills form with filter values of selected saved filter*/
  var getFilterSpec = function () {
    var filterSpec = select.options[select.selectedIndex].value;
    var spec = JSON.parse(filterSpec), elem;

    for (var f in spec) {
      switch (f) {
      case 'include_hidden':
        // This is a checkbox so needs special attention.
        elem = $('#showhidden_checkbox');

        elem.prop('checked', spec[f]===true).trigger('change');
        break;
      default:
        $('#'+f).val(f === 'duration_min' && typeof spec[f] === 'number' || f === 'duration_max' && typeof spec[f] === 'number' ? spec[f] / 60 : spec[f]);
        break;
      }
    }
    // Set some additional UI attribtes dependng on values we've just loaded.
    var range = ($('#dateRange').val().search(/\S/)>=0);
    $('#date_range_box').toggleClass('hidden', !range);
    $('#date_range_checkbox').prop('checked', range).trigger('change');

  };

  /**************TAGGING*******************/
  /** grabs tags input in the filter form and splits it into an array */
  function fetchTagsList(tags) {
    return (tags!=null && tags.search(/\S/)>=0) ? tags.toLowerCase().replace(/^[,;\s]+|[,;\s]+$/g,'').split(/\s*[;,]\s*/g) : [];
  };
  /*************FILTER POPULAR TAGS FUNCTIONALITY*************/
  /****UNTAGGED search query ******/
  /** untagged checkbox event handler to disable the other tag checkboxes and tags field */

  /** AJAX to send saved filter spec when SAVE button has been selected and name to /save-filter route */

  var saveFilter = function (e) {
    var xhr = new XMLHttpRequest();
    var error = document.getElementById('filter-error-message');
    error.innerHTML = '';

    e.stopPropagation();
    e.preventDefault();
    /** get checked input from the scrollbar checboxes div */
    var savedTagsArr = [];
    for(var j=0; j<scrollbarCheckboxes.length; j++) {
      if(scrollbarCheckboxes[j].checked && scrollbarCheckboxes[j].disabled === false) {
        savedTagsArr.push(scrollbarCheckboxes[j].value);
      }
    }

    var ESCAPE = function(s) {
      return s.replace(/\"|\<|\>/g,function(s){ // eslint-disable-line
        return ({'"': '&quot;', '<': '&lt;','>': '&gt;'})[s];
      });
    };
    var tags = document.getElementById('tags').value;
    var arrTags = fetchTagsList(tags);
    //**************************SAVE FILTER FUNCTIONALITY
    // filter obj structure to be saved
    var filterObj = {
      to: document.getElementById('to').value.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').toLowerCase(),
      from: document.getElementById('from').value.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').toLowerCase(),
      duration_min: document.getElementById('duration_min').value,
      duration_max: document.getElementById('duration_max').value,
      date: document.getElementById('date').value,
      dateRange: document.getElementById('dateRange').value,
      dateRangeCheckbox: document.getElementById('dateRange').checked,
      tags: arrTags.concat(savedTagsArr),
      untagged: document.getElementById('untagged').value,
      filter_name: document.getElementById('filter_name').value.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').toLowerCase(),
      include_hidden: ((document.getElementById('showhidden_checkbox')||{}).checked==true)
    };

    if (filterObj.to.search(/[^\w\s]/)>=0 || filterObj.from.search(/[^\w\s]/)>=0 || filterObj.filter_name.search(/[^\w\s]/)>=0) {
      // NOPE - invalid characters! SHOULD have a way to report errors here.
      // showUserError("Tag name contains invalid characters");
      error.innerHTML = 'filter contains invalid characters';
    } else if (filterObj.filter_name === '') {
      error.innerHTML = 'please choose a name for your filter';
    }
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200) {

        var response = JSON.parse(xhr.response.toString());
        if (response.success) {
          jQuery('#saved-filters').append(
            '<option id="dropdown-option" value="'+ESCAPE(response.description)+'">'+ESCAPE(filterObj.filter_name)+'</option>' // eslint-disable-line
          );
          jQuery('#myModal').modal('hide');
          document.getElementById('filter_name').value = '';
        }
        else {
          error.innerHTML = 'You are already using this name for another saved filter.';
          // FAILED!!! insert error message
        }
      }
    };
    xhr.open('post', '/save-filter');
    xhr.send(JSON.stringify(filterObj));
  };

  saveButton.addEventListener('submit', saveFilter);

  /** event listener that listens to whether saved filter has been selected*/
  select.addEventListener('change', getFilterSpec);

  $(function() {
    var searchTags     = $('#tags');
    var untaggedSearch = $('#untagged');
    var searchTagWrap  = $('#popular-tags');
    var popularTags;
    var popularTags_a = {};

    var rebuildPopularTagList = function() {
      popularTags = $('#popular-tags .saved-tag');
      popularTags.each(function() {
        popularTags_a[$(this).val()] = {tag: $(this), parent: $(this).parent()};
      });
    };

    var changeSavedTagState = function (ev) {
      var tags        = searchTags.val();
      var arrTags     = fetchTagsList(tags);

      // What have we just clicked on and is it selected or not?
      var thisTag    = $(ev.currentTarget);
      var tagName    = thisTag.val();
      var isSelected = thisTag.prop('checked');
      var wrap       = thisTag.closest('#popular-tags');

      if (!wrap.prop('disabled')) {
        var idx = arrTags.indexOf(tagName);
        if (isSelected && idx<0) {
          // NOT already selected so add it to the list.
          arrTags.push(tagName);
        }
        if (!isSelected && idx>=0) {
          // In the list so remove it
          arrTags.splice(idx,1);
        }
        searchTags.val(arrTags.join('; '));

        // And set the 'selected' disply state of the parent tag.
        thisTag.parent().toggleClass('checked', (idx<0));
      }
    };
    var recheckSavedTagStatus = function() {
      var arrTags  = fetchTagsList(searchTags.val());
      var usedTags = {};
      var aTag, tag;
      for (var i=0;i<arrTags.length;i++) {
        aTag = arrTags[i];

        usedTags[aTag]=1;

        // Saved tag?
        if (popularTags_a.hasOwnProperty(aTag)) {
          // YES - make sure it's checked.
          tag = popularTags_a[aTag];
          if (!tag.parent.hasClass('checked')) {
            tag.parent.addClass('checked');
            tag.tag.prop('checked', true);
          }
        }
      }
      // Check to see whether any need to be removed.
      for (var tagName in popularTags_a) {
        if (!usedTags.hasOwnProperty(tagName) && popularTags_a[tagName].parent.hasClass('checked')) {
          // Checked when it shouldn't be
          popularTags_a[tagName].parent.removeClass('checked');
        }
      }
    };

    var processTagChange = function(ev) {
      // If this is a 'blur' or a 'keyup' and one of our significant characters then re-check the saved tag status.
      if (ev.type=='blur' || (ev.type=='keyup' && (ev.key==',' || ev.key==';' || ev.keyCode==8)))
        recheckSavedTagStatus();
    };

    // toggleUntaggedCalls
    var toggleUntaggedCalls = function() {
      var untagged = untaggedSearch.prop('checked');
      popularTags.prop('disabled',untagged).toggleClass('fade',untagged);
      searchTags.prop('disabled',untagged);
      searchTagWrap.toggleClass('fade',untagged);
    };

    // Prime intial data values
    rebuildPopularTagList();
    recheckSavedTagStatus();
    toggleUntaggedCalls();

    // assign event listeners.
    $('#popular-tags').on('click','.saved-tag',changeSavedTagState);
    $('#tags').on('keyup blur', processTagChange).val();
    $('#untagged').on('change', toggleUntaggedCalls).val();
  });
})(jQuery);
