import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {LeafletMarkerClusterModule} from "@asymmetrik/ngx-leaflet-markercluster";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    LeafletMarkerClusterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
