import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard],
    });
    authGuard = TestBed.inject(AuthGuard);  // Instanciamos el guardia
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });
});
