import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuSessionsPage } from './menu-sessions.page';

describe('MenuSessionsPage', () => {
  let component: MenuSessionsPage;
  let fixture: ComponentFixture<MenuSessionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSessionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuSessionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
