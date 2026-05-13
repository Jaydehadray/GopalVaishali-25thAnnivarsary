import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationDetails } from './invitation-details';

describe('InvitationDetails', () => {
  let component: InvitationDetails;
  let fixture: ComponentFixture<InvitationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
