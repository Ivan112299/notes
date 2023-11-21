
import { Injectable } from '@angular/core';
import { action, observable } from 'mobx-angular';
import { makeAutoObservable } from 'mobx';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  currentUserId: string | undefined;


  constructor() {
    makeAutoObservable(this, {
      currentUserId: observable,
      setCurrentUserId: action
    })
    this.localStorageSync()
  }

  setCurrentUserId(userId: string) {
    this.currentUserId = userId
  }

  private localStorageSync() {
    const currentUserId = localStorage.getItem('fb-current-user')
    if (currentUserId) {
      if (!this.currentUserId) {
        this.setCurrentUserId(currentUserId)
      }
    }
  }
}

export type FbCurrenUserData = {
  displayName?: string
  email?: string
  expiresIn?: string
  idToken: string
  kind?: string
  localId: string
  refreshToken?: string
  registered?: boolean
}