import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoRegistroComponent } from './como-registro.component';

describe('ComoRegistroComponent', () => {
  let component: ComoRegistroComponent;
  let fixture: ComponentFixture<ComoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComoRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
