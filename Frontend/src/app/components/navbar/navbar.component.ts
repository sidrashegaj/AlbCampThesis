import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  flashMessage: string | null = null;
  username: string | null = null;

  constructor(
    private flashMessageService: FlashMessageService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.flashMessageService.currentMessage.subscribe((message) => {
      this.flashMessage = message;
    });

    if (this.authService.isAuthenticated()) {
      this.username = this.authService.getUsername();
    }
  }

  onNewCampgroundClick() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/campgrounds/new']);
    } else {
      if (!this.flashMessage) {
        this.flashMessageService.showMessage('You need to be logged in to add a new campground!', 5000);
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/campgrounds']);
  }

  onLogo(): void {
    this.router.navigate(['/']);
  }

  onAll(): void {
    this.router.navigate(['/campgrounds']);
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onRegisterClick(): void {
    this.router.navigate(['/register']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
