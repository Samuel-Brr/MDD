import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {Router, RouterModule} from '@angular/router';
import {SessionService} from '../../services/session.service';
import {BehaviorSubject} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  template: '',
  standalone: true
})
class StubComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: jest.Mocked<Router>;
  let sessionService: jest.Mocked<SessionService>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);

    const mockSessionService = {
      $isLogged: jest.fn().mockReturnValue(isLoggedInSubject.asObservable())
    };

    const mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
      events: new BehaviorSubject({}),
      createUrlTree: jest.fn(),
      serializeUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        RouterModule,
        HeaderComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    sessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    isLoggedInSubject.complete();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Mobile Menu', () => {
    it('should initialize with closed mobile menu', () => {
      expect(component.isMobileMenuOpen).toBeFalsy();
    });

    it('should toggle mobile menu', () => {
      expect(component.isMobileMenuOpen).toBeFalsy();
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen).toBeTruthy();
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen).toBeFalsy();
    });

    it('should close mobile menu', () => {
      component.isMobileMenuOpen = true;
      component.closeMobileMenu();
      expect(component.isMobileMenuOpen).toBeFalsy();
    });
  });

  describe('Authentication State', () => {
    it('should reflect logged in state changes', (done) => {
      component.$isLoggedIn.subscribe(state => {
        expect(state).toBeFalsy();
        done();
      });
    });

    it('should call SessionService.$isLogged on initialization', () => {
      expect(sessionService.$isLogged).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile page', () => {
      component.navigateToProfile();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/profil']);
    });
  });

  describe('Component State', () => {
    it('should handle mobile menu state properly', () => {
      // Test initial state
      expect(component.isMobileMenuOpen).toBeFalsy();

      // Test opening menu
      component.toggleMobileMenu();
      fixture.detectChanges();
      expect(component.isMobileMenuOpen).toBeTruthy();

      // Test closing menu
      component.closeMobileMenu();
      fixture.detectChanges();
      expect(component.isMobileMenuOpen).toBeFalsy();
    });
  });
});
