import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingDayEntryComponent } from './closing-day-entry.component';

describe('ClosingDayEntryComponent', () => {
  let component: ClosingDayEntryComponent;
  let fixture: ComponentFixture<ClosingDayEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosingDayEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosingDayEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
