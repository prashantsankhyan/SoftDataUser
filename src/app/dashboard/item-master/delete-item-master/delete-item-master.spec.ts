import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteItemMaster } from './delete-item-master';

describe('DeleteItemMaster', () => {
  let component: DeleteItemMaster;
  let fixture: ComponentFixture<DeleteItemMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteItemMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteItemMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
