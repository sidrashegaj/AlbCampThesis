import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { AuthInterceptor } from './auth-interceptor.service';

describe('AuthInterceptor', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: spy },
      ],
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should add Authorization header when token is available', () => {
    const mockToken = 'mock-token';
    authServiceSpy.getToken.and.returnValue(mockToken);

    const mockRequest = new HttpRequest('GET', '/api/test');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
        return of(req as any);  // Return an observable for the mock request
      },
    };

    AuthInterceptor(mockRequest, next.handle.bind(next));
  });

  it('should not add Authorization header when token is not available', () => {
    authServiceSpy.getToken.and.returnValue(null);

    const mockRequest = new HttpRequest('GET', '/api/test');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of(req as any);  // Return an observable for the mock request
      },
    };

    AuthInterceptor(mockRequest, next.handle.bind(next));
  });
});