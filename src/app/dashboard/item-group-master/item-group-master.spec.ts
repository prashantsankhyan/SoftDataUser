import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupMaster } from './item-group-master';

describe('ItemGroupMaster', () => {
  let component: ItemGroupMaster;
  let fixture: ComponentFixture<ItemGroupMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemGroupMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemGroupMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
