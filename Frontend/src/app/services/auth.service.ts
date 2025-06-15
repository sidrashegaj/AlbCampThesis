import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5259/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    const storedUser = isPlatformBrowser(platformId)
      ? localStorage.getItem('currentUser')
      : null;

    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map((response) => {
        if (response && response.token) {
          try {
            const decodedToken: any = jwtDecode(response.token);
            console.log('Decoded token:', decodedToken);

            const user = {
              userId: parseInt(decodedToken.UserId || decodedToken.userId || decodedToken.id, 10),
              username: decodedToken.sub,
              role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user',
              token: response.token,
            };

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            return user;
          } catch (error) {
            console.error('Invalid token:', error);
            throw new Error('Invalid token received from the server');
          }
        }
        throw new Error('Token not received');
      })
    );
  }


  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      map((response) => {
        if (response && response.token) {
          try {
            const decodedToken: any = jwtDecode(response.token);

            const user = {
              userId: decodedToken.UserId || decodedToken.userId || decodedToken.id,
              username: decodedToken.sub,
              role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user',
              token: response.token,
            };

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            return user;
          } catch (error) {
            console.error('Invalid token:', error);
            throw new Error('Invalid token received from the server');
          }
        }
        throw new Error('Token not received');
      })
    );
  }


  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    }
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
          console.warn('Token has expired');
          this.logout();
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }


  getToken(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.token : null;
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getUserId(): number {
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user) {
      console.log('Decoded User:', user); // Debug log
      return user.userId;
    }

    console.warn('No user found in localStorage');
    return 0;
  }


  getUsername(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.username : null;
  }
  getUserRole(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.role : null;
  }
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }


}
