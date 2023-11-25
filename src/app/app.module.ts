import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './layouts/auth/components/auth/auth.component';
import { RegistrationComponent } from './layouts/auth/components/registration/registration.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './shared/services/auth.service';
import { MainComponent } from './layouts/main/components/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './layouts/main/components/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { BoardsService } from './shared/services/boards.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateBoardComponent } from './layouts/main/components/create-board/create-board.component';
import { BoardComponent } from './layouts/main/components/board/board.component';
import { PageNotFoundComponent } from './layouts/main/components/page-not-found/page-not-found.component';
import { CreateCardComponent } from './layouts/main/components/create-card/create-card.component';
import { CardsService } from './shared/services/cards.service';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { CardComponent } from './layouts/main/components/card/card.component';
import { MatCardModule } from '@angular/material/card';
import { MobxAngularModule } from 'mobx-angular';
import { BoardManageComponent } from './layouts/main/components/board-manage/board-manage.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegistrationComponent,
    MainComponent,
    HeaderComponent,
    CreateBoardComponent,
    BoardComponent,
    PageNotFoundComponent,
    CreateCardComponent,
    CardComponent,
    BoardManageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MobxAngularModule,
    MatIconModule,
    MatSidenavModule
  ],
  providers: [
    AuthService,
    BoardsService,
    CardsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

