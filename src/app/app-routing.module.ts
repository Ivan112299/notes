import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/components/auth/auth.component';
import { RegistrationComponent } from './layouts/auth/components/registration/registration.component';
import { MainComponent } from './layouts/main/components/main/main.component';
import { PageNotFoundComponent } from './layouts/main/components/page-not-found/page-not-found.component';
import { BoardComponent } from './layouts/main/components/board/board.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'main', pathMatch: 'full'
  },
  {
    path: 'auth', component: AuthComponent
  },
  {
    path: 'registration', component: RegistrationComponent
  },
  {
    path: 'main', component: MainComponent, children: [
      {
        path: ':id', component: BoardComponent
      }
    ]
  },
  { 
    path: '**', component: PageNotFoundComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
