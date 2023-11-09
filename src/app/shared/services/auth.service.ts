import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, ObservableInput, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from '../../layouts/auth/models/user';

@Injectable()
export class AuthService {

  user: User | undefined;
  authEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'
  sighupEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp'
  apiKey = 'AIzaSyCDwLAOUJGo-FR_Tgv-HLeHO_Atm43OqB0'
  public error$: Subject<string> = new Subject<string>()

  get token(): string | null {
    if (!localStorage.getItem('fb-token-exp')) {
      return null
    }
    let dateOfEndToken = new Date(localStorage.getItem('fb-token-exp')!.toString())
    if (dateOfEndToken < new Date()) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  constructor(
    private http: HttpClient
    ) {}

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`${this.authEndpoint}?key=${this.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))    // обрабатываем ошибку (передаем respons в функцию) (байндим this  - изучить это)
      )
  }

  singUp(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`${this.sighupEndpoint}?key=${this.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))    // обрабатываем ошибку (передаем respons в функцию) (байндим this  - изучить это)
      )
  }

  logout() {
    this.setToken(null)
  }

  isAuth() {
    console.log('Авторизован? - ', !!this.token)
    return !!this.token
  }

  private handleError(error: HttpErrorResponse | any): ObservableInput<any> {
    const { message } = error.error.error;
    console.error('ошибка из handle error', message)

    switch (message.toString()) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Пользователя с таким email не существует')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
    }
    return throwError(() => new Error())
  }

  private setToken(response: any | null) {
    if (response) {
      // получаем дату когда протухнет токен
      const expDate = new Date(new Date().getTime() + Number(response.expiresIn) * 1000)

      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }

  }
}
