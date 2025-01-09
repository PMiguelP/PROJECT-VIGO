import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { UnauthenticatedGuard } from './services/guards/unauthenticated-guard.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [UnauthenticatedGuard],
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/sign-up/sign-up.module').then((m) => m.SignUpPageModule),
    canActivate: [UnauthenticatedGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'set-profile-picture',
    loadChildren: () =>
      import('./pages/set-profile-picture/set-profile-picture.module').then(
        (m) => m.SetProfilePicturePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'checklist',
    loadChildren: () =>
      import('./pages/checklist/checklist.module').then(
        (m) => m.ChecklistPageModule
      ),
  },
  {
    path: 'itinerary-form',
    loadChildren: () =>
      import('./pages/itinerary-form/itinerary-form.module').then(
        (m) => m.ItineraryFormPageModule
      ),
  },
  {
    path: 'my-itinerary',
    loadChildren: () =>
      import('./pages/my-itinerary/my-itinerary.module').then(
        (m) => m.MyItineraryPageModule
      ),
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./pages/events/events.module').then((m) => m.EventsPageModule),
  },
  {
    path: 'schedule',
    loadChildren: () =>
      import('./pages/schedule/schedule.module').then(
        (m) => m.SchedulePageModule
      ),
  },
  {
    path: 'transportation-arrangement',
    loadChildren: () =>
      import(
        './pages/transportation-arrangement/transportation-arrangement.module'
      ).then((m) => m.TransportationArrangementPageModule),
  },
  {
    path: 'travel-arrangement',
    loadChildren: () =>
      import('./pages/travel-arrangement/travel-arrangement.module').then(
        (m) => m.TravelArrangementPageModule
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
  {
    path: 'event-participants/:id',
    loadChildren: () =>
      import('./pages/event-participants/event-participants.module').then(
        (m) => m.EventParticipantsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
