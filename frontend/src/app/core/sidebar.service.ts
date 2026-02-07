import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private collapsed$ = new BehaviorSubject<boolean>(false);
  get collapsed() {
    return this.collapsed$.asObservable();
  }
  get isCollapsed(): boolean {
    return this.collapsed$.value;
  }
  toggle(): void {
    this.collapsed$.next(!this.collapsed$.value);
  }
}
