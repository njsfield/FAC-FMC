/* global jQuery */
(function($) {
  $(function() {
    var clearFilterForm = function () {
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

    };

    $('#clear-form').on('click', clearFilterForm);
    $('#show-all').on('click', function() {
      clearFilterForm();
      document.getElementById('filter-form').submit();
    });
  });
})(jQuery);
