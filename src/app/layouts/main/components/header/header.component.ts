import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Board, BoardsService } from 'src/app/shared/services/boards.service';
import { CreateBoardComponent } from '../create-board/create-board.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  boards: Board[] = []

  @ViewChild('menuCheckout')
  menuCheckout!: any

  @ViewChild('menuCreate') menuCreate: MatMenuTrigger | undefined;

  constructor(
    private auth: AuthService,
    private route: Router,
    private boardsServise: BoardsService,
    public dialog: MatDialog){
  }
  ngOnInit(): void {
    this.boardsServise.getBoards().subscribe((boards) => {
      this.boards = boards
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateBoardComponent, {restoreFocus: false});
  }

  onSelectedBoard(boardId: string | undefined){
    if(!boardId) return;
    this.route.navigate(['main', boardId])
  }

  onClickLogout(){
    this.auth.logout()
    this.route.navigate(['auth'])
  }
}
