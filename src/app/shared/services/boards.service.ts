import { AuthStore } from 'src/app/store/auth.store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  map,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoardsService {
    // user: User | undefined;
    // authEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'
    // sighupEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp'
    // apiKey = 'AIzaSyCDwLAOUJGo-FR_Tgv-HLeHO_Atm43OqB0'
    // public error$: Subject<string> = new Subject<string>()

  fbDbUrl = 'https://notes-bc21d-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient, private authStore: AuthStore) {}

  getBoards(): Observable<Board[]> {
    return this.http.get(`${this.fbDbUrl}/boards.json`).pipe(
      map((boards: any) => {
        const boardsData = Object.keys(boards);
        const allBoards = boardsData.map((id) => {
          const currentBoard = boards[id as keyof typeof boards] as Board;
          return {
            id,
            name: currentBoard.name,
            owner: currentBoard.owner,
            statuses: currentBoard.statuses,
          };
        });
        // возвращаем только доски текущего залогиненного юзера
        return allBoards.filter(board => board.owner === this.authStore.currentUserId)
      })
    );
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get(`${this.fbDbUrl}/boards/${id}.json`).pipe(
      map(board => ({ ...board, id: id }))
    ) as Observable<Board>
  }

  postBoard(board: Board): Observable<fbResponseOfBoards> {
    return this.http.post(`${this.fbDbUrl}/boards.json`, board) as Observable<fbResponseOfBoards>
  }

  putBoard(board: Board, id: string): Observable<fbResponseOfBoards> {
    return this.http.put(`${this.fbDbUrl}/boards/${id}.json`, board) as Observable<fbResponseOfBoards>
  }

  getStatuses(): Observable<Status[]> {
    return this.http.get(`${this.fbDbUrl}/statuses.json`).pipe(
      map((statuses: any) => {
        const statusesData = Object.keys(statuses);
        const allstatuses = statusesData.map((id) => {
          const currentStatus = statuses[id as keyof typeof statuses] as Status;
          return {
            id,
            name: currentStatus.name
          };
        });
        return allstatuses
      })
    );
  }

  getStatusesFromBoard(boardId: string): Observable<Status[]>{
    return this.http.get(`${this.fbDbUrl}/boards/${boardId}/statuses.json`) as Observable<Status[]>   
  }
}

export type Board = {
  id?: string,
  name: string,
  owner?: string,
  statuses?: Status[],
};

export type fbResponseOfBoards = {
  [id: string]: Board;
};

export type Status = {
  id: string,
  name: string
}
