import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { UsuarioComponent } from './components/usuario.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'usuario', component: UsuarioComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);