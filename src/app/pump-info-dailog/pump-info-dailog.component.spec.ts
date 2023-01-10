import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpInfoDailogComponent } from './pump-info-dailog.component';

describe('PumpInfoDailogComponent', () => {
  let component: PumpInfoDailogComponent;
  let fixture: ComponentFixture<PumpInfoDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpInfoDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpInfoDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
