import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessageService } from '../../services/flash-message.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class BookingComponent {


  campgroundId: number;
  nights: number = 1;
  phoneNumber: string = '';

  constructor( private route: ActivatedRoute, private router: Router, private flashMessageService: FlashMessageService, private authService: AuthService, private http: HttpClient) {
    this.campgroundId = Number(this.route.snapshot.paramMap.get('id'));
  }

  goBack() {
    this.router.navigate(['/campgrounds', this.campgroundId]);
  }

  validatePhoneNumber(): boolean {
    const pattern = /^[0-9]{8,15}$/; 
    return pattern.test(this.phoneNumber);
  }

 submitBooking() {
  const userId = this.authService.getUserId();
  if (!userId || userId === 0) {
    this.flashMessageService.showMessage('You must be logged in to book.', 4000);
    this.router.navigate(['/login']);
    return;
  }

  const booking = {
    campgroundId: this.campgroundId,
    userId: userId,
    nights: this.nights,
    phoneNumber: this.phoneNumber
  };

  this.http.post('http://localhost:5259/api/booking', booking).subscribe({
    next: () => {
      this.flashMessageService.showMessage('Booking successful! 🎉', 4000);
      this.router.navigate(['/campgrounds', this.campgroundId]); 
    },
    error: (err) => {
      console.error('Booking error:', err);
      this.flashMessageService.showMessage('Failed to book. Please try again.', 4000);
    }
  });
}

getUserId(): number {
  const user = JSON.parse(localStorage.getItem('user')!);
  return user?.userId ?? 0;
}

}
