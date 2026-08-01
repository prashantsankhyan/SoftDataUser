import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteItemGroup } from './delete-item-group';

describe('DeleteItemGroup', () => {
  let component: DeleteItemGroup;
  let fixture: ComponentFixture<DeleteItemGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteItemGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteItemGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
