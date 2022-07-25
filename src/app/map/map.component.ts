import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit {

  public selectedCountry: string = '';
  constructor() { }

  public setCountry(country: string) {
    console.log("SET", country)
    this.selectedCountry = country;
  }


  ngOnInit(): void {

    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYmxhbWIzMSIsImEiOiJjbDV3eXNhYjYwb2xyM2pvMXluYXZzdDF0In0.aQAzMJkQphm0PXpGXfYoEA';
    const map = new mapboxgl.Map({
      container: 'map', // Specify the container ID
      style: 'mapbox://styles/mapbox/dark-v10', // Specify which map style to use
      center: [ -122.44121, 37.76132 ], // Specify the starting position [lng, lat]
      zoom: 3.5 // Specify the starting zoom
    });

    let countryClicked: any = false;
    let hoveredCountryId: any = null;

    map.on('load', () => {
      // map.addSource('states', {
      //   'type': 'geojson',
      //   'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
      // });

      // The feature-state dependent fill-opacity expression will render the hover effect
      // when a feature's hover state is set to true.
      // map.addLayer({
      //   'id': 'state-fills',
      //   'type': 'fill',
      //   'source': 'states',
      //   'layout': {},
      //   'paint': {
      //     'fill-color': '#627BC1',
      //     'fill-opacity': [
      //       'case',
      //       [ 'boolean', [ 'feature-state', 'hover' ], false ],
      //       1,
      //       0.5
      //     ]
      //   }
      // });

      // map.addLayer({
      //   'id': 'state-borders',
      //   'type': 'line',
      //   'source': 'states',
      //   'layout': {},
      //   'paint': {
      //     'line-color': '#627BC1',
      //     'line-width': 2
      //   }
      // });

      map.addSource('cbs', {  // country-boundaries-simplified
        'type': 'geojson',
        'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
      });

      // map.addLayer({
      //   'id': 'country-borders',
      //   'type': 'line',
      //   'source': 'cbs',
      //   'layout': {},
      //   'paint': {
      //     'line-color': '#627BC1',
      //     'line-width': 2
      //   }
      // });
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
          if (eCountry !== this.selectedCountry) {
            this.setCountry(features[ 0 ].properties[ 'admin' ])
          }
        }
        // else {
        //   map.setFilter("cfh", [ "==", "name", "" ]);
        //   map.getCanvas().style.cursor = '';
        // }
      });

      // Reset the state-fills-hover layer's filter when the mouse leaves the map
      // map.on("mouseout", function () {
      //   map.getCanvas().style.cursor = 'auto';
      //   map.setFilter("cfh", [ "==", "name", "" ]);
      // });

      map.on("click", (e) => {
        var features = map.queryRenderedFeatures(e.point, {layers: [ "country-fills" ]});

        if (features && features[ 0 ] && features[ 0 ].properties && features.length) {
          map.getCanvas().style.cursor = 'pointer';
          map.setFilter("cfh", [ "==", "name", features[ 0 ].properties[ 'name' ] ]);
          const eCountry = features[ 0 ].properties[ 'admin' ]
          if (eCountry !== this.selectedCountry) {
            this.setCountry(features[ 0 ].properties[ 'admin' ])
          } else {
            countryClicked = !countryClicked;
          }
        }
      })

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      // map.on('mouseenter', 'state-fills', (e: any) => {
      //   console.log({e: e.features})
      // if (e.features.length > 0) {
      //   if (hoveredStateId !== null) {
      //     map.setFeatureState(
      //       {source: 'states', id: hoveredStateId},
      //       {hover: false}
      //     );
      //   }
      //   hoveredStateId = e.features[ 0 ].id;
      //   map.setFeatureState(
      //     {source: 'states', id: hoveredStateId},
      //     {hover: true}
      //   );
      // }
      // });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      // map.on('mouseleave', 'state-fills', () => {
      // if (hoveredStateId !== null) {
      //   map.setFeatureState(
      //     {source: 'states', id: hoveredStateId},
      //     {hover: false}
      //   );
      // }
      // hoveredStateId = null;
      // });

      map.on('click', 'country-fills', (e: any) => {
        console.log({e, hoveredCountryId})

      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('click', 'country-fills', (e: any) => {
        console.log({e: e.features})
      });
    });



  }

}
