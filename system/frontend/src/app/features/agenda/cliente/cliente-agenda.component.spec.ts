import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteAgendaComponent } from './cliente-agenda.component';

describe('ClienteAgendaComponent', () => {
  let component: ClienteAgendaComponent;
  let fixture: ComponentFixture<ClienteAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteAgendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
