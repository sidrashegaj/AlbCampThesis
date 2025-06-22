import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./login.component.css'], 

})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router, private flashMessageService: FlashMessageService) {}

  
  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.router.navigate(['/campgrounds']); 
      },
     error: (err) => {
  console.error('Login error', err);

  let errorMessage = 'Login failed!';

  if (err.error && typeof err.error === 'string') {
    if (err.error.toLowerCase().includes('user')) {
      errorMessage = 'User not found. Please check your username.';
    } else if (err.error.toLowerCase().includes('password')) {
      errorMessage = 'Incorrect password. Please try again.';
    } else {
      errorMessage = err.error;
    }
  } else if (err.error && err.error.message) {
    errorMessage = err.error.message;
  }

  this.error = errorMessage;
  this.flashMessageService.showMessage(errorMessage, 5000);
}

    });
  }
  
}