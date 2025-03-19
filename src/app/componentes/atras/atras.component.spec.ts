import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtrasComponent } from './atras.component';

describe('AtrasComponent', () => {
  let component: AtrasComponent;
  let fixture: ComponentFixture<AtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
