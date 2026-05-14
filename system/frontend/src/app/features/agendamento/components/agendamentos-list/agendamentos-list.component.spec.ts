import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentosListComponent } from './agendamentos-list.component';

describe('AgendamentosListComponent', () => {
  let component: AgendamentosListComponent;
  let fixture: ComponentFixture<AgendamentosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentosListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendamentosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
