/* global jQuery */
(function($) {
  // Add a handler that will catch all requests to change call visibility
  $(function() {
    $('#call_details').on('click', '.visible', (ev) => {
      // Work out the call ID
      var visTag = $(ev.currentTarget);
      var callID = visTag.closest('.panel').prop('id').replace(/^call_/,'');
      console.log('CHANGING VISIBILITY... ID: '+callID);

      if (!isNaN(callID)) {
        $.post('/toggle-visibility/' + callID, (resp) => {
          console.log("POST RESPONSE: ", resp);

          if (resp.success=='success') {
            // State change OK - change the visual representation
            visTag.toggleClass('no', resp.newState);

          }
        });
      }
      ev.stopPropagation();
      ev.preventDefault();
    });
  });
})(jQuery);
