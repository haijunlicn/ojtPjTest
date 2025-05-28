import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  constructor(private authService: AuthService) { }

  ngAfterViewInit(): void {
    console.log("sidebar testing");

    // Restore previous toggle state
    const savedToggle = localStorage.getItem('sb|sidebar-toggle');
    if (savedToggle === 'true') {
      console.log("sidebar saved");
      document.body.classList.add('sb-sidenav-toggled');
    }
  }

  toggleSidebar(): void {
    console.log("sidebarToggle clicked from HTML");
    document.body.classList.toggle('sb-sidenav-toggled');
    const isToggled = document.body.classList.contains('sb-sidenav-toggled');
    localStorage.setItem('sb|sidebar-toggle', String(isToggled));
  }


  onLogout(): void {
    this.authService.logout();
  }
}
