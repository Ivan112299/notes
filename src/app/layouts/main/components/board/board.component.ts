import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { makeAutoObservable } from 'mobx';
import { BoardsStore } from 'src/app/store/boards.store';
import { CardsStore } from 'src/app/store/cards.store';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {

  currentBoardId = ''

  constructor(
    private router: ActivatedRoute,
    public cardsStore: CardsStore,
    public boardsStore: BoardsStore
  ) {
    makeAutoObservable(this);     // забыл зачем, разобраться
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.currentBoardId = params['id']
      this.cardsStore.setCardsFromCurrentBoard(this.currentBoardId)
    })
  }

  onClickAddCard(){
    console.log('onclickaddcard')
  }
}
