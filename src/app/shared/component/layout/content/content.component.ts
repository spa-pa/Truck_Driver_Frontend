import { Component, HostListener } from '@angular/core';
import { LayoutService } from '../../../../shared/services/layout.service';
import { NavmenuService } from '../../../services/navmenu.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';

@Component({
    selector: 'app-content',
    imports: [CommonModule, HeaderComponent, SidebarComponent, BreadcrumbComponent,
         RouterOutlet, FooterComponent],
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss'
})
export class ContentComponent {


  constructor(public layout: LayoutService, public navmenu: NavmenuService) {
    if (window.innerWidth < 1185) {
      navmenu.closeSidebar = true;
    }

    if (window.innerWidth <= 1185) {
      this.layout.config.settings.sidebar_type = 'vertical-sidebar'
    } else {
      this.layout.config.settings.sidebar_type = this.layout.config.settings.sidebar_type;
    }

  }

  @HostListener('window:resize', ['$event'])

  onResize() {
    if (window.innerWidth < 1185) {
      this.navmenu.closeSidebar = true;
    } else {
      this.navmenu.closeSidebar = false;
    }

    if (window.innerWidth <= 1185) {
      this.layout.config.settings.sidebar_type = 'vertical-sidebar';
    } else {
      this.layout.config.settings.sidebar_type = this.layout.config.settings.sidebar_type;
    }
  }

}
