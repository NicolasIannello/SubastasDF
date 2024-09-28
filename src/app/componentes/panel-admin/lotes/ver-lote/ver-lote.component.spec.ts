import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerLoteComponent } from './ver-lote.component';

describe('VerLoteComponent', () => {
  let component: VerLoteComponent;
  let fixture: ComponentFixture<VerLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerLoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
