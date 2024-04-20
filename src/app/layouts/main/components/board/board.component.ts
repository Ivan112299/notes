import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardsStore } from 'src/app/store/boards.store';
import { CreateCardComponent } from '../create-card/create-card.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Card, CardsService } from 'src/app/shared/services/cards.service';
import { take, takeUntil } from 'rxjs';
import { CustomBeahaviorSubject } from 'src/app/shared/services/custom-behavior-subject';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less'],

})
export class BoardComponent implements OnInit, AfterViewInit {


  currentValueBehSub: number | undefined;
  currentValueSub: string | undefined;
  currentValueReplaySub: string | undefined;

  currentBoardId = ''
  statusesNameFromCurrentBoard: string[] = []

  constructor(
    private router: ActivatedRoute,
    public boardsStore: BoardsStore,
    public dialog: MatDialog,
    private cardsService: CardsService,
    public testServuce: TestService
  ) {}

  completeBS() {
    this.testServuce.customBS.complete()
  }

  getValueBS() {
    this.testServuce.customBS.subscribe(value => {
      this.currentValueBehSub = value
    })
  }

  setValueBS() {
    this.testServuce.customBS.next(Math.floor(Math.random() * 100))
  }

  completeS() {
    this.testServuce.customSub.complete()
  }

  getValueS() {
    this.testServuce.customSub.subscribe(value => {
      this.currentValueSub = value
    })
  }

  setValueS() {
    this.testServuce.customSub.next(String(Math.floor(Math.random() * 100)))
  }

  completeRS() {
    this.testServuce.customReplaySub.complete()
  }

  getValueRS() {
    this.testServuce.customReplaySub.subscribe(value => {
      console.log('customReplaySub', value)
      this.currentValueReplaySub = value
    })
  }

  setValueRS() {
    this.testServuce.customReplaySub.next(String(Math.floor(Math.random() * 100)))
  }

  ngAfterViewInit(): void {
    this.statusesNameFromCurrentBoard = this.boardsStore.statusesFromCurrentBoard.map(st => st.name)
  }

  drop(event: CdkDragDrop<Card[]>) {
    console.log('event', event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const cardId = event.item.element.nativeElement.id
      const newStatusId = event.container.element.nativeElement.id
      const card = this.boardsStore.cardsFromCurrentBoard.find(card => card.id === cardId)

      this.cardsService.putCard({ ...card, statusId: newStatusId } as Card, cardId)
        .pipe(take(1))
        .subscribe(() => {
          console.log('Статус карточки изменен')        //TODO добавить алерты
        })
    }
  }

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
