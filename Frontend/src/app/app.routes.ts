import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampgroundListComponent } from './components/campground-list/campground-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CampgroundDetailComponent } from './components/campground-detail/campground-detail.component';
import { AddCampgroundComponent } from './components/add-campground/add-campground.component';
import { AuthGuardService } from './services/auth-guard.service';
import { EditCampgroundComponent } from './components/edit-campground/edit-campground.component';
import { IndexComponent } from './components/index/index.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './admin.guard';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminCampgroundsComponent } from './components/admin-campgrounds/admin-campgrounds.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { BookingComponent } from './components/booking/booking.component';
import { AdminBookingsComponent } from './components/admin-bookings/admin-bookings.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsComponent } from './pages/terms/terms.component';

export const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'campgrounds', component: CampgroundListComponent },
  { path: 'campgrounds/new', component: AddCampgroundComponent, canActivate: [AuthGuardService] },
  { path: 'campgrounds/:id', component: CampgroundDetailComponent, runGuardsAndResolvers: 'always' },
  { path: 'campgrounds/:id/edit', component: EditCampgroundComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard] },
  { path: 'admin/campgrounds', component: AdminCampgroundsComponent, canActivate: [adminGuard] },
  { path: 'admin/reviews', component: AdminReviewsComponent, canActivate: [adminGuard] },
  { path: 'campgrounds/:id/book', component: BookingComponent },
  { path: 'admin/bookings', component: AdminBookingsComponent, canActivate: [adminGuard] },
   { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'campgrounds', component: CampgroundListComponent },
  { path: '**', redirectTo: '/campgrounds' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
