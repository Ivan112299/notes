import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, mergeMap } from 'rxjs';
import { Board, BoardsService } from 'src/app/shared/services/boards.service';
import { Card, CardsService } from 'src/app/shared/services/cards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit {

  currentBoard: Board | undefined;
  cardFromBoard: Card[] = []

  constructor(
    private router: ActivatedRoute,
    private boardsService: BoardsService,
    private cardsService: CardsService,
  ) {}

  ngOnInit() {
    this.getCards()
  }

  getCards(){
    this.router.params
    .pipe(mergeMap((idFromRoute) => {
      const id = idFromRoute['id']
      return this.boardsService.getBoard(id)
    }))
    .pipe(mergeMap((board) => {
      this.currentBoard = board
      if (!board?.id) return from([]);
      return this.cardsService.getCardByBoardId(board.id)
    }))
    .subscribe(cards => {
      console.log('cards', cards)
      this.cardFromBoard = cards
    })
  }

  onDeletedCard(){
    this.getCards()
  }

}
