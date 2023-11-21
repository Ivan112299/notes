import { BoardsService } from './../shared/services/boards.service';
import { Injectable } from '@angular/core';
import { Board } from '../shared/services/boards.service';
import { action, computed, observable } from 'mobx-angular';
import { makeAutoObservable, runInAction } from 'mobx';
import { pipe, take, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoardsStore {
  activeBoard: Board | undefined;
  boards: Board[] = []

  constructor(
    private boardsService: BoardsService
  ) {
    makeAutoObservable(this, {
      boards: observable,
      activeBoard: observable,
      setBoards: action,
      // setActiveBoard: action,

    })
    this.localStorageSync()
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