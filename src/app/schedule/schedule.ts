import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css'
})
export class Schedule {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/photos']);
  }

  viewVenue() {
    this.router.navigate(['/venue']);
  }
}
