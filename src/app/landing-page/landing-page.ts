import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {
  Math = Math;
  isOpening = false;

  constructor(private router: Router) {}

  openInvitation() {
    if (this.isOpening) return;
    this.isOpening = true;
    
    // Allow time for the exit animation before routing
    setTimeout(() => {
      this.router.navigate(['/invitation']);
    }, 1000);
  }
}
