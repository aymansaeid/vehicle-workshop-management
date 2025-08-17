// src/app/guards/auth.guard.ts - SUPER SIMPLE
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loggedIn = localStorage.getItem('loggedIn');

  if (loggedIn === 'true') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
