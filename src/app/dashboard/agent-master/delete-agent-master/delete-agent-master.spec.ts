import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAgentMaster } from './delete-agent-master';

describe('DeleteAgentMaster', () => {
  let component: DeleteAgentMaster;
  let fixture: ComponentFixture<DeleteAgentMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAgentMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAgentMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
