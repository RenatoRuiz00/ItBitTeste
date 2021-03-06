import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { HomeComponent } from './components/home.component';
import { UsuarioService } from './Service/usuario.service';
import { SexoService } from './Service/sexo.service';
import { UsuarioComponent } from './components/usuario.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, HttpModule, routing, Ng2Bs3ModalModule],
    declarations: [AppComponent, HomeComponent, UsuarioComponent],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, UsuarioService,SexoService],
    bootstrap: [AppComponent]
})

export class AppModule { }