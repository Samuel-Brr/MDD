import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConnexionComponent} from './connexion.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SessionService} from '../../../../shared/services/session.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SessionInformation} from '../../../../shared/interfaces/sessionInformation.interface';
import {throwError} from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ConnexionComponent', () => {
  let component: ConnexionComponent;
  let fixture: ComponentFixture<ConnexionComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  // Mock data
  const mockLoginData = {
    emailOrUsername: 'test@example.com',
    password: 'TestPassword123!'
  };

  const mockSessionInfo: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  beforeEach(async () => {
    // Create mocks
    mockAuthService = {
      login: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockSessionService = {
      logIn: jest.fn()
    } as unknown as jest.Mocked<SessionService>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        ConnexionComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty fields', () => {
      expect(component.loginForm.get('emailOrUsername')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should be invalid when empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', () => {
      const emailControl = component.loginForm.get('emailOrUsername');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should validate password pattern', () => {
      const passwordControl = component.loginForm.get('password');

      passwordControl?.setValue('weak');
      expect(passwordControl?.hasError('pattern')).toBeTruthy();

      passwordControl?.setValue('StrongPass123!');
      expect(passwordControl?.hasError('pattern')).toBeFalsy();
    });
  });

  describe('Login Submission', () => {
    it('should not call login service if form is invalid', () => {
      // Form is initially invalid
      component.onSubmit();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should handle login error', () => {
      // Arrange
      const errorMessage = 'Login failed';
      mockAuthService.login.mockReturnValue(throwError(() => new Error(errorMessage)));
      component.loginForm.patchValue(mockLoginData);

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la connexion',
        'Fermer',
        { duration: 3000 }
      );
    });
  });
});
