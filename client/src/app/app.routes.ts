import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { UsersPageComponent } from './users-page/users-page.component';

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/home" },
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "profile", component: ProfileComponent },
  { path: "settings", component: SettingsComponent },
  { path: "usersPage", component: UsersPageComponent },
  { path: "**", redirectTo: "/home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
