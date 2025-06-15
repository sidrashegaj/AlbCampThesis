import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Campground } from '../../models/campground.model';
import { CampgroundService } from '../../services/campground.service';
import { MapboxService } from '../../services/mapbox.service';
import mapboxgl from 'mapbox-gl';
import CircleType from 'circletype';

@Component({
  selector: 'app-campground-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './campground-list.component.html',
  styleUrls: ['./campground-list.component.css'],
  providers: [CampgroundService],
})
export class CampgroundListComponent implements OnInit, AfterViewInit {
  campgrounds: Campground[] = [];
  map!: mapboxgl.Map;
searchQuery: string = '';
filteredCampgrounds: Campground[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private campgroundService: CampgroundService,
    private router: Router,
    private mapboxService: MapboxService
  ) {}

  ngOnInit(): void {
    this.loadCampgrounds();
  }

  ngAfterViewInit(): void {
    this.map = this.mapboxService.initializeMap('hero-map', [19.8189, 41.3275], 7);
    this.map.addControl(new mapboxgl.NavigationControl());
  
    const circleText = document.getElementById('circle-text');
    if (circleText) {
      new CircleType(circleText).radius(150);
      circleText.addEventListener('click', () => {
        const section = document.getElementById('campground-cards');
        section?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  
    this.loadCampgrounds();
  }
  

  loadCampgrounds(): void {
  this.campgroundService.getCampgrounds().subscribe({
    next: (response: any) => {
      if (response?.$values) {
        this.campgrounds = response.$values.map((campground: any) => {
          campground.images = campground.images?.$values || [];
          campground.geometry = campground.geometry || { coordinates: [] };
          campground.geometry.coordinates = (campground.latitude && campground.longitude)
            ? [campground.longitude, campground.latitude]
            : [0, 0];
          return campground;
        });

        this.filteredCampgrounds = [...this.campgrounds];
        this.addMarkersToMap();
      }
    },
    error: (err) => console.error('Error fetching campgrounds:', err),
  });
}

filterCampgrounds(): void {
  const query = this.searchQuery.trim().toLowerCase();

  if (!query) {
    this.filteredCampgrounds = [...this.campgrounds];
    return;
  }

  this.filteredCampgrounds = this.campgrounds.filter(camp =>
    camp.name?.toLowerCase().startsWith(query) ||
    camp.location?.toLowerCase().startsWith(query) ||
    camp.description?.toLowerCase().startsWith(query)
  );
}

  addMarkersToMap(): void {
    if (this.map && this.campgrounds.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
  
      this.campgrounds.forEach((campground, index) => {
        const [longitude, latitude] = campground.geometry.coordinates;
  

  
        if (longitude && latitude && latitude !== 0 && longitude !== 0) {
          new mapboxgl.Marker({ color: '#82a569' })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div style="color: black;">
                  <strong>${campground.name || 'Unknown Name'}</strong><br>
                  ${campground.location || 'No Location Provided'}<br>
                  Price: $${campground.price || 'N/A'}
                </div>`
              )
            )
            .addTo(this.map);
  
          bounds.extend([longitude, latitude]);
        } else {
          console.warn(`Invalid coordinates for campground: ${campground.name}`);
        }
      });
  
      if (!bounds.isEmpty()) {
        this.map.fitBounds(bounds, { padding: 50 });
      } else {
        console.warn('No valid markers to fit bounds');
      }
  
      this.map.resize();
    } else {
      console.warn('Map or campgrounds data is missing');
    }
  }
  
 
  getRandomImageUrl(): string {
    return `https://picsum.photos/400?random=${Math.random()}`;
  }

  setupCircleText(): void {
    const circleText = document.getElementById('circle-text');
    if (circleText) {
      new CircleType(circleText).radius(150);
      circleText.addEventListener('click', this.scrollToCards.bind(this));
    }
  }

  scrollToCards(): void {
    const section = document.getElementById('campground-cards');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
