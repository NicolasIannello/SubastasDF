import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzulComponent } from './azul.component';

describe('AzulComponent', () => {
  let component: AzulComponent;
  let fixture: ComponentFixture<AzulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AzulComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AzulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
