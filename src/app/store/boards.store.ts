import { BoardsService, Status } from './../shared/services/boards.service';
import { Injectable } from '@angular/core';
import { Board } from '../shared/services/boards.service';
import { action, observable } from 'mobx-angular';
import { computed, makeAutoObservable, runInAction } from 'mobx';
import { take } from 'rxjs';
import { Card, CardsService } from '../shared/services/cards.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BoardsStore {
  activeBoardId = '';

  activeBoard: Board = {} as Board;
  boards: Board[] = [];
  statuses: Status[] = [];

  cardsFromCurrentBoard: Card[] = [];

  constructor(
    private boardsService: BoardsService,
    private cardsService: CardsService,
    private route: Router
  ) {
    makeAutoObservable(this, {
      boards: observable,
      statuses: observable,
      activeBoardId: observable,
      cardsFromCurrentBoard: observable,
      activeBoard: observable,
      setBoards: action,
      setActiveBoard: action,
      updateBoard: action,
      setActiveBoardId: action,
      setStatuses: action,
      setCardsFromCurrentBoard: action,
      countCards: computed,
      statusesFromCurrentBoard: computed,
      mappedCardFromCurrentBoard: computed,
      statusesNameFromCurrentBoard: computed,
    });
    this.setStatuses();
    this.localStorageSync();
  }

  setActiveBoardId(id: string) {
    this.activeBoardId = id;
    localStorage.setItem('activeBoardId', JSON.stringify(id));
    this.setActiveBoard(id);
    this.setCardsFromCurrentBoard(id);
  }

  setActiveBoard(boardId: string) {
    console.count('setActiveBoard');
    if (boardId) {
      this.boardsService
        .getBoard(boardId)
        .pipe(take(1))
        .subscribe((board) => {
          runInAction(() => {
            this.activeBoard = board;
            console.log('this.activeBoard', this.activeBoard);
          });
        });
    }
  }

  setBoards() {
    this.boardsService
      .getBoards()
      .pipe(take(1))
      .subscribe((boards) => {
        runInAction(() => {
          this.boards = boards;
        });
      });
  }

  setStatuses() {
    this.boardsService
      .getStatuses()
      .pipe(take(1))
      .subscribe((statuses) => {
        runInAction(() => {
          this.statuses = statuses;
        });
      });
  }

  updateBoard(board: Board, id: string) {
    this.boardsService
      .putBoard(board, id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          let editedBoardIndex = this.boards.findIndex(
            (board) => board.id === id
          );
          this.boards[editedBoardIndex] = board;
          runInAction(() => {
            this.activeBoard = board;
          });
          // this.setStatuses()                      // хоть статусы не обновляем но в ближайшее время надо добавить
          // console.log('доска обновлена')        // TODO сообщение пользователю
        },
        error: (err) => console.error(err), // TODO сообщение пользователю
      });
  }

  setCardsFromCurrentBoard(currentBoardId?: string) {
    if (!currentBoardId) return;
    this.cardsService
      .getCardByBoardId(currentBoardId)
      .pipe(take(1))
      .subscribe((cards) => {
        runInAction(() => {
          this.cardsFromCurrentBoard = cards;
        });
      });
  }

  get mappedCardFromCurrentBoard() {
    if (this.activeBoard?.statuses) {
      const mappedCards: { [status: string]: Card[] } =
        this.activeBoard.statuses.reduce((mappedCards, status) => {
          const mappedSt = {
            ...mappedCards,
            [status.name]: this.cardsFromCurrentBoard.filter(
              (card) => card.statusId === status.id
            ),
          };
          return mappedSt;
        }, {});
      return mappedCards;
    } else {
      return {} as { [status: string]: Card[] };
    }
  }

  get statusesFromCurrentBoard() {
    if (this.activeBoard?.statuses) {
      return this.activeBoard.statuses;
    } else {
      return [];
    }
  }

  get statusesNameFromCurrentBoard() {
    return this.statusesFromCurrentBoard.map((st) => st.name);
  }

  get countCards() {
    return this.cardsFromCurrentBoard.length;
  }

  private localStorageSync() {
    const currentBoardIdFromLocalStorage =
      localStorage.getItem('activeBoardId');
    if (currentBoardIdFromLocalStorage) {
      const boardId = JSON.parse(currentBoardIdFromLocalStorage);
      this.route.navigate(['main', boardId]);
      this.setActiveBoard(boardId);
    }
  }
}
