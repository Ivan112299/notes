import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs';
import { BoardsService } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit {

  constructor(
    private router: ActivatedRoute,
    private boardsService: BoardsService
  ) {}

  ngOnInit(){
    this.router.params
    .pipe(mergeMap((idFromRoute) => {
      const id = idFromRoute['id']
      return  this.boardsService.getBoard(id)
    }))
    .subscribe(board => {
      console.log('board', board)
    })
  }

}
