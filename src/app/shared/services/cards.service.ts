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
            boardId: currentCard.boardId,
            statusId: currentCard.statusId
          };
        });
      })
    );
  }

  getCardById(id: string): Observable<Card>  {
    return this.http.get(`${this.fbDbUrl}/cards/${id}.json`) as Observable<Card>
  }

  getCardByBoardId(boardId: string): Observable<Card[]> {
    return this.http.get(`${this.fbDbUrl}/cards.json`).pipe(
      map((cards) => {
        const allCard: Card[] = Object.keys(cards).map(cardId => ({...cards[cardId as keyof typeof cards], id: cardId })) as Card[]
        return allCard.filter(card => card.boardId === boardId)
      })
    )
  }

  postCard(card: Card): Observable<fbResponseOfCards> {
    return this.http.post(`${this.fbDbUrl}/cards.json`, card) as  Observable<fbResponseOfCards>
  }

  putCard(card: Card, id: string): Observable<fbResponseOfCards> {
    return this.http.put(`${this.fbDbUrl}/cards/${id}.json`, card) as  Observable<fbResponseOfCards>
  }

  deleteCardById(id: string): Observable<fbResponseOfCards>{
    return this.http.delete(`${this.fbDbUrl}/cards/${id}.json`) as  Observable<fbResponseOfCards>
  }
}


export type Card = {
  id?: string,
  name: string,
  content?: string,
  author?: string,
  tags?: Tag[],
  boardId: string,
  statusId: string
};

export type fbResponseOfCards = {
  [id: string]: Card;
};

export type Tag = {
  id?: string,
  name: string
}
