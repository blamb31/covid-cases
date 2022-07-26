import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit {

  public selectedCountry: {[ name: string ]: any} = {};
  public infoType: string = 'cases';

  @Output() countrySelected = new EventEmitter<{[ name: string ]: any}>();
  @Input() info: any

  constructor() { }

  public setCountry(country: {[ name: string ]: any}) {
    console.log({country})
    this.selectedCountry = country;
    this.countrySelected.emit(country);
  }


  ngOnInit(): void {

    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYmxhbWIzMSIsImEiOiJjbDV3eXNhYjYwb2xyM2pvMXluYXZzdDF0In0.aQAzMJkQphm0PXpGXfYoEA';
    const map = new mapboxgl.Map({
      container: 'map', // Specify the container ID
      style: 'mapbox://styles/mapbox/dark-v10', // Specify which map style to use
      center: [ -97.44121, 37.76132 ], // Specify the starting position [lng, lat]
      zoom: 2.5 // Specify the starting zoom
    });

    let countryClicked: any = false;
    let hoveredCountryId: any = null;

    map.on('load', () => {

      map.addSource('cbs', {  // country-boundaries-simplified
        'type': 'geojson',
        'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
      });

      map.addLayer({
        "id": "country-fills",  // country-fills
        "type": "fill",
        "source": "cbs",
        "layout": {},
        "paint": {
          "fill-color": "#42697d",
          "fill-opacity": 0.5
        }
      });

      map.addLayer({
        "id": "cb",  // country borders
        "type": "line",
        "source": "cbs",
        "layout": {},
        "paint": {
          "line-color": "#1c3f52",
          "line-width": 2
        }
      });

      map.addLayer({
        "id": "cfh",  // country-fills-hover",
        "type": "fill",
        "source": "cbs",
        "layout": {},
        "paint": {
          "fill-color": "#42697d",
          "fill-opacity": 1
        },
        "filter": [ "==", "name", "" ]
      });

      // When the user moves their mouse over the page, we look for features
      // at the mouse position (e.point) and within the states layer (states-fill).
      // If a feature is found, then we'll update the filter in the state-fills-hover
      // layer to only show that state, thus making a hover effect.
      map.on("mousemove", (e: any) => {
        var features = map.queryRenderedFeatures(e.point, {layers: [ "country-fills" ]});

        if (features && features[ 0 ] && features[ 0 ].properties && features.length && !countryClicked) {
          map.getCanvas().style.cursor = 'pointer';
          map.setFilter("cfh", [ "==", "name", features[ 0 ].properties[ 'name' ] ]);
          const eCountry = features[ 0 ].properties[ 'admin' ]
          if (eCountry !== this.selectedCountry[ 'admin' ]) {
            this.setCountry(features[ 0 ].properties)
          }
        }
      });

      map.on("click", (e) => {
        var features = map.queryRenderedFeatures(e.point, {layers: [ "country-fills" ]});

        if (features && features[ 0 ] && features[ 0 ].properties && features.length) {
          map.getCanvas().style.cursor = 'pointer';
          map.setFilter("cfh", [ "==", "name", features[ 0 ].properties[ 'name' ] ]);
          const eCountry = features[ 0 ].properties[ 'admin' ]
          if (eCountry !== this.selectedCountry[ 'admin' ]) {
            this.setCountry(features[ 0 ].properties)
          } else {
            countryClicked = !countryClicked;
          }
        }
      })
    });



  }

}
