import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { jwtInterceptor } from './jwt.interceptor';
import { SessionService } from '../services/session.service';

describe('jwtInterceptor', () => {
  let mockSessionService: jest.Mocked<SessionService>;
  let mockRequest: HttpRequest<unknown>;
  let mockHandler: jest.MockedFunction<HttpHandlerFn>;

  beforeEach(() => {
    // Create mock SessionService
    mockSessionService = {
      isLogged: false,
      sessionInformation: null,
    } as jest.Mocked<any>;

    // Create mock request
    mockRequest = new HttpRequest('GET', '/api/test');

    // Create mock handler
    mockHandler = jest.fn().mockReturnValue(new Promise(() => {}));

    // Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    });
  });

  it('should be created', () => {
    TestBed.runInInjectionContext(() => {
      expect(jwtInterceptor).toBeTruthy();
    });
  });

  it('should add Authorization header when user is logged in', () => {
    TestBed.runInInjectionContext(() => {
      // Arrange
      const testToken = 'test-token';
      mockSessionService.isLogged = true;
      mockSessionService.sessionInformation = { token: testToken } as any;

      // Act
      jwtInterceptor(mockRequest, mockHandler);

      // Assert
      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            get: expect.any(Function),
          }),
        })
      );

      const modifiedRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
      expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    });
  });

  it('should not add Authorization header when user is not logged in', () => {
    TestBed.runInInjectionContext(() => {
      // Arrange
      mockSessionService.isLogged = false;
      mockSessionService.sessionInformation = undefined;

      // Act
      jwtInterceptor(mockRequest, mockHandler);

      // Assert
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      const modifiedRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
      expect(modifiedRequest.headers.has('Authorization')).toBeFalsy();
    });
  });

  it('should preserve existing headers when adding Authorization', () => {
    TestBed.runInInjectionContext(() => {
      // Arrange
      const testToken = 'test-token';
      mockSessionService.isLogged = true;
      mockSessionService.sessionInformation = { token: testToken } as any;

      mockRequest = new HttpRequest('GET', '/api/test', null, {
        headers: new HttpRequest('GET', '').headers.set('Content-Type', 'application/json')
      });

      // Act
      jwtInterceptor(mockRequest, mockHandler);

      // Assert
      const modifiedRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
      expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
      expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    });
  });

  it('should call next handler with the request', () => {
    TestBed.runInInjectionContext(() => {
      // Act
      jwtInterceptor(mockRequest, mockHandler);

      // Assert
      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(expect.any(HttpRequest));
    });
  });
});
