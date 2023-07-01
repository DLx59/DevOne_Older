import {Component} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navbarIsCollapse: boolean = true
  dropdownIsCollapse: boolean = true

  toggleNavbarCollapse() {
    this.navbarIsCollapse = !this.navbarIsCollapse
  }
  toggleDropdownCollapse() {
    this.dropdownIsCollapse = !this.dropdownIsCollapse
  }
}
