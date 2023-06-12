import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserModel } from '../models/user';
import { CurrentUserService } from '../services/current-user.service';

export const currentUserResolver: ResolveFn<UserModel> = (route, state) => {
  return inject(CurrentUserService).getCurrentUser();
};
