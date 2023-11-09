import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { take, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnDestroy {

  readonly destroyed$ = new Subject();

  nonAuth: Boolean | undefined;
  authorized: Boolean = false;

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) {}

  onClickAuth() {
    this.authorized = true
    this.authService.login(this.authForm.value)
    .pipe(take(1), takeUntil(this.destroyed$))
    .subscribe({
      next: () => {
        this.authForm.reset()
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
