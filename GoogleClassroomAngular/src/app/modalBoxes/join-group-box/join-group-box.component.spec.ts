import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGroupBoxComponent } from './join-group-box.component';

describe('JoinGroupBoxComponent', () => {
  let component: JoinGroupBoxComponent;
  let fixture: ComponentFixture<JoinGroupBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinGroupBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinGroupBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
