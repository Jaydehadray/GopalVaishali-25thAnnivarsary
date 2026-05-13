import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photos',
  imports: [],
  templateUrl: './photos.html',
  styleUrl: './photos.css'
})
export class Photos {
  constructor(private router: Router) { }

  nextPage() {
    this.router.navigate(['/schedule']);
  }

  goBack() {
    this.router.navigate(['/save-the-date']);
  }
}
