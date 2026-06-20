import { Injectable } from '@angular/core';
import { GlobalConfig } from '@shared/configs/global-config';
import { Menu } from '@shared/models/navmenu';
import { currentUser } from '@shared/utils/current-user';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Injectable({
  providedIn: 'root'
})
export class NavmenuService {

  public language: boolean = false;
  public isShow: boolean = false;
  public closeSidebar: boolean = false;

  MENUITEMS: Menu[] = []

  item = new BehaviorSubject<Menu[]>([]);

  constructor() {
  }

  intializeMenu(MENUITEMS: any): Promise<void> {
    return new Promise<void>((resolve) => {
      this.item.next(MENUITEMS);
      resolve();
    });
  }
}
export { Menu };

