import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card, CardsService } from 'src/app/shared/services/cards.service';
import { BoardsStore } from 'src/app/store/boards.store';
import { CreateCardComponent } from '../create-card/create-card.component';

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

  constructor(
    private cardsService: CardsService,
    public dialog: MatDialog,
    private boardssStore: BoardsStore
  ) {}

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
