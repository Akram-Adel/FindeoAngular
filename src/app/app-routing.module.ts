import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { ListingsComponent } from './components/listings/listings.component';
import { SinglePropertyComponent } from './components/single-property/single-property.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AgentComponent } from './components/agent/agent.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AgentsComponent } from './components/agents/agents.component';
import { AgentPageComponent } from './components/agent-page/agent-page.component';
import { ComparePropertiesComponent } from './components/compare-properties/compare-properties.component';
import { SubmitPropertyComponent } from './components/submit-property/submit-property.component';
import { EditPropertyComponent } from './components/edit-property/edit-property.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { ContactComponent } from './components/contact/contact.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { LoginsComponent } from './components/logins/logins.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MySearchesComponent } from './components/my-searches/my-searches.component';

const routes: Routes = [
  { path: ':lng/main', component: MainComponent, data: { depth: 1 } },
  { path: ':lng/listings/:serviceType', component: ListingsComponent, data: { depth: 2 } },
  { path: ':lng/single-property/:id', component: SinglePropertyComponent, data: { depth: 3 } },
  { path: ':lng/profile', component: ProfileComponent, data: { depth: 4 } },
  { path: ':lng/agent', component: AgentComponent, data: { depth: 19 } },
  { path: ':lng/bookmarks', component: BookmarksComponent, data: { depth: 5 } },
  { path: ':lng/properties', component: PropertiesComponent, data: { depth: 6 } },
  { path: ':lng/change-password', component: ChangePasswordComponent, data: { depth: 7 } },
  { path: ':lng/agents', component: AgentsComponent, data: { depth: 8 } },
  { path: ':lng/agent-page/:id', component: AgentPageComponent, data: { depth: 9 } },
  { path: ':lng/compare-properties', component: ComparePropertiesComponent, data: { depth: 10 } },
  { path: ':lng/submit-property', component: SubmitPropertyComponent, data: { depth: 11 } },
  { path: ':lng/edit-property/:id', component: EditPropertyComponent, data: { depth: 18 } },
  // { path: ':lng/blog-post/:id', component: BlogPostComponent, data: { depth: 12 } },
  // { path: ':lng/blog', component: BlogComponent, data: { depth: 13 } },
  { path: ':lng/contact', component: ContactComponent, data: { depth: 14 } },
  // { path: ':lng/pricing', component: PricingComponent, data: { depth: 15 } },
  { path: ':lng/login', component: LoginsComponent, data: { depth: 16 } },
  { path: ':lng/about', component: AboutUsComponent, data: { depth: 17 } },
  { path: ':lng/mySearches', component: MySearchesComponent, data: { depth: 20 } },
  { path: '', redirectTo: 'ar/main', pathMatch: 'full' },
  { path: '**', redirectTo: 'ar/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
