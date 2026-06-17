import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentosServicosComponent } from './agendamentos-servicos.component';

describe('AgendamentosServicosComponent', () => {
  let component: AgendamentosServicosComponent;
  let fixture: ComponentFixture<AgendamentosServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentosServicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendamentosServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
