import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Board, BoardsService } from 'src/app/shared/services/boards.service';
import { CreateBoardComponent } from '../create-board/create-board.component';
import { CreateCardComponent } from '../create-card/create-card.component';
import { BoardsStore } from 'src/app/store/boards.store';
import { toJS } from 'mobx';
import { BoardManageComponent } from '../board-manage/board-manage.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  boards: Board[] = [];
  activeBoardName: string = 'Доска не выбрана';

  @ViewChild('menuCheckout')
  menuCheckout!: any

  @ViewChild('menuCreate') menuCreate: MatMenuTrigger | undefined;

  constructor(
    private auth: AuthService,
    private route: Router,
    public dialog: MatDialog,
    public boardsStore: BoardsStore
    ) {}

  ngOnInit(): void {
    this.boardsStore.setBoards()
  }

  openDialogCreateBoard() {
    this.dialog.open(CreateBoardComponent, { restoreFocus: false });
  }

  openDialogCreateCard() {
    this.dialog.open(CreateCardComponent, { restoreFocus: false });
  }

  onSelectedBoard(boardId: string | undefined) {
    if (!boardId) return;
    this.route.navigate(['main', boardId])
    this.boardsStore.setActiveBoardId(boardId)
  }

  onClickLogout() {
    this.auth.logout()
    this.route.navigate(['auth'])
  }

  onClickSettingsBoard(){
    this.dialog.open(BoardManageComponent, { restoreFocus: false });
  }

  goToTestComponent() {
    this.route.navigate(['test'])
  }
}
