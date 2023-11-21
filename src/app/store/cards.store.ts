import { Injectable } from '@angular/core';
import { Card, CardsService } from '../shared/services/cards.service';
import { action, computed, observable } from 'mobx-angular';
import { makeAutoObservable, runInAction } from 'mobx';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardsStore {
  cardsFromCurrentBoard: Card[] = [];

  constructor(
    private cardsService: CardsService
  ) {
    makeAutoObservable(this, {
      cardsFromCurrentBoard: observable,
      setCardsFromCurrentBoard: action,
      countCards: computed
    })
  }

  setCardsFromCurrentBoard(currentBoardId?: string) {
    if (!currentBoardId) return;
    runInAction(() => {               // TODO устранить ошибку в консоли
      this.cardsService.getCardByBoardId(currentBoardId)
        .pipe(take(1))
        .subscribe(cards => {
          this.cardsFromCurrentBoard = cards
        })
    })
  }

  get countCards() {
    return this.cardsFromCurrentBoard.length
  }
}