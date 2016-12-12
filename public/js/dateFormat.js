/* global jQuery */
(function($) {
  $('#date').datepicker({
    dateFormat: 'yy-mm-dd',
    dayNamesMin: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  });
  $('#dateRange').datepicker({
    dateFormat: 'yy-mm-dd',
    dayNamesMin: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
      var p = $('#'+list.prop('id')+'_id');
      if (list.hasClass('hidden')) {
        console.log("SELECT HIDDEN - Show and focus");
        list.removeClass('hidden').focus();
      }
      else {
        // Already shown so needs to be hidden
        console.log("SELECT VISIBLE - Hide and focus proxy");
        list.addClass('hidden');
        //p.focus();
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
      console.log("ICON FOUND SELECT CONTROL: ",sel.length);
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
      console.log("NEW_ELEM: ", repl);
      // elem = elem.replaceWith(repl);
      $(repl).insertAfter(elem);

      // Move to the parent.
      elem.prop('size',5).addClass('sel_popup');
      elem.appendTo(elem.parent().parent());

      $('.sel_proxy').on('focus blur', function(ev) {
        // Proxy has been given focus so display the popup and give it focus.
        console.log("PROXY CLICK", ev.type, ev);
        openRealSelect(ev);
        ev.stopPropagation();
        ev.preventDefault();
      });
      $('.sel_target').on('change blur', function(ev) {
        var t = $(ev.currentTarget);
        var v = t.val();
        console.log('SELECT CHANGE OR BLUR',$('option:selected',t).text());
        var name = t.html();
        var p = $('#'+t.prop('id')+'_id');
        t.addClass('hidden');
        p.val($('option:selected',t).text());
        ev.stopPropagation();
        ev.preventDefault();
      });
    });
  });
})(jQuery);
