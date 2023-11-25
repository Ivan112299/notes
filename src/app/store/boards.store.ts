import { BoardsService, Status } from './../shared/services/boards.service';
import { Injectable } from '@angular/core';
import { Board } from '../shared/services/boards.service';
import { action, observable } from 'mobx-angular';
import { makeAutoObservable } from 'mobx';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoardsStore {
  activeBoard: Board | undefined;
  boards: Board[] = []
  statuses: Status[] = []

  constructor(
    private boardsService: BoardsService
  ) {
    makeAutoObservable(this, {
      boards: observable,
      statuses: observable,
      activeBoard: observable,
      setBoards: action,
      setActiveBoard: action,
      updateBoard: action

    })
    this.localStorageSync()
    this.setStatuses()
  }

  setActiveBoard(id: string) {
    this.boardsService.getBoard(id)
      .pipe(take(1))
      .subscribe(board => {
        this.activeBoard = board
        localStorage.setItem('activeBoardId', JSON.stringify(board.id));
      })
  }

  setBoards() {
    this.boardsService.getBoards()
      .pipe(take(1))
      .subscribe(boards => {
        this.boards = boards
      })
  }

  setStatuses() {
    this.boardsService.getStatuses()
      .pipe(take(1))
      .subscribe(statuses => {
        this.statuses = statuses
      })
  }

  updateBoard(board: Board, id: string) {
    this.boardsService.putBoard(board, id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.setBoards() 
          this.setActiveBoard(id) 
          this.setStatuses()                      // хоть статусы не обновляем но в ближайшее время надо добавить
          console.log('доска обновлена')        // TODO сообщение пользователю
        },
        error: (err => console.error(err))      // TODO сообщение пользователю
      })
  }

  private localStorageSync() {
    const currentBoardIdFromLocalStorage = localStorage.getItem('activeBoardId')
    if (currentBoardIdFromLocalStorage) {
      const boardId = JSON.parse(currentBoardIdFromLocalStorage)
      if (!this.activeBoard) {
        this.setActiveBoard(boardId)
      }
    }
  }
}