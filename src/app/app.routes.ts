import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryComponent } from './pages/history/history.component';
import { PlayersComponent } from './pages/players/players.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from './guards/AuthGard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: 'players',
        component: PlayersComponent,
      },
      {
        path: 'player/:playerId',
        component: StatisticsComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
];
