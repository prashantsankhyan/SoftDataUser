import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSaleHeading } from './delete-sale-heading';

describe('DeleteSaleHeading', () => {
  let component: DeleteSaleHeading;
  let fixture: ComponentFixture<DeleteSaleHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSaleHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSaleHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
