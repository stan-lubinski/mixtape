import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTapesComponent } from './my-tapes.component';

describe('MyTapesComponent', () => {
  let component: MyTapesComponent;
  let fixture: ComponentFixture<MyTapesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyTapesComponent]
    });
    fixture = TestBed.createComponent(MyTapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
