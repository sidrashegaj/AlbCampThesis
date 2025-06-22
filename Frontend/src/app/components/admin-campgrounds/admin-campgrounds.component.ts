import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampgroundService } from '../../services/campground.service';
import { Campground } from '../../models/campground.model';
import { Router } from '@angular/router';
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-admin-campgrounds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-campgrounds.component.html',
})
export class AdminCampgroundsComponent implements OnInit {
  campgrounds: Campground[] = [];
campgroundToDelete: number | null = null;

  constructor(
    private campgroundService: CampgroundService,
    private router: Router,
    private flashMessageService: FlashMessageService
  ) {}

  ngOnInit(): void {
    this.campgroundService.getCampgrounds().subscribe({
      next: (data) => {
        if ('$values' in data) {
          this.campgrounds = data['$values'] as Campground[];
        } else {
          this.campgrounds = data;
        }
      },
      error: (err) => {
        console.error('Failed to fetch campgrounds', err);
        this.flashMessageService.showMessage('Failed to load campgrounds', 3000);
      }
    });
  }

  editCampground(cg: Campground): void {
    this.router.navigate([`/campgrounds/${cg.campgroundId}/edit`]);
  }
confirmDelete(id: number): void {
  this.campgroundToDelete = id;
}
goToAdminDashboard(): void {
  this.router.navigate(['/admin-dashboard']);
}

 deleteCampground(id: number): void {
  this.campgroundService.deleteCampground(id.toString()).subscribe({
    next: () => {
      this.campgrounds = this.campgrounds.filter(cg => cg.campgroundId !== id);
      this.flashMessageService.showMessage('Campground deleted successfully!', 3000);
      this.campgroundToDelete = null;
    },
    error: (err) => {
      console.error('Failed to delete campground!', err);
      this.flashMessageService.showMessage('Failed to delete campground!', 3000);
      this.campgroundToDelete = null;
    }
  });
}

cancelDelete(): void {
  this.campgroundToDelete = null;
}

}
