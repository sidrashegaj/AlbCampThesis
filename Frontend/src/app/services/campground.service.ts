import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Campground } from '../models/campground.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CampgroundService {
  private readonly apiUrl = `${environment.apiUrl}/campgrounds`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCampgrounds(location?: string): Observable<Campground[]> {
    let params = new HttpParams();
    if (location) {
      params = params.set('location', location);
    }
    return this.http.get<Campground[]>(this.apiUrl, { params });
  }
  getCampground(id: number): Observable<Campground> {
    return this.http.get<Campground>(`${this.apiUrl}/${id}`);
  }
 deleteCampground(id: string): Observable<void> {
  const token = this.authService.getToken();
  const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
    catchError(this.handleError)
  );
}

  
searchNearbyCampgrounds(lat: number, lng: number, radiusInKm: number = 50): Observable<Campground[]> {
  const url = `${this.apiUrl}/nearby?latitude=${lat}&longitude=${lng}&radiusInKm=${radiusInKm}`;
  return this.http.get<Campground[]>(url).pipe(
    catchError(this.handleError)
  );
}


  updateCampground(id: number, formData: FormData): Observable<Campground> {
    const headers = this.createAuthHeaders(); // Add authorization headers
    return this.http.put<Campground>(`${this.apiUrl}/${id}`, formData, { headers }).pipe(
      catchError(this.handleError) 
    );
  }

  
  addCampground(campgroundData: FormData): Observable<Campground> {
    const token = this.authService.getToken();
    console.log('Retrieved Token:', token);

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.post<Campground>(this.apiUrl, campgroundData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Retrieve the JWT token
    if (token) {
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }
    return new HttpHeaders(); // Return empty headers if no token
  }

 private handleError(error: HttpErrorResponse): Observable<never> {

  if (error.status === 400 && error.error) {
    if (error.error.errors) {
      return throwError(() => new Error(JSON.stringify(error.error.errors)));
    }

    if (typeof error.error === 'string') {
      return throwError(() => new Error(error.error));
    }
  }

  return throwError(() => new Error('Something bad happened; please try again later.'));
}

}