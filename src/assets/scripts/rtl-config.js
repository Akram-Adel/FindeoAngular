$(function() {
  setTimeout(() => {

    // mMenu Header
    if( $('body').hasClass('rtl-config') ) {
      $('.mm-navbar .mm-title').first().text('القائمة');
    }

  }, 1000);
});