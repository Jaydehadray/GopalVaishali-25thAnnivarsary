import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitation-details',
  imports: [],
  templateUrl: './invitation-details.html',
  styleUrl: './invitation-details.css'
})
export class InvitationDetails {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }

  viewSaveTheDate() {
    this.router.navigate(['/save-the-date']);
  }
}
