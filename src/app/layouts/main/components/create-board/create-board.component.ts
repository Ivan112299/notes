import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { Board, BoardsService } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.less']
})
export class CreateBoardComponent implements OnDestroy {

  readonly destroyed$ = new Subject();

  creating = false;

  createBoardForm = this.fb.group({
    name: ''
  });

  constructor(
    private boardsService: BoardsService,
    private fb: FormBuilder
  ){

  }

  onClickCreateBoard(){
    this.creating = true;
    if(!this.createBoardForm?.value) return;
    this.boardsService.postBoard(this.createBoardForm.value as Board).subscribe({
      next: () => {
        this.createBoardForm.reset()
        this.creating = false;
      },
      error: (err) => {
        this.creating = false;
        console.error('Ошибка создания доски', err)
      }
    })
  }
  ngOnDestroy(): void {
    this.destroyed$.next('')
    this.destroyed$.complete()
  }

}