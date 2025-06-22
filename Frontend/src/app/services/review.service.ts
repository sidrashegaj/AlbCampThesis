import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

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
  const token = this.authService.getToken();

  const options = token
    ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    : {}; // ✅ No headers at all for guests

  return this.http.get<Review[]>(`${this.apiUrl}/campground/${campgroundId}`, options);
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