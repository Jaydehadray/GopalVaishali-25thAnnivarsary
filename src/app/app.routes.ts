import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { MainInvitation } from './main-invitation/main-invitation';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'invitation', component: MainInvitation },
  { path: '**', redirectTo: '' }
];
