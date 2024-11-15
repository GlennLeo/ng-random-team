import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryComponent } from './pages/history/history.component';
import { PlayersComponent } from './pages/players/players.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
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
        path: 'statistics/:playerId',
        component: StatisticsComponent,
      },
    ],
  },
];
