import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reviews.component.html',
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
pendingDeleteId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private flashMessageService: FlashMessageService ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    this.http.get<any[]>('http://localhost:5259/api/reviews/all', { headers }).subscribe({
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

  this.http.delete(`http://localhost:5259/api/reviews/${id}`, { headers }).subscribe({
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

  this.http.delete(`http://localhost:5259/api/reviews/${id}`, { headers }).subscribe({
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
