import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';
import { Board, BoardsService, Status } from 'src/app/shared/services/boards.service';
import { Card, CardsService } from 'src/app/shared/services/cards.service';
import { BoardsStore } from 'src/app/store/boards.store';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.less']
})
export class CreateCardComponent implements OnInit {


  readonly destroyed$ = new Subject();

  creating = false;
  boards: Board[] = [];
  statusesFromBoard: Status[] = []

  createCardForm = this.fb.group({
    name: '',
    content: '',
    boardId: '',
    statusId: ['']
  });

  constructor(
    private fb: FormBuilder,
    private cardService: CardsService,
    private boardsService: BoardsService,
    public boardsStore: BoardsStore,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit(): void {
    this.boards = this.boardsStore.boards
    if (this.dialogData) {
      const statusId = this.boardsStore.statuses.find(status => status.name === this.dialogData.statusName)?.id
      const boardId = this.dialogData.boardId
      if (boardId) {
        this.createCardForm.controls['boardId'].patchValue(boardId)

        this.boardsService.getStatusesFromBoard(this.createCardForm.controls['boardId'].value!)
          .pipe(take(1), takeUntil(this.destroyed$))
          .subscribe(statuses => {
            this.statusesFromBoard = statuses

            if (statusId) {
              this.createCardForm.controls['statusId'].patchValue(statusId)
            }
          })
      }
    }
  }

  onClickCreateCard() {
    this.creating = true;
    if (!this.createCardForm?.value) return;
    this.cardService.postCard(this.createCardForm.value as Card).subscribe({
      next: () => {
        this.creating = false;
        if (this.createCardForm.value.boardId) {
          this.boardsStore.setCardsFromCurrentBoard(this.createCardForm.value.boardId)
        }
        this.createCardForm.reset()
        this.dialogRef.close()
      },
      error: (err) => {
        this.creating = false;
        console.error('Ошибка создания карточки', err)      // TODO: заменить на алерт
      }
    })
  }

  changeBoard() {
    this.boardsService.getStatusesFromBoard(this.createCardForm.controls['boardId'].value!)
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(statuses => {
        this.statusesFromBoard = statuses
      })
    this.createCardForm.controls['statusId'].patchValue('')
  }

  ngOnDestroy(): void {
    this.destroyed$.next('')
    this.destroyed$.complete()
  }
}
