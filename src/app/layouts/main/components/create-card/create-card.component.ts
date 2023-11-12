import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { Board, BoardsService } from 'src/app/shared/services/boards.service';
import { Card, CardsService } from 'src/app/shared/services/cards.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.less']
})
export class CreateCardComponent implements OnInit {

  readonly destroyed$ = new Subject();

  creating = false;
  boards: Board[] = [];

  createCardForm = this.fb.group({
    name: '',
    content: '',
    boardId: ''
  });

  constructor(
    private fb: FormBuilder,
    private cardService: CardsService,
    private boardsService: BoardsService,
  ){}

  ngOnInit(): void {
    this.boardsService.getBoards()
    .pipe(take(1), takeUntil(this.destroyed$))
    .subscribe({
      next: (boards) => {
        this.boards = boards
      },
      error: () => {
        console.error('Ошиюка получения списка активных досок')
      }
    })
  }

  onClickCreateCard(){
    this.creating = true;
    if(!this.createCardForm?.value) return;
    this.cardService.postCard(this.createCardForm.value as Card).subscribe({
      next: () => {
        this.createCardForm.reset()
        this.creating = false;
      },
      error: (err) => {
        this.creating = false;
        console.error('Ошибка создания карточки', err)      // TODO: заменить на алерт
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyed$.next('')
    this.destroyed$.complete()
  }


}
