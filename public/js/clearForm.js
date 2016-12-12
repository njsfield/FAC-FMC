/* global jQuery */
(function($) {
  $(function() {
    // var showAll = $('#show-all');
    var clearForm = $('#clear-form');

    clearForm.on('click', function(ev) {
      var filterSpecProperties = ['duration_min', 'duration_max', 'to', 'from', 'tags', 'date', 'dateRange'];
      filterSpecProperties.forEach(function (id) {
        var elem = document.getElementById(id);
        elem.value = '';
      });
      $('#tags').prop('disabled',false);
      $('#popular-tags .saved-tag').prop({checked: false, disabled: false});
      $('#popular-tags .popular-tag').removeClass('checked');
      $('#popular-tags').removeClass('fade');
      $('#saved-filters').prop('selectedIndex',0);

      $('#untagged').prop('checked',false).parent().removeClass('checked');
      $('#showhidden_checkbox').prop('checked',false).parent().removeClass('checked');
      $('#date_range_checkbox').prop('checked',false).parent().removeClass('checked');

      // Because we cleared the date-range and untagged check boxes make sure we reset the dependent control
      $('#date_range_box').addClass('hidden');

      ev.stopPropagation();
      ev.preventDefault();
    });
    var clearFilterForm = function () {
      var filterSpecProperties = ['duration_min', 'duration_max', 'to', 'from', 'tags', 'date', 'dateRange'];
      filterSpecProperties.forEach(function (id) {
        var elem = document.getElementById(id);
        elem.value = '';
      });
      var checkboxArray = document.getElementsByClassName('saved-tag');
      for(var i = 0; i < checkboxArray.length; i++){
        checkboxArray[i].checked = false;
        checkboxArray[i].parentNode.setAttribute('class', 'popular-tag unchecked');
      }
      var options = document.getElementById('dropdown');
      options.selectedIndex = 0;

    };

    var showAllCalls = function() {
      clearFilterForm();
      document.getElementById('filter-form').submit();
    };

    /** event listener to show all calls */
    // showAll.addEventListener('click', showAllCalls);

    /** event listener to clear the filter form */
    // clearForm.addEventListener('click', clearFilterForm);
  });
})(jQuery);
