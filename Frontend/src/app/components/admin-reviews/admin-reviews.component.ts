import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FlashMessageService } from '../../services/flash-message.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-reviews.component.html',
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
pendingDeleteId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private flashMessageService: FlashMessageService, private router: Router ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    this.http.get<any[]>(`${environment.apiUrl}/reviews/all`, { headers }).subscribe({
      next: (data) => {
        if ('$values' in data) {
          this.reviews = data['$values'] as any[];
        } else {
          this.reviews = data;
        }
      },
      error: (err) => console.error('Failed to fetch reviews', err),
    });
  }
  setPendingDelete(id: number): void {
  this.pendingDeleteId = id;
}

cancelDelete(): void {
  this.pendingDeleteId = null;
}

confirmDelete(id: number): void {
  const token = this.authService.getToken();
  if (!token) {
    this.flashMessageService.showMessage('You are not authorized to delete this review.', 3000);
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.delete(`${environment.apiUrl}/reviews/${id}`, { headers }).subscribe({
    next: () => {
      this.reviews = this.reviews.filter(r => r.reviewId !== id);
      this.flashMessageService.showMessage('Review deleted successfully!', 3000);
      this.pendingDeleteId = null;
    },
    error: (err) => {
      console.error('Failed to delete review', err);
      const msg = err.status === 403
        ? 'You are not authorized to delete this review.'
        : 'Failed to delete review.';
      this.flashMessageService.showMessage(msg, 3000);
      this.pendingDeleteId = null;
    }
  });
}
goToAdminDashboard(): void {
  this.router.navigate(['/admin-dashboard']);
}

 deleteReview(id: number): void {
  const token = this.authService.getToken();

  if (!token) {
    this.flashMessageService.showMessage('You are not authorized to delete this review.', 3000);
    return;
  }

  if (!confirm('Are you sure you want to delete this review?')) {
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.delete(`${environment.apiUrl}/reviews/${id}`, { headers }).subscribe({
    next: () => {
      this.reviews = this.reviews.filter(r => r.reviewId !== id);
      this.flashMessageService.showMessage('Review deleted successfully!', 3000);
    },
    error: (err) => {
      console.error('Failed to delete review', err);
      const msg = err.status === 403
        ? 'You are not authorized to delete this review.'
        : 'Failed to delete review.';
      this.flashMessageService.showMessage(msg, 3000);
    }
  });
}


}
