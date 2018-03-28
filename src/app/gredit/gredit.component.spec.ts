import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreditComponent } from './gredit.component';

describe('GreditComponent', () => {
  let component: GreditComponent;
  let fixture: ComponentFixture<GreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
