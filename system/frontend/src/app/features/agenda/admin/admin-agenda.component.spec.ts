import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgendaComponent } from './admin-agenda.component';

describe('AdminAgendaComponent', () => {
  let component: AdminAgendaComponent;
  let fixture: ComponentFixture<AdminAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAgendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
