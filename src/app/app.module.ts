import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RoutingModule } from './components/routing/routing.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SurveyComponent } from './components/survey/survey.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import {DataService} from '../app/components/data.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SurveyComponent
    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule      
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
