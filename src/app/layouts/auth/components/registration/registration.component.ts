import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less']
})
export class RegistrationComponent {

  nonAuth: Boolean | undefined;
  authorized: Boolean = false;

  signUpForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) {}

  onClickSighUp() {
    this.authorized = true
    this.authService.singUp(this.signUpForm.value).subscribe({
      next: () => {
        this.signUpForm.reset()
        this.router.navigate(['/main'])
        this.authorized = false
      },
      error: () => {
        this.authorized = false;
      }
    })
  }
}
