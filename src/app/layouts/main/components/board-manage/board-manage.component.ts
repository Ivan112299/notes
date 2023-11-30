import { Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { BoardsStore } from './../../../../store/boards.store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Board } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'app-board-manage',
  templateUrl: './board-manage.component.html',
  styleUrls: ['./board-manage.component.less']
})
export class BoardManageComponent implements OnInit, OnDestroy {

  editBoardForm = this.fb.group({
    name: `${this.boardsStore.activeBoard?.name}`,
    statuses: [['']],
  })

  boardId = this.boardsStore.activeBoard?.id
  allStatuses = this.boardsStore.statuses.map(status => status.name)
  statusesFromBoard = this.boardsStore.activeBoard?.statuses
  creating = false
  destroyed$ = new Subject()

  constructor(
    public boardsStore: BoardsStore,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next('')
    this.destroyed$.complete()
  }

  ngOnInit(): void {
    const currentBoardStatuses = this.boardsStore.activeBoard?.statuses?.map(st => st.name)!
    this.editBoardForm.controls['statuses'].patchValue(currentBoardStatuses)
  }

  onClickSaveBoard() {
    let statusesForSave = this.editBoardForm.controls['statuses'].value?.map(statusName => {
      return this.boardsStore.statuses.find(status => status.name === statusName)
    })
    const boardDataForEdit = {
      ...this.boardsStore.activeBoard,
      name: this.editBoardForm.controls['name'].value,
      statuses: statusesForSave
    } as Board

    if (this.boardId) {
      this.boardsStore.updateBoard(boardDataForEdit, this.boardId)
    }
  }
}
