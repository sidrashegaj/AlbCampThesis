import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']

})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
  const token = localStorage.getItem('currentUser');
  const parsed = token ? JSON.parse(token) : null;

  this.http.get<any>('http://localhost:5259/api/auth', {
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
}
