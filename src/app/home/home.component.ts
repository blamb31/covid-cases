import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYmxhbWIzMSIsImEiOiJjbDV3eXNhYjYwb2xyM2pvMXluYXZzdDF0In0.aQAzMJkQphm0PXpGXfYoEA';
    const map = new mapboxgl.Map({
      container: 'map', // Specify the container ID
      style: 'mapbox://styles/mapbox/outdoors-v11', // Specify which map style to use
      center: [ -122.44121, 37.76132 ], // Specify the starting position [lng, lat]
      zoom: 3.5 // Specify the starting zoom
    });

    let hoveredStateId: any = null;

    map.on('load', () => {
      map.addSource('states', {
        'type': 'geojson',
        'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
      });

      // The feature-state dependent fill-opacity expression will render the hover effect
      // when a feature's hover state is set to true.
      map.addLayer({
        'id': 'state-fills',
        'type': 'fill',
        'source': 'states',
        'layout': {},
        'paint': {
          'fill-color': '#627BC1',
          'fill-opacity': [
            'case',
            [ 'boolean', [ 'feature-state', 'hover' ], false ],
            1,
            0.5
          ]
        }
      });

      map.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'layout': {},
        'paint': {
          'line-color': '#627BC1',
          'line-width': 2
        }
      });

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      map.on('mousemove', 'state-fills', (e: any) => {
        console.log({e})
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              {source: 'states', id: hoveredStateId},
              {hover: false}
            );
          }
          hoveredStateId = e.features[ 0 ].id;
          map.setFeatureState(
            {source: 'states', id: hoveredStateId},
            {hover: true}
          );
        }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'state-fills', () => {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            {source: 'states', id: hoveredStateId},
            {hover: false}
          );
        }
        hoveredStateId = null;
      });
    });

  }

}
