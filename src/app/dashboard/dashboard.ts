import { Component } from '@angular/core';
import { DashboardNavbar } from './dashboard-navbar/dashboard-navbar';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardNavbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
