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

// edit-campground.component.ts
onSubmit(): void {
  const formData = new FormData();
  formData.append('name', this.campground.name);
  formData.append('location', this.campground.location);
  formData.append('price', String(this.campground.price));
  formData.append('description', this.campground.description);
  formData.append('latitude', String(this.campground.latitude));
  formData.append('longitude', String(this.campground.longitude));

  if (this.selectedImages.length > 0) {
    for (const image of this.selectedImages) {
      formData.append('images', image); // match backend param name!
    }
  } else if (this.campground.images.length > 0) {
    const existing = this.campground.images.map(img => img.filename);
    formData.append('existingImages', JSON.stringify(existing)); // backend expects this
  }

  this.campgroundService.updateCampground(this.campgroundId, formData).subscribe({
    next: () => {
      this.flashMessageService.showMessage('Campground updated successfully!', 5000);
      this.router.navigate(['/campgrounds', this.campgroundId]);
    },
    error: (err: HttpErrorResponse) => {
      const msg =
        err.status === 400 && err.error?.errors
          ? Object.values(err.error.errors).flat().join('\n')
          : 'An unexpected error occurred.';
      this.flashMessageService.showMessage(msg, 5000);
    },
  });
}

}
