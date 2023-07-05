/* eslint-disable */

(function ($, Drupal, window, document, undefined) {
  'use strict';
  var mmg9TextWithCtaLoaded = false;

  Drupal.behaviors.mmg9TextWithCta = {
    attach: function (context, settings) {
      if (!mmg9TextWithCtaLoaded) {


        var boxInitialTop = $('.component--text-with-cta .text-cta-container').offset().top;
        $(window).on('resize', function() {
          boxInitialTop = $('.component--text-with-cta .text-cta-container').offset().top;
        });

        $(window).scroll(function () {
          var width = $(window).width();

          if (width < 960) {
            if ($(window).scrollTop() > boxInitialTop) {
              $('.component--text-with-cta .text-cta-container').css({position: 'fixed', top: '0', height: '6rem'});
            } else {
              $('.component--text-with-cta .text-cta-container').css({position: 'relative', top: 'unset', height: '20rem'});
            }
          } else {
            if ($(window).scrollTop() > boxInitialTop) {
              $('.component--text-with-cta .text-cta-container').css({position: 'fixed', top: '0', height: '6rem'});
            } else {
              $('.component--text-with-cta .text-cta-container').css({position: 'relative', top: 'unset', height: '35rem'});
            }
          }
        });

        mmg9TextWithCtaLoaded = true;
      }
    }
  };

})(jQuery, Drupal, this, this.document);
