import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

 fetchBookings() {
  this.http.get<any>('http://localhost:5259/api/booking')
    .subscribe({
      next: (res) => {
        this.bookings = res?.$values ?? []; 
      },
      error: (err) => console.error('Failed to load bookings:', err)
    });
}
changeStatus(id: number, event: Event) {
  const target = event.target as HTMLSelectElement;
  const newStatus = target.value;

  // Update local UI immediately
  const booking = this.bookings.find(b => b.bookingId === id);
  if (booking) {
    booking.status = newStatus;
  }

  // Send updated status to backend
  this.http.put(`http://localhost:5259/api/booking/${id}/status`, { status: newStatus }, {
    headers: { 'Content-Type': 'application/json' }
  }).subscribe({
    next: () => console.log('Status saved'),
    error: (err) => console.error('Failed to update status', err)
  });

}
}
