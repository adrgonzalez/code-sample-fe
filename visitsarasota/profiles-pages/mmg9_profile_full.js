/* eslint-disable */

(function ($, Drupal, window, document, undefined) {
  'use strict';
  var mmgProfileFullLoaded = false;

  Drupal.behaviors.mmg9ProfileFull = {

    /** BEGIN LEAFLET MAP **/
    mapDiv: function () {
      let mapView = document.querySelector('.node--profile--full .views-map-view');

      Drupal.behaviors.mmg9ProfileFull.initListingsMap(mapView, document);
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

      let nodes = parent.querySelectorAll('.node--profile--full');
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

          let nodeInner = node.querySelector('.field--name-title > div');
          let popup = '<div class="l-pop" id="pop-'+ id +'"></div>';
          const customOptions = {
            minWidth: "325px",
            maxWidth: "325px",
            className: "l-customPopup", // name custom popup
          };

          let ajaxUrl = '/node/get/ajax/' + + node.getAttribute('data-history-node-id');

          let markerid = 'markerid-' + node.getAttribute('data-history-node-id');
          //var pop = value.popupContents;

          console.log('lat'+lat);
          console.log('lon'+lon);

          if (lat !== '' && lon !== '') {

            markers[markerid] = L.marker([lat, lon], {customId: markerid, icon: blueIcon})
              .bindPopup(popup, customOptions)
              .on("popupopen", function (e) {
                let pop = e.popup;
                $.ajax({
                  url: ajaxUrl,
                  type: 'POST',
                  cache: true,
                  start: function (data) {
                  },
                  success: function (data) {
                    console.log(data);
                    let nodeContent = $(data).find('.node--listing--tabbed-listings-teaser');
                    //popup.innerHTML = nodeContent;
                    var dom = document.createElement('html');
                    dom.innerHTML = data;

                    pop.setContent(dom.querySelector('.node--listing--tabbed-listings-teaser'));
                  },
                  error: function (data) {
                    //alert("ERROR");
                    let nodeContent = '<span>' + nodeInner.innerHTML + '</span>';
                    pop.setContent(nodeContent);
                  },
                  complete: function (data) {
                  }
                }); //end of $.ajax
              })
              .on("popupclose", function (e) {
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

          }
        });
        map.fitBounds(bounds, { padding: [5, 5], animate: true, duration: 1 });
      }
    },

    attach: function (context, settings) {
      if (!mmgProfileFullLoaded) {

        let profileFull = $('.node--profile--full');

        // 360 Button
        var i360_iframe = $('.node--profile--full .i360-wrapper .overlay--360').find('iframe').length;
        if (i360_iframe == 0) {
          $('.node--profile--full .i360-wrapper').hide();
        }

        profileFull.on('click', '.button--360', function () {
          $(this).next('.overlay--360').addClass('opened');
        });
        profileFull.on('click', '.overlay--360', function () {
          $(this).removeClass('opened');
        });

        let map_lat = document.querySelector('.node--profile--full').attributes['data-lat'].value;
        let map_lon = document.querySelector('.node--profile--full').attributes['data-lon'].value;

        $(document).ready(function () {
          setTimeout(function () {
            if (map_lat !== '' && map_lon !== '') {
              Drupal.behaviors.mmg9ProfileFull.mapDiv();
            }
          }, 500);
        });

        window.mapsPlaceholder = [];

        L.Map.addInitHook(function () {
          window.mapsPlaceholder.push(this); // Use whatever global scope variable you like.
        });

        $(document).ajaxComplete(function (event, xhr, settings) {
          setTimeout(function () {
            if (map_coordenates !== '') {
              Drupal.behaviors.mmg9ProfileFull.mapDiv();
            }
          }, 500);
        });

        $('.node--profile--full .top .profile-slider .field--name-field-images').not('.slick-initialized').each(function(){
          var kids = $(this).children().length;
          if (kids <= 1) {
            $('.node--profile--full .profile-container').addClass('single-slide');
            const targetElement = document.querySelector('.node--profile--full .profile-container .content .description');
            const insertedElement = document.querySelector('.node--profile--full .header .tour');
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
                    appendDots: $('.slider-nav .slick-dots-profiles'),
                    arrows: true,
                    prevArrow: '<button class="slick-prev-button slick-prev-slide"><span class="slick-prev-icon" aria-hidden="true"></button>',
                    nextArrow: '<button class="slick-next-button slick-next-slide"><span class="slick-next-icon" aria-hidden="true"></button>',
                    appendArrows: $('.slider-nav'),
                    slidesToShow: 2,
                  }
                },
              ]
            });

            var element = document.getElementsByClassName('node--profile--full')[0];

            if (element.getAttribute('data-lon') === '') {
              const map = document.getElementById('listings-map');
              if (map.innerHTML.trim() === '') {
                var amenities = $('.node--profile--full .profile-container .content .amenities').clone();
                $('.node--profile--full .profile-container .content .amenities').detach();
                amenities.appendTo('.node--profile--full .profile-container .map #listings-map');
                $('.node--profile--full .profile-container .map').addClass('no-map');
              }
            }
          }
        });

        mmgProfileFullLoaded = true;
      }
    }
  };

})(jQuery, Drupal, this, this.document);
