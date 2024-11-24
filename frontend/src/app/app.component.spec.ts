import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Event, NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let routerEvents: Subject<Event>;

  beforeEach(async () => {
    // Create a subject to control router events
    routerEvents = new Subject<Event>();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEvents.asObservable(),
            url: '/'
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isHome as false', () => {
    expect(component.isHome).toBeFalsy();
  });

  it('should set isHome to true when navigating to root path', fakeAsync(() => {
    // Simulate navigation to root
    routerEvents.next(new NavigationEnd(1, '/', '/'));
    tick();

    expect(component.isHome).toBeTruthy();
  }));

  it('should set isHome to false when navigating to non-root path', fakeAsync(() => {
    // First navigate to root
    routerEvents.next(new NavigationEnd(1, '/', '/'));
    tick();

    // Then navigate away
    routerEvents.next(new NavigationEnd(2, '/other', '/other'));
    tick();

    expect(component.isHome).toBeFalsy();
  }));

  it('should ignore non-NavigationEnd events', fakeAsync(() => {
    // Set initial state
    component.isHome = true;

    // Emit a different type of router event
    routerEvents.next({} as Event);
    tick();

    // State should not change
    expect(component.isHome).toBeTruthy();
  }));

  it('should properly handle multiple consecutive navigations', fakeAsync(() => {
    // Simulate multiple navigations
    routerEvents.next(new NavigationEnd(1, '/', '/'));
    tick();
    expect(component.isHome).toBeTruthy();

    routerEvents.next(new NavigationEnd(2, '/other', '/other'));
    tick();
    expect(component.isHome).toBeFalsy();

    routerEvents.next(new NavigationEnd(3, '/', '/'));
    tick();
    expect(component.isHome).toBeTruthy();
  }));

  // Test console.log output
  it('should log isHome state changes', fakeAsync(() => {
    const consoleSpy = jest.spyOn(console, 'log');

    routerEvents.next(new NavigationEnd(1, '/', '/'));
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('isHome', true);

    consoleSpy.mockRestore();
  }));
});
