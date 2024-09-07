import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAccesoComponent } from './datos-acceso.component';

describe('DatosAccesoComponent', () => {
  let component: DatosAccesoComponent;
  let fixture: ComponentFixture<DatosAccesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosAccesoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
