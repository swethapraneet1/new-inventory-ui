import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSalesDetailsComponent } from './shop-sales-details.component';

describe('ShopSalesDetailsComponent', () => {
  let component: ShopSalesDetailsComponent;
  let fixture: ComponentFixture<ShopSalesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopSalesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSalesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
