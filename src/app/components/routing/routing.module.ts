import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SurveyComponent } from '../survey/survey.component';

const routes: Routes = [  
  { path: '',  redirectTo: 'home', pathMatch: 'full' },
  { path: 'survey', component: SurveyComponent }, 
  {path:'home', component: HomeComponent}
  
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) 
  ],
  exports: [RouterModule],
  declarations: []
})
export class RoutingModule { }
