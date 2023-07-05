/* eslint-disable */
(function ($, Drupal, window, document, undefined) {
  'use strict';
  var mmgRelatedContent = false;

  Drupal.behaviors.mmg9RelatedContent = {
    // To understand behaviors, see https://drupal.org/node/756722#behaviors
    attach: function (context, settings) {
      if (mmgRelatedContent) {
        return;
      }


      var slickWrapper = $(".component--related-content .view-related-content .view-content");
      let articles = document.querySelectorAll('.component--related-content article');
      if (articles) {
        articles.forEach(function(el, index) {
          el.addEventListener('click', function(){
            let link = el.querySelector('a');
            link.click();
          });
        });
      }

      slickWrapper.each(function(){
        var $parentID = $('.component--related-content').attr('data-entity-id');
        var slickOptions = {
          slidesToShow: 3,
          appendArrows: $(".arrows-wrap-" + $parentID),
          arrows: true,
          slidesToScroll: 1,
          infinite: true,
          centerMode: false,
          swipe: true,
          responsive: [
            {
              breakpoint: 1789,
              settings: {
                slidesToShow: 2,
                centerMode: false,
                appendArrows: $(".arrows-wrap-" + $parentID),
              },
            },
            {
              breakpoint: 1337,
              settings: {
                slidesToShow: 1,
                centerMode: false,
                appendArrows: $(".arrows-wrap-" + $parentID),
              },
            },
            {
              breakpoint: 1280,
              settings: {
                slidesToShow: 4,
                centerMode: false,
                arrows: false,
                //appendArrows: $(".arrows-wrap-" + $parentID),
              },
            },
            {
              breakpoint: 1236,
              settings: {
                slidesToShow: 3,
                centerMode: false,
                arrows: false,
                //appendArrows: $(".arrows-wrap-" + $parentID),
              },
            },
            {
              breakpoint: 930,
              settings: {
                slidesToShow: 2,
                centerMode: false,
                arrows: false,
                //appendArrows: $(".arrows-wrap-" + $parentID),
              },
            },
            {
              breakpoint: 620,
              settings: {
                slidesToShow: 1,
                centerMode: false,
                swipe: true,
                //appendArrows: $(".arrows-wrap-" + $parentID),
              },
            }

          ]
        };
        $(this).not('.slick-initialized').slick(slickOptions);
      });
    }
  };

})(jQuery, Drupal, this, this.document);
