import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {latLng, MapOptions, tileLayer, Map, icon, marker} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  markerClusterGroup!: L.MarkerClusterGroup;
  map!: Map;
  mapOptions!: MapOptions;

  constructor() {
    this.markerClusterGroup = L.markerClusterGroup({removeOutsideVisibleBounds: true});
  }

  ngOnInit() {
    this.initializeMapOptions();
  }

  onMapReady(map: Map) {
    this.map = map;
    this.createMarker();
    this.addLayersToMap();
  }

  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(33.90, -118.20),
      zoom: 12,
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 30,
            attribution: 'Map data © OpenStreetMap contributors'
          })
      ],
    };
  }

  private createMarker() {
    const mapIcon = MapComponent.getDefaultIcon();
    const markerClusterData: L.Marker[] = [];
    for (let i = 0; i <50000; i++) {
      markerClusterData.push(marker(latLng([(Math.random() * (33.85098 - 34.09624) + 34.09624), (Math.random() * (-118.36689 - -118.07878) + -118.07878)])).setIcon(mapIcon));
    }
    this.markerClusterGroup.addLayers(markerClusterData);
  }

  private static getDefaultIcon() {
    return icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png'
    });
  }

  private addLayersToMap() {
      this.markerClusterGroup.addTo(this.map);
    }

}
