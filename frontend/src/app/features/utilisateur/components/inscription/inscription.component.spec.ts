import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionComponent } from './inscription.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('InscriptionComponent', () => {
  let component: InscriptionComponent;
  let fixture: ComponentFixture<InscriptionComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    // Create mocks
    mockAuthService = {
      register: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        InscriptionComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
      expect(component.signupForm.get('username')?.value).toBe('');
      expect(component.signupForm.get('email')?.value).toBe('');
      expect(component.signupForm.get('password')?.value).toBe('');
    });

    it('should start with invalid form', () => {
      expect(component.signupForm.valid).toBeFalsy();
    });
  });

  describe('Form Validation', () => {
    describe('Username Field', () => {
      it('should be invalid when empty', () => {
        const usernameControl = component.signupForm.get('username');
        expect(usernameControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid when less than 3 characters', () => {
        const usernameControl = component.signupForm.get('username');
        usernameControl?.setValue('ab');
        expect(usernameControl?.errors?.['minlength']).toBeTruthy();
      });

      it('should be valid when 3 or more characters', () => {
        const usernameControl = component.signupForm.get('username');
        usernameControl?.setValue('abc');
        expect(usernameControl?.valid).toBeTruthy();
      });
    });

    describe('Email Field', () => {
      it('should be invalid when empty', () => {
        const emailControl = component.signupForm.get('email');
        expect(emailControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid with incorrect email format', () => {
        const emailControl = component.signupForm.get('email');
        emailControl?.setValue('invalid-email');
        expect(emailControl?.errors?.['email']).toBeTruthy();
      });

      it('should be valid with correct email format', () => {
        const emailControl = component.signupForm.get('email');
        emailControl?.setValue('test@example.com');
        expect(emailControl?.valid).toBeTruthy();
      });
    });

    describe('Password Field', () => {
      it('should be invalid when empty', () => {
        const passwordControl = component.signupForm.get('password');
        expect(passwordControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid with weak password', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('weak');
        expect(passwordControl?.errors?.['pattern']).toBeTruthy();
      });

      it('should be valid with strong password', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('StrongPass123!');
        expect(passwordControl?.valid).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should not call register when form is invalid', () => {
      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should call register with form values when valid', () => {
      // Arrange
      const validForm = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPass123!'
      };
      component.signupForm.setValue(validForm);
      mockAuthService.register.mockReturnValue(of(void 0));

      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith(validForm);
    });

    it('should show error message when registration fails', () => {
      // Arrange
      const validForm = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPass123!'
      };
      component.signupForm.setValue(validForm);
      mockAuthService.register.mockReturnValue(throwError(() => new Error('Registration failed')));

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de l\'enregistrement',
        'Fermer',
        { duration: 3000 }
      );
    });
  });
});
