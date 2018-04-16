import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
  { path: ':lng/main', component: MainComponent },
  { path: ':lng/listings/:area', component: ListingsComponent },
  { path: ':lng/single-property/:id', component: SinglePropertyComponent },
  { path: ':lng/profile', component: ProfileComponent },
  { path: ':lng/bookmarks', component: BookmarksComponent },
  { path: ':lng/properties', component: PropertiesComponent },
  { path: ':lng/change-password', component: ChangePasswordComponent },
  { path: ':lng/agents', component: AgentsComponent },
  { path: ':lng/agent-page/:id', component: AgentPageComponent },
  { path: ':lng/compare-properties', component: ComparePropertiesComponent },
  { path: ':lng/submit-property', component: SubmitPropertyComponent },
  { path: ':lng/blog-post/:id', component: BlogPostComponent },
  { path: ':lng/blog', component: BlogComponent },
  { path: ':lng/contact', component: ContactComponent },
  { path: ':lng/pricing', component: PricingComponent },
  { path: ':lng/login', component: LoginsComponent},
  { path: '', redirectTo: 'ar/main', pathMatch: 'full' },
  { path: '**', redirectTo: 'ar/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
