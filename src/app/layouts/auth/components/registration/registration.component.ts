import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less']
})
export class RegistrationComponent {

  readonly destroyed$ = new Subject()

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
    console.log('this.signUpForm', this.signUpForm)
    this.authorized = true
    this.authService.singUp(this.signUpForm.value)
    .pipe(take(1), takeUntil(this.destroyed$))
    .subscribe({
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

  ngOnDestroy(): void {
    this.destroyed$.next('')
    this.destroyed$.complete()
  }
}
