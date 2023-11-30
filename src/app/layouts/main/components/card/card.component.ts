import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, CardsService } from 'src/app/shared/services/cards.service';
import { BoardsStore } from 'src/app/store/boards.store';

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
    private boardssStore: BoardsStore){}

  onClickDeleteCard(cardId: string | undefined){
    if(!cardId) return;

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
