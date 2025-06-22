import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']

})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  const token = localStorage.getItem('currentUser');
  const parsed = token ? JSON.parse(token) : null;

  this.http.get<any>(`${environment.apiUrl}/auth`, {
    headers: {
      Authorization: `Bearer ${parsed?.token}`
    }
  }).subscribe({
    next: (data) => {
      this.users = data.$values || [];
    },
    error: (err) => console.error('Failed to fetch users', err),
  });
}
goToAdminDashboard(): void {
  this.router.navigate(['/admin-dashboard']);
}

}
