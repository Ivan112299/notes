export type CustomObserver<T> = (data: T | undefined) => void

export class CustomSubject<T> {
  value: T | undefined;
  protected completed = false;
  protected observers: CustomObserver<T>[] = [];

  testObs: { [key: number]: CustomObserver<T> } = {

  }
  index: number = 0;

  constructor() {}

  subscribe(observer: CustomObserver<T>): void {
    if (this.completed) return;
    if (this.observers.length && observer.toString() === this.observers[0].toString()) return;

    this.observers.push(observer)
  }

  next(newValue: T) {
    if (this.completed) return;
    this.value = newValue
    this.observers.forEach(observer => {
      observer(newValue)
    })
  }

  complete() {
    this.completed = true
  }

}

export class CustomBeahaviorSubject<T> extends CustomSubject<T> {

  constructor(initialValue: T) {
    super();
    this.value = initialValue
  }

  override subscribe(observer: CustomObserver<T>) {

    this.observers.push(observer)

    if (this.completed) return;
    this.observers.push(observer)
    observer(this.value)
  }

}

export class CustomReplaySubject<T> extends CustomSubject<T> {
  countReplay = 1
  values: T[] = []

  constructor(countReplay: number) {
    super()
    this.countReplay = countReplay
  }

  override next(newValue: T) {
    if (this.completed) return;
    this.value = newValue
    this.values.push(newValue)
    if (this.values.length > this.countReplay) {
      this.values.shift()
    }
    this.observers.forEach(observer => {
      this.values.forEach(value => {
        observer(value)
      })
    })
  }

}