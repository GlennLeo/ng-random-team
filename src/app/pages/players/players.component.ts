import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Player } from '../../models/Player';
import { mean, round } from 'lodash';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

interface PlayerWithStats extends Player {
  total_games: number;
  total_wins: number;
  total_losses: number;
}

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [TableModule, InputIconModule, IconFieldModule, InputTextModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PlayersComponent implements OnInit {
  players: PlayerWithStats[] = [];
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  constructor() {}

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.supabase.getAllPlayersWithStatistic();
      if (data) {
        this.players = data
          .filter((player: any) => player.player_name !== 'Phantom')
          .map((player: any) => ({
            ...player,
            win_rate:
              !player.total_wins || !player.total_games
                ? 0
                : round((player.total_wins / player.total_games) * 100, 1),
          }));
      }
    } catch (error) {}
  }
  onRowSelect(event: any): void {
    const playerId = event.data.player_id;
    this.router.navigate(['/player', playerId]);
  }
}
