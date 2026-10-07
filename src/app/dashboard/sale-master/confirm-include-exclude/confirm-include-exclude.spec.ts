import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmIncludeExclude } from './confirm-include-exclude';

describe('ConfirmIncludeExclude', () => {
  let component: ConfirmIncludeExclude;
  let fixture: ComponentFixture<ConfirmIncludeExclude>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmIncludeExclude]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmIncludeExclude);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
