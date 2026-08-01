import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSale } from './delete-sale';

describe('DeleteSale', () => {
  let component: DeleteSale;
  let fixture: ComponentFixture<DeleteSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
