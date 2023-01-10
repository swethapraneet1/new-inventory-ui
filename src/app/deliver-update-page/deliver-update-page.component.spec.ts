import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverUpdatePageComponent } from './deliver-update-page.component';

describe('DeliverUpdatePageComponent', () => {
  let component: DeliverUpdatePageComponent;
  let fixture: ComponentFixture<DeliverUpdatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverUpdatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
