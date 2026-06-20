import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private requestCount = 0;

  constructor() { }

  // Method to show loader
  showLoader(): void {
    this.requestCount++;
    this.isLoadingSubject.next(true);
  }

  // Method to hide loader
  hideLoader(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.isLoadingSubject.next(false);
      this.requestCount = 0;
    }
  }
}
