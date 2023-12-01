import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardsStore } from 'src/app/store/boards.store';
import { CreateCardComponent } from '../create-card/create-card.component';
import { MatDialog } from '@angular/material/dialog';

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
    public boardsStore: BoardsStore,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.currentBoardId = params['id']
      this.boardsStore.setCardsFromCurrentBoard(this.currentBoardId)
    })
  }

  onClickAddCard(targetElement: Element) {
    const statusName = targetElement.textContent
    this.dialog.open(CreateCardComponent, {
      data: {
        boardId: this.currentBoardId,
        mode: 'add',
        statusName
      },
      restoreFocus: false
    });
  }
}
