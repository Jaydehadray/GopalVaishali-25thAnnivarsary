import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainInvitation } from './main-invitation';

describe('MainInvitation', () => {
  let component: MainInvitation;
  let fixture: ComponentFixture<MainInvitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainInvitation],
    }).compileComponents();

    fixture = TestBed.createComponent(MainInvitation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
