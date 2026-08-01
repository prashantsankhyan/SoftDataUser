import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMaster } from './agent-master';

describe('AgentMaster', () => {
  let component: AgentMaster;
  let fixture: ComponentFixture<AgentMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
