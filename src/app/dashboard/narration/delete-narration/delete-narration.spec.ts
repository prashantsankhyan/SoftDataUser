import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNarration } from './delete-narration';

describe('DeleteNarration', () => {
  let component: DeleteNarration;
  let fixture: ComponentFixture<DeleteNarration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteNarration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNarration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
