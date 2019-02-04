import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OverviewPanelComponent } from './components/overview-panel/overview-panel.component';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path:'translate/:sourcelang/:targetlang/:search', component: HomeComponent},
  {path:'vertaal/:sourcelang/:targetlang/:search', component: HomeComponent},
  {path:'traduire/:sourcelang/:targetlang/:search', component: HomeComponent},
  {path:'ubersetzung/:sourcelang/:targetlang/:search', component: HomeComponent},
  {path:'traduccion/:sourcelang/:targetlang/:search', component: HomeComponent},
  {path:'traduzzione/:sourcelang/:targetlang/:search', component: HomeComponent},

  //{ path: '', loadChildren: './welcome/welcome.module#WelcomeModule' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent

  ],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
