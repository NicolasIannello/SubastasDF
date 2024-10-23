import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjudicadosComponent } from './adjudicados.component';

describe('AdjudicadosComponent', () => {
  let component: AdjudicadosComponent;
  let fixture: ComponentFixture<AdjudicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjudicadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjudicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
