import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  map,
} from 'rxjs';

@Injectable()
export class BoardsService {
  //   user: User | undefined;
  //   authEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'
  //   sighupEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp'
  //   apiKey = 'AIzaSyCDwLAOUJGo-FR_Tgv-HLeHO_Atm43OqB0'
  //   public error$: Subject<string> = new Subject<string>()

  fbDbUrl = 'https://notes-bc21d-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    return this.http.get(`${this.fbDbUrl}/boards.json`).pipe(
      map((boards: any) => {
        const boardsData = Object.keys(boards);
        return boardsData.map((id) => {
          const currentBoard = boards[id as keyof typeof boards] as Board;
          return {
            id,
            name: currentBoard.name,
            owner: currentBoard.owner,
            statuses: currentBoard.statuses,
          };
        });
      })
    );
  }

  getBoard(id: string) {
    return this.http.get(`${this.fbDbUrl}/boards/${id}.json`)
  }

  postBoard(board: Board): Observable<fbResponseOfBoards> {
    return this.http.post(`${this.fbDbUrl}/boards.json`, board) as Observable<fbResponseOfBoards>
  }
}


export type Board = {
  id?: string,
  name: string,
  owner?: string,
  statuses?: any[],
};

export type fbResponseOfBoards = {
  [id: string]: Board;
};
