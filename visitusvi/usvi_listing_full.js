/**
 * JS for the handling of the the slideshow component.
 */

(function ($, Drupal, window, document, undefined) {
  var usviListingFullLoaded = false;
  // To understand behaviors, see https://drupal.org/node/756722#behaviors
  Drupal.behaviors.usviListingFull = {

    attach: function (context, settings) { // jshint ignore:line

      // Add attribute title to the map on profile content type
      $(window).on('load', function() {
        $('.node--listing--full .listing-map.listing-map-google [role="button"]').attr('title', 'map pin');
      });

      if (!usviListingFullLoaded) {
        let profileNode = document.querySelector('.node--listing--full');
        if (profileNode) {

          // slider
          $('.node--listing--full .listing-media .field--name-field-images').not('.slick-initialized').each(function(){
            var $parentID = $(this).parents('.node--listing--full').attr('data-nid');
            var $kids = $(this).children().length;
            if ($kids <= 1) {
              $(this).addClass('single-slide');
            } else {
              $(this).slick({
                arrows: true,
                appendArrows: $('.slick-arrows-' + $parentID),
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
              });
            }
          });

          let lat = profileNode.dataset.lat;
          let lon = profileNode.dataset.lon;
          let placeName = '<div class="place-title">' + profileNode.dataset.placeName + '</div>';
          let address = (profileNode.querySelector('.listing-fields-address-inner') || {innerHTML: ' '}).innerHTML;
          let leafletMapWrap = profileNode.querySelector('.listing-map-leaflet');
          let googleMapWrap = profileNode.querySelector('.listing-map-google');


          if (lat && lon && leafletMapWrap) {
            let mapDiv = leafletMapWrap.id;
            let map = L.map(mapDiv, {zoomControl: false}).setView([lat, lon], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.scrollWheelZoom.disable();
            let marker = L.marker([lat, lon]).addTo(map);
          }

          if (lat && lon && googleMapWrap) {
            let placeId = googleMapWrap.dataset.placeId;
            let place = new google.maps.LatLng(lat, lon);

            let mapDiv = document.getElementById(googleMapWrap.id);
            let map = new google.maps.Map(mapDiv, {
              center: place,
              zoom: 19,
              streetViewControl: false,
              mapTypeControl: false,
              scaleControl: false,
              rotateControl: false,
              scrollwheel: false,
              fullscreenControl: false
            });

            const contentString =
              '<div class="custom-pop-content">' +
              placeName + address
            "</div>";
            const infowindow = new google.maps.InfoWindow({
              content: contentString,
            });

            const marker = new google.maps.Marker({
              position: place,
              map: map,
            });

            marker.addListener("click", () => {
              infowindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
              });
            });
          }
        }


        // Get the modal, button, and close button elements
        const modal = document.querySelector('.modal_content');
        const modalButton = document.querySelector('.modal_button');
        const closeButton = document.querySelector('.modal_close');

        // Function to display the modal when the button is clicked
        function displayModal() {
          // add the class 'show_modal' to the modal
          modal.classList.add('show_modal');
        }

        // Function to hide the modal when the close button is clicked
        function closeModal() {
          // remove the class 'show_modal' from the modal
          modal.classList.remove('show_modal');
        }

        // Event listener to show the modal when the button is clicked
        modalButton.addEventListener('click', displayModal);

        // Event listener to hide the modal when the close button is clicked
        closeButton.addEventListener('click', closeModal);


        usviListingFullLoaded = true;
      }
    }
  };

})(jQuery, Drupal, this, this.document); // jshint ignore:line
