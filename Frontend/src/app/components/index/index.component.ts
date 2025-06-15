import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CampgroundService } from '../../services/campground.service';
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [CommonModule, FormsModule]
})
export class IndexComponent {
  searchQuery: string = '';
  campgrounds: any[] = [];
  noResultsFound: boolean = false;
  isNearbySearch: boolean = false;
  randomImageUrl: string = 'assets/default-image.jpg'; 


  constructor(private campgroundService: CampgroundService, private router: Router, private flashMessageService: FlashMessageService) { }
  findNearbyCampgrounds(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`User's location: Latitude ${latitude}, Longitude ${longitude}`);
  
        this.campgroundService.searchNearbyCampgrounds(latitude, longitude).subscribe({
          next: (response: any) => {
            if (response && response.$values) {
              this.campgrounds = response.$values.map((campground: any) => {
  
                campground.images = campground.images?.$values || [];
  
                if (!campground.geometry) {
                  campground.geometry = { coordinates: [] };
                }
  
                if (campground.latitude && campground.longitude) {
                  campground.geometry.coordinates = [campground.longitude, campground.latitude];
                } else {
                  campground.geometry.coordinates = [0, 0]; 
                }
  
                return campground;
              });
            } else {
              this.campgrounds = [];
            }
  
            this.isNearbySearch = true;
            this.noResultsFound = this.campgrounds.length === 0;
  
            setTimeout(() => {
              const section = document.getElementById('nearby-campgrounds');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          },
          error: (err) => {
            console.error('Error fetching nearby campgrounds:', err);
            this.isNearbySearch = true;
            this.noResultsFound = true;
          },
        });
      },
      (error) => {
        console.error('Error retrieving location:', error);
        alert('Unable to retrieve your location.');
      }
    );
  }
  
  getRandomImageUrl(): string {
    return `https://picsum.photos/400?random=${Math.random()}`;
  }
  
  navigateToCampgrounds(campgroundId: number): void {
    this.router.navigate(['/campgrounds', campgroundId]);
  }
  navigateToAllCampgrounds(): void {
    this.router.navigate(['/campgrounds']);
  }
  
}
