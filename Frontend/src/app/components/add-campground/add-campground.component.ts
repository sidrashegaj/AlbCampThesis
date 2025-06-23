import { Component, OnInit, EventEmitter, Output, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CampgroundService } from '../../services/campground.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FlashMessageService } from '../../services/flash-message.service';
import { AuthService } from '../../services/auth.service';
import { Campground } from '../../models/campground.model';
import * as mapboxgl from 'mapbox-gl';
import { MapboxService } from '../../services/mapbox.service';

@Component({
  selector: 'app-add-campground',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-campground.component.html',
  styleUrls: ['./add-campground.component.css'],
})
export class AddCampgroundComponent implements OnInit {
  @Output() newCampgroundAdded = new EventEmitter<Campground>();
  campgroundForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private mapboxService: MapboxService,
    private campgroundService: CampgroundService,
    private router: Router,
    private authService: AuthService,
    private flashMessageService: FlashMessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.campgroundForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      images: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const map = this.mapboxService.initializeMap('map', [19.8189, 41.3275], 6);

      let marker: mapboxgl.Marker;

      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;

        this.campgroundForm.patchValue({
          latitude: lat,
          longitude: lng,
        });

        if (marker) marker.remove();

        marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
      });
    }


  }

  canAddOrDelete(): boolean {
    return this.authService.isAuthenticated();
  }

  onFileSelected(event: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files) {
        this.selectedFiles = Array.from(fileInput.files);
      }
    }
  }
  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.campgroundForm.value.name);
    formData.append('location', this.campgroundForm.value.location);
    formData.append('latitude', this.campgroundForm.value.latitude.toString());
    formData.append('longitude', this.campgroundForm.value.longitude.toString());
    formData.append('price', this.campgroundForm.value.price.toString());
    formData.append('description', this.campgroundForm.value.description);

    this.selectedFiles.forEach((file) => {
      formData.append('images', file, file.name);
    });

    this.campgroundService.addCampground(formData).subscribe({
      next: (res) => {
        this.flashMessageService.showMessage('Campground added successfully!', 5000);
        this.newCampgroundAdded.emit(res);
        this.router.navigate([`/campgrounds/${res.campgroundId}`]);
      },
      error: (err) => {
        console.error('Error adding campground', err);
        this.flashMessageService.showMessage('Failed to add campground!', 5000);
      },
    });
  }


}
