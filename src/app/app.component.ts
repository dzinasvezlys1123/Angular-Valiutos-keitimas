import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'currency-coventer';

  loading: boolean = false;

  constructor(
    // private dialog: MatDialog,
    private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }

      if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
        // if (event instanceof NavigationEnd) {
        //   this.dialog.closeAll();
        // }
        this.loading = false;
      }
    });
  }
}
