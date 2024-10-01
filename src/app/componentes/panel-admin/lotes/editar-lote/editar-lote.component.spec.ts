import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarLoteComponent } from './editar-lote.component';

describe('EditarLoteComponent', () => {
  let component: EditarLoteComponent;
  let fixture: ComponentFixture<EditarLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarLoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
