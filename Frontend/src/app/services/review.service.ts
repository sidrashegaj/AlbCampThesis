import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:5259/api/reviews';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); 
    if (!token) {
      throw new Error('User is not authenticated. Token is missing.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
  getReviewsForCampground(campgroundId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/campground/${campgroundId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addReview(campgroundId: number, review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/campground/${campgroundId}`, review, {
      headers: this.getAuthHeaders(), 
    });
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}