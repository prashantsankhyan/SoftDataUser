import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAgentMaster } from './add-edit-agent-master';

describe('AddEditAgentMaster', () => {
  let component: AddEditAgentMaster;
  let fixture: ComponentFixture<AddEditAgentMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAgentMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAgentMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
