import { TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card, CardsService } from 'src/app/shared/services/cards.service';
import { BoardsStore } from 'src/app/store/boards.store';
import { CreateCardComponent } from '../create-card/create-card.component';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent {

  @Input()
  card: Card | undefined

  @Output()
  deletedCard: EventEmitter<void> = new EventEmitter()

  valueCustomBs: number | undefined;
  valueCustomSub: string | undefined;

  constructor(
    private cardsService: CardsService,
    public dialog: MatDialog,
    private boardssStore: BoardsStore,
    public testService: TestService
  ) {}

  subscribeOnBS(){
    this.testService.customBS.subscribe(value => {
      this.valueCustomBs = value;
    })
  }

  subscribeOnSub(){
    this.testService.customSub.subscribe(value => {
      this.valueCustomSub = value;
    })
  }

  onClickEditCard(cardId: string | undefined) {
    if (!cardId) return;

    this.dialog.open(CreateCardComponent, {
      data: {
        cardData: this.card,
        mode: 'edit'
      },
      restoreFocus: false
    });
  }

  onClickDeleteCard(cardId: string | undefined) {
    if (!cardId) return;

    this.cardsService.deleteCardById(cardId).subscribe({
      next: () => {
        this.deletedCard.emit()
        this.boardssStore.setCardsFromCurrentBoard(this.card?.boardId)
      },
      error: (error) => {
        console.error('Ошибка удаления карточки', error)
      }
    })
  }
}
