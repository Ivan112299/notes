import { Injectable } from "@angular/core";
import { CustomBeahaviorSubject, CustomReplaySubject, CustomSubject } from "./custom-behavior-subject";

@Injectable({providedIn: 'root'})
export class TestService {
  public customBS = new CustomBeahaviorSubject<number>(2)
  public customSub = new CustomSubject<string>()
  public customReplaySub = new CustomReplaySubject<string>(4)
}