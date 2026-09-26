import { Routes } from '@angular/router';

import { Home } from '../app/components/home/home';
import { Login } from '../app/components/login/login';

export const routes: Routes = [
    { path: 'Login', component: Login },
    { path: 'Home', component: Home }
];
