import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';

// Components
import {ArticleComponent} from './features/article/components/article/article.component';
import {CreerArticleComponent} from './features/article/components/creer-article/creer-article.component';
import {ThemeComponent} from './features/theme/components/theme/theme.component';
import {InscriptionComponent} from "./features/utilisateur/components/inscription/inscription.component";
import {ConnexionComponent} from "./features/utilisateur/components/connexion/connexion.component";
import {ProfilComponent} from "./features/utilisateur/components/profil/profil.component";

// Services
import {ArticleService} from './features/article/services/article.service';
import {ThemeService} from './features/theme/services/theme.service';
import {SessionService} from './shared/services/session.service';
import {AuthService} from "./features/utilisateur/services/auth.service";

describe('Integration Tests', () => {
  // Mock Data
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPass123!'
  };

  const mockSessionInfo = {
    token: 'test-token',
    type: 'Bearer',
    id: 1,
    username: mockUser.username,
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  const mockArticle = {
    id: 1,
    titre: 'Test Article',
    contenu: 'Test Content',
    theme: 'Angular',
    auteur: mockUser.username,
    date: new Date(),
    commentaires: []
  };

  const mockTheme = {
    id: 1,
    titre: 'Angular',
    description: 'Angular Framework',
    articles: [],
    abonnes: []
  };

  describe('Authentication Flow', () => {
    let inscriptionComponent: ComponentFixture<InscriptionComponent>;
    let connexionComponent: ComponentFixture<ConnexionComponent>;
    let profilComponent: ComponentFixture<ProfilComponent>;
    let authService: AuthService;
    let sessionService: SessionService;
    let router: Router;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          ReactiveFormsModule,
          MatSnackBarModule,
          NoopAnimationsModule
        ],
        providers: [
          AuthService,
          SessionService
        ]
      }).compileComponents();

      authService = TestBed.inject(AuthService);
      sessionService = TestBed.inject(SessionService);
      router = TestBed.inject(Router);

      jest.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('should complete full authentication flow successfully', fakeAsync(() => {
      // 1. Registration
      jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
      inscriptionComponent = TestBed.createComponent(InscriptionComponent);
      inscriptionComponent.detectChanges();

      const inscriptionInstance = inscriptionComponent.componentInstance;
      inscriptionInstance.signupForm.setValue(mockUser);
      inscriptionInstance.onSubmit();
      tick();

      expect(authService.register).toHaveBeenCalledWith(mockUser);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);

      // 2. Login
      jest.spyOn(authService, 'login').mockReturnValue(of(mockSessionInfo));
      connexionComponent = TestBed.createComponent(ConnexionComponent);
      connexionComponent.detectChanges();

      const connexionInstance = connexionComponent.componentInstance;
      connexionInstance.loginForm.setValue({
        emailOrUsername: mockUser.email,
        password: mockUser.password
      });
      connexionInstance.onSubmit();
      tick();

      expect(authService.login).toHaveBeenCalled();
      expect(sessionService.isLogged).toBe(true);

      // 3. Profile Update
      jest.spyOn(authService, 'getCredentials').mockReturnValue(of({
        username: mockUser.username,
        email: mockUser.email
      }));
      jest.spyOn(authService, 'updateCredentials').mockReturnValue(of(void 0));

      profilComponent = TestBed.createComponent(ProfilComponent);
      profilComponent.detectChanges();
      tick();

      const profilInstance = profilComponent.componentInstance;
      profilInstance.form.setValue({
        username: 'updateduser',
        email: 'updated@example.com'
      });
      profilInstance.onSubmit();
      tick();

      expect(authService.updateCredentials).toHaveBeenCalled();
    }));
  });

  describe('Article Management Flow', () => {
    let articleComponent: ComponentFixture<ArticleComponent>;
    let creerArticleComponent: ComponentFixture<CreerArticleComponent>;
    let articleService: ArticleService;
    let router: Router;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          ReactiveFormsModule,
          MatSnackBarModule,
          NoopAnimationsModule
        ],
        providers: [
          ArticleService,
          SessionService
        ]
      }).compileComponents();

      articleService = TestBed.inject(ArticleService);
      router = TestBed.inject(Router);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('should complete full article management flow successfully', fakeAsync(() => {
      // 1. Create Article
      jest.spyOn(articleService, 'creerArticle').mockReturnValue(of(1));
      creerArticleComponent = TestBed.createComponent(CreerArticleComponent);
      creerArticleComponent.detectChanges();

      const creerArticleInstance = creerArticleComponent.componentInstance;
      creerArticleInstance.articleForm.setValue({
        theme: mockArticle.theme,
        titre: mockArticle.titre,
        contenu: mockArticle.contenu
      });
      creerArticleInstance.onSubmit();
      tick();

      expect(articleService.creerArticle).toHaveBeenCalled();

      // 2. View Articles
      jest.spyOn(articleService, 'getArticles').mockReturnValue(of({ articles: [mockArticle] }));
      articleComponent = TestBed.createComponent(ArticleComponent);
      articleComponent.detectChanges();
      tick();

      const articleInstance = articleComponent.componentInstance;
      expect(articleService.getArticles).toHaveBeenCalled();
      expect(articleInstance.articles.length).toBe(1);
    }));
  });

  describe('Theme Management Flow', () => {
  let component: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;
  let themeService: jest.Mocked<ThemeService>;
  let sessionService: SessionService;
  let router: Router;

  // Mock Data
  const mockSessionInfo = {
    token: 'test-token',
    type: 'Bearer',
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  const mockTheme = {
    id: 1,
    titre: 'Angular',
    description: 'Angular Framework',
    articles: [],
    abonnes: []
  };

  const mockThemes = {
    themes: [mockTheme]
  };

  beforeEach(async () => {
    // Create mock ThemeService
    const themeServiceMock = {
      getThemes: jest.fn(),
      subscribeTheme: jest.fn(),
      unsubscribeTheme: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ThemeComponent, // Import as standalone component
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
        SessionService
      ]
    }).compileComponents();

    // Get service instances
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    // Set up router spy
    jest.spyOn(router, 'url', 'get').mockReturnValue('/themes');

    // Initialize session
    sessionService.logIn(mockSessionInfo);

    // Set up service method mocks
    themeService.getThemes.mockReturnValue(of(mockThemes));
    themeService.subscribeTheme.mockReturnValue(of());
    themeService.unsubscribeTheme.mockReturnValue(of());

    // Create component
    fixture = TestBed.createComponent(ThemeComponent);
    component = fixture.componentInstance;
  });

  it('should complete full theme management flow successfully', fakeAsync(() => {
    // Initial load of themes
    fixture.detectChanges(); // Triggers ngOnInit
    tick(); // Wait for async operations

    // Verify themes were fetched
    expect(themeService.getThemes).toHaveBeenCalled();
    expect(component.themes).toEqual(mockThemes.themes);

    // Subscribe to theme
    component.onSubscribe(mockTheme.id);
    tick();

    // Verify subscription
    expect(themeService.subscribeTheme).toHaveBeenCalledWith(mockTheme.id);

    // Unsubscribe from theme
    component.onUnsubscribe(mockTheme.id);
    tick();

    // Verify unsubscribe
    expect(themeService.unsubscribeTheme).toHaveBeenCalledWith(mockTheme.id);
  }));

  it('should load themes for profile page', fakeAsync(() => {
    // Mock router URL for profile page
    jest.spyOn(router, 'url', 'get').mockReturnValue('/auth/profil');

    // Mock themes with subscriber
    const themesWithSubscriber = {
      themes: [{
        ...mockTheme,
        abonnes: [mockSessionInfo.id]
      }]
    };
    themeService.getThemes.mockReturnValue(of(themesWithSubscriber));

    // Initialize component
    fixture = TestBed.createComponent(ThemeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    tick();

    // Verify only subscribed themes are shown
    expect(component.themes.length).toBe(1);
    expect(component.themes[0].abonnes).toContain(mockSessionInfo.id);
  }));

  it('should handle theme loading error', fakeAsync(() => {
    // Mock error response
    themeService.getThemes.mockReturnValue(throwError(() => new Error('Failed to load themes')));

    fixture.detectChanges();
    tick();

    expect(component.themes).toEqual([]);
  }));

  it('should handle subscription error', fakeAsync(() => {
    // Setup
    fixture.detectChanges();
    tick();

    // Mock subscription error
    themeService.subscribeTheme.mockReturnValue(throwError(() => new Error('Subscription failed')));

    // Attempt to subscribe
    component.onSubscribe(mockTheme.id);
    tick();

    expect(themeService.subscribeTheme).toHaveBeenCalledWith(mockTheme.id);
  }));

  it('should handle unsubscription error', fakeAsync(() => {
    // Setup
    fixture.detectChanges();
    tick();

    // Mock unsubscription error
    themeService.unsubscribeTheme.mockReturnValue(throwError(() => new Error('Unsubscription failed')));

    // Attempt to unsubscribe
    component.onUnsubscribe(mockTheme.id);
    tick();

    expect(themeService.unsubscribeTheme).toHaveBeenCalledWith(mockTheme.id);
  }));
});
});
