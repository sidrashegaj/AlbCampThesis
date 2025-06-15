import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  username: string | null = null;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  viewUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  manageCampgrounds(): void {
    this.router.navigate(['/admin/campgrounds']);
  }

  manageReviews(): void {
    this.router.navigate(['/admin/reviews']);
  }
  viewBookings(): void {
    this.router.navigate(['/admin/bookings']);
  }

}
