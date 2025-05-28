import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupchatListComponent } from './groupchat-list.component';

describe('GroupchatListComponent', () => {
  let component: GroupchatListComponent;
  let fixture: ComponentFixture<GroupchatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupchatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupchatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
