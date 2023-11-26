import { Injectable } from '@angular/core';
import { Card, CardsService } from '../shared/services/cards.service';
import { action, computed, observable } from 'mobx-angular';
import { makeAutoObservable, runInAction } from 'mobx';
import { take } from 'rxjs';
import { BoardsService } from '../shared/services/boards.service';

@Injectable({ providedIn: 'root' })
export class CardsStore {
  cardsFromCurrentBoard: Card[] = [];
  mappedCardFromCurrentBoard: { [status: string]: Card[] } = {};

  constructor(
    private cardsService: CardsService,
    private boardsService: BoardsService,
  ) {
    makeAutoObservable(this, {
      cardsFromCurrentBoard: observable,
      mappedCardFromCurrentBoard: observable,
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
    this.setMappedCardFromCurrentBoard(currentBoardId)
  }

  private setMappedCardFromCurrentBoard(boardId: string){
    this.boardsService.getStatusesFromBoard(boardId)
    .pipe(take(1))
    .subscribe(statuses => {
      this.mappedCardFromCurrentBoard = statuses.reduce((mappedCards, status) => {
        const mappedSt = {
          ...mappedCards,
          [status.name]: this.cardsFromCurrentBoard.filter(card => card.statusId === status.id)
        }
        return mappedSt
      }, {})
    })
  }

  get countCards() {
    return this.cardsFromCurrentBoard.length
  }
}