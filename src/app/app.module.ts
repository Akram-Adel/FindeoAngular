import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule }    from '@angular/common/http';

import { LanguageService } from './services/language.service';
import { CompareService } from './services/compare.service';
import { ApiService } from './services/api.service';

import { ReversePipe } from './pipes/reverse.pipe';
import { LimitPipe } from './pipes/limit.pipe';
import { TranslatePipe } from './pipes/translate.pipe';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/blocks/header/header.component';
import { FooterComponent } from './components/blocks/footer/footer.component';
import { CompareComponent } from './components/blocks/compare/compare.component';
import { MainComponent } from './components/main/main.component';
import { ListingsComponent } from './components/listings/listings.component';
import { SinglePropertyComponent } from './components/single-property/single-property.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AgentsComponent } from './components/agents/agents.component';
import { AgentPageComponent } from './components/agent-page/agent-page.component';
import { ComparePropertiesComponent } from './components/compare-properties/compare-properties.component';
import { SubmitPropertyComponent } from './components/submit-property/submit-property.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { ContactComponent } from './components/contact/contact.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { LoginsComponent } from './components/logins/logins.component';
import { ErrHandlingService } from './services/err-handling.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CompareComponent,
    MainComponent,
    ListingsComponent,
    SinglePropertyComponent,
    ProfileComponent,
    BookmarksComponent,
    PropertiesComponent,
    ChangePasswordComponent,
    AgentsComponent,
    AgentPageComponent,
    ComparePropertiesComponent,
    SubmitPropertyComponent,
    BlogComponent,
    BlogPostComponent,
    ContactComponent,
    PricingComponent,
    ReversePipe,
    LimitPipe,
    TranslatePipe,
    LoginsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [LanguageService, CompareService, ErrHandlingService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
