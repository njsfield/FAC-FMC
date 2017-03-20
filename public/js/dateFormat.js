/* global jQuery */
(function($) {
  $('#date,#dateRange').datepicker({
    dateFormat: 'yy-mm-dd',
    dayNamesMin: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    immediateUpdates: true,
    startView: 1
  });

  var dateRangeCheckbox = $('#date_range_checkbox');
  var dateRangeBox      = $('#date_range_box');
  var date              = $('#date');

  //if (dateRangeCheckbox.prop('checked')) {
    //dateRangeCheckbox.setAttribute('checked', true);
  //}

  var showRange = function () {
    if (dateRangeCheckbox.prop('checked')) {
      dateRangeBox.removeClass('hidden');
      date.prop('placeholder','Date from:  yyyy-mm-dd');
    } else {
      dateRangeBox.addClass('hidden');
      date.prop('placeholder', 'Select date:  yyyy-mm-dd');
    }
  };
  $(function() {
    dateRangeCheckbox.on('change', showRange);

    function toggleRealSelect(list) {
      if (list.hasClass('hidden')) {
        list.removeClass('hidden').focus();
      }
      else {
        // Already shown so needs to be hidden
        list.addClass('hidden');
      }
    }
    function openRealSelect(ev) {
      var t    = $(ev.currentTarget);
      var list = $('#'+t.prop('id').replace(/_id$/,''));
      toggleRealSelect(list);
    }
    $(".stdForm").on("click", ".select-dropdown", function(ev) {
      var wrap = $(ev.currentTarget).closest('.control-group');
      var sel = $('select', wrap);
      toggleRealSelect(sel);
      ev.stopPropagation();
      ev.preventDefault();
    });
    $('.stdForm select').each(function() {
      // Add the hidden class and the 'special' class
      var elem = $(this);
      elem.addClass('hidden sel_target');

      var id  = elem.prop('id');
      var val = elem.val()||'';
      var placeholder = $('option:first-child', elem).text();

      // Is there a currently selected value?
      var val = $('option:checked', elem).text()||'';

      // Add a text box to replace it with.
      var repl = '<input readonly="readonly" type="text" class="sel_proxy form-ctrl select-dropdown" name="'+elem.prop('name')+'_n" id="'+id+'_id" value="'+val+'" placeholder="'+placeholder+'">';
      // elem = elem.replaceWith(repl);
      $(repl).insertAfter(elem);

      // Move to the parent.
      elem.prop('size',5).addClass('sel_popup');
      elem.appendTo(elem.parent().parent());

      $('.sel_proxy').on('focus blur', function(ev) {
        // Proxy has been given focus so display the popup and give it focus.
        openRealSelect(ev);
        ev.stopPropagation();
        ev.preventDefault();
      });
      $('.sel_target').on('change blur', function(ev) {
        var t = $(ev.currentTarget);
        var p = $('#'+t.prop('id')+'_id');
        t.addClass('hidden');
        p.val($('option:selected',t).text());
        ev.stopPropagation();
        ev.preventDefault();
      });
    });
  });
})(jQuery);
