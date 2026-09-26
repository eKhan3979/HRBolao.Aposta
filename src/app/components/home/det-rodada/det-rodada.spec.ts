import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetRodada } from './det-rodada';

describe('DetRodada', () => {
  let component: DetRodada;
  let fixture: ComponentFixture<DetRodada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetRodada],
    }).compileComponents();

    fixture = TestBed.createComponent(DetRodada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
