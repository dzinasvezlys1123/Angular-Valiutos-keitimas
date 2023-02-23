import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterBlockComponent } from './converter-block.component';

describe('ConverterBlockComponent', () => {
  let component: ConverterBlockComponent;
  let fixture: ComponentFixture<ConverterBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConverterBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
