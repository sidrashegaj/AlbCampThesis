import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { CampgroundService } from '../../services/campground.service';
import { Campground } from '../../models/campground.model';
import { FlashMessageService } from '../../services/flash-message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-campground',
  standalone: true,
  templateUrl: './edit-campground.component.html',
  styleUrls: ['./edit-campground.component.css'],
  imports: [CommonModule, FormsModule, RouterModule], 
})
export class EditCampgroundComponent implements OnInit {
  campgroundId!: number;
  campground: Campground = {
    title: '',
    location: '',
    price: 0,
    description: '',
    images: [],
    name: '',
    longitude: 0, 
    latitude: 0,  
    campgroundId: 0,
    author: {
      userId: 0,
      username: '',
    },
    geometry: {
      coordinates: [0, 0],
    },
  };
  deleteImages: string[] = [];
  selectedImages: File[] = [];
previewImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private campgroundService: CampgroundService,
    private router: Router,
    private flashMessageService: FlashMessageService
  ) {}

  ngOnInit(): void {
    this.campgroundId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCampgroundDetails();
  }

  loadCampgroundDetails(): void {
    this.campgroundService.getCampground(this.campgroundId).subscribe((campground) => {
      this.campground = campground;
  
      if (!Array.isArray(this.campground.images)) {
        this.campground.images = [];
      }
  
      this.deleteImages = this.campground.images.map((img) => img.filename);
    });
  }
  
  onImageSelected(event: any): void {
  this.selectedImages = Array.from(event.target.files);
  this.previewImages = [];

  for (const file of this.selectedImages) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImages.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

onSubmit(): void {
  const formData = new FormData();
  formData.append('name', this.campground.name);
  formData.append('location', this.campground.location);
  formData.append('price', this.campground.price.toString());
  formData.append('description', this.campground.description);
  formData.append('latitude', this.campground.latitude.toString());
  formData.append('longitude', this.campground.longitude.toString());

  if (this.selectedImages.length > 0) {
    for (const file of this.selectedImages) {
      formData.append('images', file);
    }
    } else {
    const existingFilenames = this.campground.images.map((img) => img.filename);
    formData.append('existingImages', JSON.stringify(existingFilenames));
  }


  this.campgroundService.updateCampground(this.campgroundId, formData).subscribe({
    next: () => {
      this.flashMessageService.showMessage('Campground updated successfully!', 5000);
      this.router.navigate(['/campgrounds', this.campgroundId]);
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error updating campground:', err);

      if (err.status === 400 && err.error && err.error.errors) {
        const errorMessages = Object.keys(err.error.errors)
          .map((key) => err.error.errors[key][0])
          .join('\n');

        this.flashMessageService.showMessage(errorMessages, 5000);
      } else {
        this.flashMessageService.showMessage('An unexpected error occurred. Please try again.', 5000);
      }
    },
  });
}
}
