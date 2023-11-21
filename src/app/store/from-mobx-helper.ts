
import { computed } from 'mobx';
import { Observable } from 'rxjs';

export function fromMobx<T>(expression: () => T): Observable<T> {
  return new Observable(observer => {
    const computedValue = computed(expression);
    const disposer = () => {
      observer.next(computedValue.get());
    };
    return () => {
      if (disposer) {
        console.log('disposer')
        disposer();
      }
    };
  });
}