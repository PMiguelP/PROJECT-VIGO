import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  selectedLocations: google.maps.LatLng[] = [];
  infoWindow!: google.maps.InfoWindow;

  darkModeStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8b8b8b' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#2b2b2b' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#121212' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#3d2f25' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1e1e1e' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#303030' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#4a5b6d' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#283a6a' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#1a281d' }],
    },
    {
      featureType: 'traffic',
      elementType: 'geometry',
      stylers: [{ color: '#ff0000' }],
    },
  ];

  constructor(private modalController: ModalController) {}

  async ngOnInit() {
    try {
      const loader = new Loader({
        apiKey: environment.googleMapsApiKey,
        version: 'weekly',
        libraries: ['places'],
      });

      await loader.load();
      this.initializeMap();
      this.initializePlacesAutocomplete();
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }

  private initializeMap() {
    try {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: 41.1579, lng: -8.6291 },
        zoom: 15,
        styles: this.darkModeStyle,
        mapId: 'dark_map',
        disableDefaultUI: true,
      });

      this.infoWindow = new google.maps.InfoWindow();

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
        },
      });
      this.directionsRenderer.setMap(this.map);
    } catch (error) {
      console.error('Error setting up map:', error);
    }
  }

  private initializePlacesAutocomplete() {
    try {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchInput.nativeElement,
        {
          types: ['establishment'],
          //omponentRestrictions: { country: 'PT' },
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
        }
      );

      autocomplete.bindTo('bounds', this.map);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.error('No location found for this place');
          return;
        }

        this.handlePlaceSelection(place);
      });
    } catch (error) {
      console.error('Error setting up places autocomplete:', error);
    }
  }

  private handlePlaceSelection(place: google.maps.places.PlaceResult) {
    try {
      if (!place.geometry || !place.geometry.location) {
        console.error('No geometry data available for the selected place.');
        return;
      }

      this.map.setCenter(place.geometry.location);
      this.map.setZoom(17);

      const marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        title: place.name || 'Unnamed Location',
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      this.markers.push(marker);

      const contentString = `
  <div>
    <h4>${place.name || 'Unknown'}</h4>
    <p>${place.formatted_address || 'No address available'}</p>
     <button id="selectLocationButton" style="padding: 10px 20px; font-size: 16px; background-color: #4285F4; color: white; border: none; border-radius: 5px; cursor: pointer;">
      Select Location
    </button>
  </div>
`;

      this.infoWindow.setContent(contentString);
      this.infoWindow.open(this.map, marker);

      google.maps.event.addListenerOnce(this.infoWindow, 'domready', () => {
        const button = document.getElementById('selectLocationButton');
        if (button) {
          button.addEventListener('click', () => {
            const selectedData = {
              name: place.name,
              address: place.formatted_address,
              latitude: place.geometry!.location!.lat(),
              longitude: place.geometry!.location!.lng(),
            };
            this.modalController.dismiss(selectedData); // Send data back to the parent
          });
        }
      });
    } catch (error) {
      console.error('Error handling place selection:', error);
    }
  }

  clearMarkers() {
    try {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
      this.selectedLocations = [];
      if (this.directionsRenderer) {
        this.directionsRenderer.setDirections(null);
      }
    } catch (error) {
      console.error('Error clearing markers:', error);
    }
  }
  dismissModal() {
    this.modalController.dismiss(); // Closes the modal without passing data
  }
}
