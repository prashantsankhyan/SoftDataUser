import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Narration } from './narration';

describe('Narration', () => {
  let component: Narration;
  let fixture: ComponentFixture<Narration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Narration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Narration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
