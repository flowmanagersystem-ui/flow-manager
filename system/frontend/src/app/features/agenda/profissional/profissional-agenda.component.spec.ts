import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalAgendaComponent } from './profissional-agenda.component';

describe('ProfissionalAgendaComponent', () => {
  let component: ProfissionalAgendaComponent;
  let fixture: ComponentFixture<ProfissionalAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfissionalAgendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfissionalAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
