import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionaisListComponent } from './profissionais-list.component';

describe('ProfissionaisListComponent', () => {
  let component: ProfissionaisListComponent;
  let fixture: ComponentFixture<ProfissionaisListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfissionaisListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfissionaisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
