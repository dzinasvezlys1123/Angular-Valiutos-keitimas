import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterGraphComponent } from './converter-graph.component';

describe('ConverterGraphComponent', () => {
  let component: ConverterGraphComponent;
  let fixture: ComponentFixture<ConverterGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConverterGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
