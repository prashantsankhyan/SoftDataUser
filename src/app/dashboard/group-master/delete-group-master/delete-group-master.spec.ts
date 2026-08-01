import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGroupMaster } from './delete-group-master';

describe('DeleteGroupMaster', () => {
  let component: DeleteGroupMaster;
  let fixture: ComponentFixture<DeleteGroupMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGroupMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteGroupMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
