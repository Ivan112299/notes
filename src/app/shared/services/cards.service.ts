import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  map,
} from 'rxjs';

@Injectable()
export class CardsService {

  fbDbUrl = 'https://notes-bc21d-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  getAllCards(): Observable<Card[]> {
    return this.http.get(`${this.fbDbUrl}/cards.json`).pipe(
      map((cards: any) => {
        const cardsData = Object.keys(cards);
        return cardsData.map((id) => {
          const currentCard = cards[id as keyof typeof cards] as Card;
          return {
            id,
            name: currentCard.name,
            content: currentCard.content,
            author: currentCard.author,
            tags: currentCard.tags,
            boardId: currentCard.boardId
          };
        });
      })
    );
  }

  getCard(id: string) {
    return this.http.get(`${this.fbDbUrl}/cards/${id}.json`)
  }

  postCard(card: Card): Observable<fbResponseOfCards> {
    return this.http.post(`${this.fbDbUrl}/cards.json`, card) as  Observable<fbResponseOfCards>
  }
}


export type Card = {
  id?: string,
  name: string,
  content?: string,
  author?: string,
  tags?: Tag[],
  boardId: string
};

export type fbResponseOfCards = {
  [id: string]: Card;
};

export type Tag = {
  id?: string,
  name: string
}
