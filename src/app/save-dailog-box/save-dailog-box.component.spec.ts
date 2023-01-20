import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDailogBoxComponent } from './save-dailog-box.component';

describe('SaveDailogBoxComponent', () => {
  let component: SaveDailogBoxComponent;
  let fixture: ComponentFixture<SaveDailogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveDailogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDailogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
