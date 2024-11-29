import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProfilComponent} from './profil.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SessionService} from '../../../../shared/services/session.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Credentials} from '../../interfaces/credentials.interface';
import {of, throwError} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ThemeComponent} from '../../../theme/components/theme/theme.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockRouter: jest.Mocked<Router>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  // Mock data
  const mockCredentials: Credentials = {
    username: 'testUser',
    email: 'test@example.com'
  };

  beforeEach(async () => {
    // Create mocks
    mockAuthService = {
      getCredentials: jest.fn(),
      updateCredentials: jest.fn(),
      logout: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    mockSessionService = {
      logOut: jest.fn()
    } as unknown as jest.Mocked<SessionService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        ProfilComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ]
    })
      .overrideComponent(ProfilComponent, {
        remove: {
          imports: [ThemeComponent]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
      expect(component.form.get('username')?.value).toBe('');
      expect(component.form.get('email')?.value).toBe('');
    });

    it('should load credentials on init', () => {
      // Arrange
      mockAuthService.getCredentials.mockReturnValue(of(mockCredentials));

      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(mockAuthService.getCredentials).toHaveBeenCalled();
      expect(component.form.get('username')?.value).toBe(mockCredentials.username);
      expect(component.form.get('email')?.value).toBe(mockCredentials.email);
    });

    it('should handle error when loading credentials fails', () => {
      // Arrange
      const error = new Error('Failed to load credentials');
      mockAuthService.getCredentials.mockReturnValue(throwError(() => error));

      // Act
      fixture.detectChanges();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la récupération des crédentials',
        'Fermer',
        { duration: 3000 }
      );
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    describe('Username Field', () => {
      it('should be invalid when empty', () => {
        const usernameControl = component.form.get('username');
        expect(usernameControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid when less than 3 characters', () => {
        const usernameControl = component.form.get('username');
        usernameControl?.setValue('ab');
        expect(usernameControl?.errors?.['minlength']).toBeTruthy();
      });

      it('should be valid when 3 or more characters', () => {
        const usernameControl = component.form.get('username');
        usernameControl?.setValue('abc');
        expect(usernameControl?.valid).toBeTruthy();
      });
    });

    describe('Email Field', () => {
      it('should be invalid when empty', () => {
        const emailControl = component.form.get('email');
        expect(emailControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid with incorrect email format', () => {
        const emailControl = component.form.get('email');
        emailControl?.setValue('invalid-email');
        expect(emailControl?.errors?.['email']).toBeTruthy();
      });

      it('should be valid with correct email format', () => {
        const emailControl = component.form.get('email');
        emailControl?.setValue('test@example.com');
        expect(emailControl?.valid).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should not call updateCredentials when form is invalid', () => {
      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.updateCredentials).not.toHaveBeenCalled();
    });

    it('should update credentials when form is valid', () => {
      // Arrange
      mockAuthService.updateCredentials.mockReturnValue(of(void 0));
      component.form.patchValue(mockCredentials);

      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.updateCredentials).toHaveBeenCalledWith(mockCredentials);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Profil mis à jour',
        'OK',
        { duration: 3000 }
      );
    });

    it('should show error message when update fails', () => {
      // Arrange
      mockAuthService.updateCredentials.mockReturnValue(throwError(() => new Error()));
      component.form.patchValue(mockCredentials);

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Une erreur est survenue',
        'Fermer',
        { duration: 3000 }
      );
    });
  });

  describe('Logout', () => {
    it('should handle successful logout', () => {
      // Arrange
      mockAuthService.logout.mockReturnValue(of(void 0));

      // Act
      component.onLogout();

      // Assert
      expect(mockSessionService.logOut).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
