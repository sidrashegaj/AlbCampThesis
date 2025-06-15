import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private accessToken = 'pk.eyJ1Ijoic2hlZ2FzaWRyYSIsImEiOiJjbTZtdGt0aXEwaWNiMmxzODkzNHhmZGwzIn0.RZBtraE8FdVIxlyAq8d2_Q';

  initializeMap(containerId: string, center: [number, number], zoom: number): mapboxgl.Map {
    return new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom,
      accessToken: this.accessToken, 
    });
  }
}
