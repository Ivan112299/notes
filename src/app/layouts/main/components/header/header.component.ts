import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BoardsService } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  boardsNames: string[] = []

  @ViewChild('menuCheckout')
  menuCheckout!: any

  constructor(
    private auth: AuthService,
    private route: Router,
    private boardsServise: BoardsService){
  }
  ngOnInit(): void {
    this.boardsServise.getBoards().subscribe((boards) => {
      this.boardsNames = boards.map(board => board.name)

    })
  }

  onClickLogout(){
    this.auth.logout()
    this.route.navigate(['auth'])
  }
}
