/* eslint-disable */

(function ($, Drupal, window, document, undefined) {
  'use strict';
  var mmgEventFullLoaded = false;

  Drupal.behaviors.mmg9EventFull = {

    /** BEGIN LEAFLET MAP **/
    mapDiv: function () {
      let mapView = document.querySelector('.node--event--full .views-map-view');

      Drupal.behaviors.mmg9EventFull.initListingsMap(mapView, document);
    },

    initListingsMap: function (mapView, parent) {
      let mapDiv = mapView.children[0];
      let markerGroup;
      let markers = [];
      let map = L.map(mapDiv, { zoomControl: false }).setView([27.3358496, -82.6079707], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      new L.Control.Zoom({ position: 'topright' }).addTo(map);
      map.scrollWheelZoom.disable();

      let nodes = parent.querySelectorAll('.node--event--full');
      let circleIcon = L.Icon.extend({
        options: {
          customId: "",
          //shadowUrl: '/sites/all/themes/custom/vso_bare/images/marker_shadow.png',
          iconSize: [25, 33], // size of the icon
          //shadowSize:   [25, 25], // size of the shadow
          iconAnchor: [13, 13], // point of the icon which will correspond to marker's location
          //shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        }
      });
      let blueIcon = new circleIcon({ iconUrl: "/themes/custom/mmg9/images/map-pin-default.svg" });
      let blueIconActive = new circleIcon({ iconUrl: "/themes/custom/mmg9/images/map-pin-active.svg" });
      let bounds = L.latLngBounds();

      if (nodes.length) {
        nodes.forEach(function (node, index) {
          let lat = node.getAttribute('data-lat');
          let lon = node.getAttribute('data-lon');
          let uri = node.getAttribute('about');
          let id = node.getAttribute('data-history-node-id');

          let title = node.getAttribute('data-dename');
          // console.log('title'+title);
          let popup = '<div class="l-pop" id="pop-'+title+'"></div>';

          // let nodeInner = node.querySelector('.field--name-title > div');
          // let popup = '<div class="l-pop" id="pop-'+ id +'"></div>';
          const customOptions = {
            minWidth: "325px",
            maxWidth: "325px",
            className: "l-customPopup", // name custom popup
          };

          let ajaxUrl = '/node/get/ajax/' + + node.getAttribute('data-history-node-id');

          let markerid = 'markerid-' + node.getAttribute('data-history-node-id');
          //var pop = value.popupContents;

          markers[markerid] = L.marker([lat, lon], { customId: markerid, icon: blueIcon })
            .bindPopup(popup, customOptions)
            .on("popupopen", function (e) {
              let pop = e.popup;
              $.ajax({
                url:ajaxUrl,
                type:'POST',
                cache:true,
                start: function(data) { },
                success: function(data) {
                  console.log(data);
                  let nodeContent = $(data).find('.node--listing--tabbed-listings-teaser');
                  //popup.innerHTML = nodeContent;
                  var dom = document.createElement('html');
                  dom.innerHTML = data;

                  pop.setContent(dom.querySelector('.node--listing--tabbed-listings-teaser'));
                },
                error: function(data) {
                  //alert("ERROR");
                  let nodeContent = '<span>'+ nodeInner.innerHTML +'</span>';
                  pop.setContent(nodeContent);
                },
                complete: function(data){ }
              }); //end of $.ajax
            })
            .on("popupclose", function(e) {
              return false;
            })
            .addTo(map);

          markers[markerid].addEventListener("click", function (e) {
            for (var m in markers) {
              markers[m].setIcon(blueIcon);
            }
            markers[markerid].setIcon(blueIconActive);
          });
          bounds.extend([lat, lon]);
        });
        map.fitBounds(bounds, { padding: [5, 5], animate: true, duration: 1 });
      }
    },

    attach: function (context, settings) {
      if (!mmgEventFullLoaded) {

        let eventFull = $('.node--event--full');

        // 360 Button
        var i360_iframe = $('.node--event--full .i360-wrapper .overlay--360').find('iframe').length;
        if (i360_iframe == 0) {
          $('.node--event--full .i360-wrapper').hide();
        }

        eventFull.on('click', '.button--360', function () {
          $(this).next('.overlay--360').addClass('opened');
        });
        eventFull.on('click', '.overlay--360', function () {
          $(this).removeClass('opened');
        });

        let map_coordenates = document.querySelector('.node--event--full');
        // const element = document.getElementById('node--event--full');
        // const map_coordenates = node.getAttribute('data-lon');

        $(document).ready(function () {
          setTimeout(function () {
            if (map_coordenates !== null) {
              Drupal.behaviors.mmg9EventFull.mapDiv();
            }
          }, 500);
        });

        window.mapsPlaceholder = [];

        L.Map.addInitHook(function () {
          window.mapsPlaceholder.push(this); // Use whatever global scope variable you like.
        });

        $(document).ajaxComplete(function (event, xhr, settings) {
          setTimeout(function () {
            if (map_coordenates !== null) {
              Drupal.behaviors.mmg9EventFull.mapDiv();
            }
          }, 500);
        });

        if ($('.node--event--full .event-slider .field--name-field-images').length === 0) {
          $('.node--event--full .event-container').addClass('single-slide');
        }

        $('.node--event--full .top .event-slider .field--name-field-images').not('.slick-initialized').each(function(){
          var kids = $(this).children().length;
          if (kids <= 1) {
            $('.node--event--full .event-container').addClass('single-slide');

            const targetElement = document.querySelector('.node--event--full .event-container .content .description');
            const insertedElement = document.querySelector('.node--event--full .header .tour');
            const parentElement = targetElement.parentNode;
            parentElement.insertBefore(insertedElement, targetElement);

          } else {
            $(this).slick({
              infinite: true,
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              mobileFirst: true,
              centerMode: true,
              responsive: [
                {
                  breakpoint: 960,
                  settings: {
                    dots: true,
                    appendDots: $('.slider-nav .slick-dots-events'),
                    arrows: true,
                    prevArrow: '<button class="slick-prev-button slick-prev-slide"><span class="slick-prev-icon" aria-hidden="true"></button>',
                    nextArrow: '<button class="slick-next-button slick-next-slide"><span class="slick-next-icon" aria-hidden="true"></button>',
                    appendArrows: $('.slider-nav'),
                    slidesToShow: 2,
                  }
                },
              ]
            });

            var element = document.getElementsByClassName('node--event--full')[0];

            if (element.getAttribute('data-lon') === '') {
              const map = document.getElementById('listings-map');
              if (map.innerHTML.trim() === '') {
                var amenities = $('.node--event--full .event-container .content .amenities').clone();
                $('.node--event--full .event-container .content .amenities').detach();
                amenities.appendTo('.node--event--full .event-container .map #listings-map');
                $('.node--event--full .event-container .map').addClass('no-map');
              }
            }
          }
        });

        mmgEventFullLoaded = true;
      }
    }
  };

})(jQuery, Drupal, this, this.document);
