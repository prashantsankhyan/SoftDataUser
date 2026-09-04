import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePurchase } from './delete-purchase';

describe('DeletePurchase', () => {
  let component: DeletePurchase;
  let fixture: ComponentFixture<DeletePurchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePurchase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePurchase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
