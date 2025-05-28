import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { CreateGroupBoxComponent } from './modalBoxes/create-group-box/create-group-box.component';
import { JoinGroupBoxComponent } from './modalBoxes/join-group-box/join-group-box.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { GroupchatListComponent } from './groupchat/groupchat-list/groupchat-list.component';
import { ChattingPageComponent } from './groupchat/chatting-page/chatting-page.component';
import { Sidebar2Component } from './layout/sidebar2/sidebar2.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ChatFileUploadComponent } from './groupchat/chat-file-upload/chat-file-upload.component';
import { GitTestingComponent } from './git-testing/git-testing.component';



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    CreateGroupBoxComponent,
    JoinGroupBoxComponent,
    GroupchatListComponent,
    ChattingPageComponent,
    Sidebar2Component,
    ChatFileUploadComponent,
    GitTestingComponent
    ChatFileUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // Make sure this is before ToastrModule
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      progressBar: true,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
