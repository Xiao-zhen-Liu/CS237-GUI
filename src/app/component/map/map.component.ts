import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {latLng, MapOptions, tileLayer, Map, marker, Marker} from 'leaflet';
import icons from 'leaflet-color-number-markers';
import {WebsocketService} from "../../service/websocket/websocket.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  markerClusterGroup!: L.MarkerClusterGroup;
  map!: Map;
  mapOptions!: MapOptions;

  constructor(private websocketService: WebsocketService) {
    this.markerClusterGroup = L.markerClusterGroup({removeOutsideVisibleBounds: true});
  }

  ngOnInit() {
    this.initializeMapOptions();
  }

  onMapReady(map: Map) {
    this.map = map;
    this.createMarker();
    this.addLayersToMap();
    this.websocketService.openWebsocket("red");
    this.websocketService.productUpdateSubject.asObservable().pipe(untilDestroyed(this)).subscribe(product => {
      console.log(product);
    })
    // setInterval(()=>{
    //   this.markerClusterGroup.eachLayer(layer => {
    //     const randInt = Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(0) + 1)) + Math.ceil(0);
    //     const randIcon = MapComponent.getDefaultIcon(randInt);
    //     (layer as Marker).setIcon(randIcon);
    //   })
    // }, 5000);
    // setInterval(()=> {
    //   const totalMarkers = this.markerClusterGroup.getLayers().length;
    //   const randomLayerId = Math.floor(Math.random() * (Math.floor(totalMarkers-1) - Math.ceil(0) + 1)) + Math.ceil(0);
    //   this.markerClusterGroup.removeLayer(this.markerClusterGroup.getLayer(randomLayerId) as Layer);
    //   this.markerClusterGroup.addLayer(MapComponent.randomMarker());
    // }, 0.1);
  }

  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(33.90, -118.20),
      zoom: 12,
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: 'Map data © OpenStreetMap contributors'
          })
      ],
    };
  }

  private createMarker() {
    const markerClusterData: L.Marker[] = [];
    for (let i = 0; i < 50000; i++) {
      const newMarker = MapComponent.randomMarker();
      markerClusterData.push(newMarker);
    }
    this.markerClusterGroup.addLayers(markerClusterData);
  }

  private static randomMarker(): Marker {
    const randInt = Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(0) + 1)) + Math.ceil(0);
    const randIcon = MapComponent.getDefaultIcon(randInt);
    const randCoordinate = latLng([
      (Math.random() * (33.8 - 34.1) + 34.1),
      (Math.random() * (-118.36689 - -118) + -118)
    ]);
    const newMarker = marker(randCoordinate).setIcon(randIcon);
    newMarker.bindPopup("<b>Hello world!</b><br>I am a popup.");
    return newMarker;
  }

  private static getDefaultIcon(quantity: number) {
    return icons.black.numbers[quantity];
  }

  private addLayersToMap() {
    this.markerClusterGroup.addTo(this.map);
  }

}
