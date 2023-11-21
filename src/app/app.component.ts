import { BoardsService } from 'src/app/shared/services/boards.service';
import { Component } from '@angular/core';
import { BoardsStore } from './store/boards.store';
import { CardsStore } from './store/cards.store';
import { injectStores } from '@mobx-devtools/tools';
import { CardsService } from './shared/services/cards.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(
    private boardsService: BoardsService,
    private cardsService: CardsService
  ) {
    //  Для отладки TODO удалить
    // const bardsStore = new BoardsStore(this.boardsService);
    // const cardsStore = new CardsStore(this.cardsService);

    // injectStores({
    //   bardsStore,
    //   cardsStore
    // });
  }
  title = 'notes';
}
