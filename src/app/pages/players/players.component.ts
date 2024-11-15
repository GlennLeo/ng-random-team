import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Player } from '../../models/Player';
import { mean } from 'lodash';
import { RouterLink } from '@angular/router';

interface PlayerWithScore extends Player {
  score: number;
}

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersComponent implements OnInit {
  players: PlayerWithScore[] = [];
  private readonly supabase = inject(SupabaseService);
  constructor() {}

  async ngOnInit(): Promise<void> {
    try {
      const { data } = await this.supabase.getPlayers();
      if (data) {
        this.players = data
          .filter((player) => player.name !== 'Phantom')
          .map((player) => ({
            ...player,
            score: mean(player.scores),
          }));
      }
    } catch (error) {}
  }
}
