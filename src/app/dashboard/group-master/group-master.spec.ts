import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMaster } from './group-master';

describe('GroupMaster', () => {
  let component: GroupMaster;
  let fixture: ComponentFixture<GroupMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
