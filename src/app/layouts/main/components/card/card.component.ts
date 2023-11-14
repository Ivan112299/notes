import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, CardsService } from 'src/app/shared/services/cards.service';

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

  constructor(private cardsService: CardsService){}

  onClickDeleteCard(cardId: string | undefined){
    if(!cardId) return;

    this.cardsService.deleteCardById(cardId).subscribe({
      next: () => {
        this.deletedCard.emit()
      },
      error: (error) => {
        console.error('Ошибка удаления карточки', error)
      }
    })


  }

}
