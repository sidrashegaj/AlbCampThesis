import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

 fetchBookings() {
  this.http.get<any>(`${environment.apiUrl}/booking`)
    .subscribe({
      next: (res) => {
        this.bookings = res?.$values ?? []; 
      },
      error: (err) => console.error('Failed to load bookings:', err)
    });
}
goToAdminDashboard(): void {
  this.router.navigate(['/admin-dashboard']);
}

changeStatus(id: number, event: Event) {
  const target = event.target as HTMLSelectElement;
  const newStatus = target.value;

  const booking = this.bookings.find(b => b.bookingId === id);
  if (booking) {
    booking.status = newStatus;
  }

  this.http.put(`${environment.apiUrl}/booking/${id}/status`, { status: newStatus }, {
    headers: { 'Content-Type': 'application/json' }
  }).subscribe({
    next: () => console.log('Status saved'),
    error: (err) => console.error('Failed to update status', err)
  });

}
}
