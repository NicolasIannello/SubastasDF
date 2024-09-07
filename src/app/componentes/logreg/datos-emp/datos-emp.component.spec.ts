import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosEmpComponent } from './datos-emp.component';

describe('DatosEmpComponent', () => {
  let component: DatosEmpComponent;
  let fixture: ComponentFixture<DatosEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosEmpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
