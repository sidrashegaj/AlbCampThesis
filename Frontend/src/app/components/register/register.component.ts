import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; //  for ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessageService } from '../../services/flash-message.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router, private flashMessageService: FlashMessageService) { }

  onSubmit() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (user) => {
        this.flashMessageService.showMessage('Welcome :)', 5000);
        this.router.navigate(['/campgrounds']);

      },
      error: (err) => {
        console.error('Registration error', err);

        let errorMessage = 'Registration failed!';
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }

        this.flashMessageService.showMessage(errorMessage, 5000);
      }


    });
  }

}