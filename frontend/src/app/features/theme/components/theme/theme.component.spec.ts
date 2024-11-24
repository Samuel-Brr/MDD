import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThemeComponent} from './theme.component';
import {Router} from '@angular/router';
import {ThemeService} from '../../services/theme.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SessionService} from '../../../../shared/services/session.service';
import {Theme} from '../../../../shared/interfaces/theme';
import {of, throwError} from 'rxjs';

describe('ThemeComponent', () => {
  let component: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockThemeService: jest.Mocked<ThemeService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let mockSessionService: Partial<SessionService>;

  // Mock data
  const mockThemes: Theme[] = [
    {
      id: 1,
      titre: 'Angular',
      description: 'Angular framework',
      articles: [],
      abonnes: [1, 2]
    },
    {
      id: 2,
      titre: 'TypeScript',
      description: 'TypeScript programming',
      articles: [],
      abonnes: [2, 3]
    }
  ];

  const mockUserId = 1;

  beforeEach(async () => {
    // Create mocks
    mockRouter = {
      url: '/themes'
    } as unknown as jest.Mocked<Router>;

    mockThemeService = {
      getThemes: jest.fn(),
      subscribeTheme: jest.fn(),
      unsubscribeTheme: jest.fn()
    } as unknown as jest.Mocked<ThemeService>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    mockSessionService = {
      sessionInformation: {
        id: mockUserId
      }
    } as any;

    await TestBed.configureTestingModule({
      imports: [ThemeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with empty themes array', () => {
      expect(component.themes).toEqual([]);
    });
  });

  describe('Theme Loading', () => {
    describe('On /themes route', () => {

      it('should load all themes', () => {
        // Arrange
        mockThemeService.getThemes.mockReturnValue(of({ themes: mockThemes }));

        // Act
        fixture.detectChanges();

        // Assert
        expect(mockThemeService.getThemes).toHaveBeenCalled();
        expect(component.themes).toEqual(mockThemes);
      });

      it('should show error message when loading themes fails', () => {
        // Arrange
        mockThemeService.getThemes.mockReturnValue(throwError(() => new Error('Test error')));

        // Act
        fixture.detectChanges();

        // Assert
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Erreur lors du chargement des thèmes',
          'Fermer',
          { duration: 3000 }
        );
      });
    });
  });

  describe('Theme Subscription', () => {
    it('should successfully subscribe to theme', () => {
      // Arrange
      const themeId = 1;
      mockThemeService.subscribeTheme.mockReturnValue(of({}));

      // Act
      component.onSubscribe(themeId);

      // Assert
      expect(mockThemeService.subscribeTheme).toHaveBeenCalledWith(themeId);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Vous êtes abonné à ce thème',
        'Fermer',
        { duration: 3000 }
      );
    });

    it('should handle subscription error', () => {
      // Arrange
      const themeId = 1;
      mockThemeService.subscribeTheme.mockReturnValue(throwError(() => new Error('Test error')));

      // Act
      component.onSubscribe(themeId);

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de l\'abonnement au thème',
        'Fermer',
        { duration: 3000 }
      );
    });
  });

  describe('Theme Unsubscription', () => {
    it('should successfully unsubscribe from theme', () => {
      // Arrange
      const themeId = 1;
      mockThemeService.unsubscribeTheme.mockReturnValue(of({}));
      mockThemeService.getThemes.mockReturnValue(of({ themes: mockThemes }));

      // Act
      component.onUnsubscribe(themeId);

      // Assert
      expect(mockThemeService.unsubscribeTheme).toHaveBeenCalledWith(themeId);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Vous êtes désabonné de ce thème',
        'Fermer',
        { duration: 3000 }
      );
      expect(mockThemeService.getThemes).toHaveBeenCalled(); // Verify refresh
    });

    it('should handle unsubscription error', () => {
      // Arrange
      const themeId = 1;
      mockThemeService.unsubscribeTheme.mockReturnValue(throwError(() => new Error('Test error')));

      // Act
      component.onUnsubscribe(themeId);

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la désabonnement du thème',
        'Fermer',
        { duration: 3000 }
      );
    });
  });
});
