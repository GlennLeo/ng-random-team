import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { ActivatedRoute } from '@angular/router';
import { HeroStatistic, PlayerStatistics } from '../../models/Statistic';
import { CommonModule } from '@angular/common';

const quotes = [
  'Chưa tài đâu!!!',
  'Cũng ghê đấy!!!',
  'Tạm được!!!',
  'CŨng thường thôi!!!',
];

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly route = inject(ActivatedRoute);
  id: string | number | null = null;
  quote = '';
  statistic: PlayerStatistics | null = null;
  constructor() {}

  async ngOnInit(): Promise<void> {
    this.quote = quotes[Math.floor(Math.random() * quotes.length)];
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('playerId'); // Get 'id' parameter
    });
    if (this.id) {
      const data = await this.supabase.getStatisticOfPlayer(+this.id);
      if (data[0]) {
        // Map data into PlayerStatistics format
        this.statistic = {
          player_id: data[0].player_id,
          player_name: data[0].player_name,
          total_games: data[0].total_games,
          total_wins: data[0].total_wins,
          total_losts: data[0].total_games - data[0].total_wins,
          win_rate: `${(data[0].total_wins / data[0].total_games) * 100}%`,
          hero_statistics: data[0].hero_statistics as HeroStatistic[],
          most_hero: data[0].hero_statistics.reduce(
            (max: any, hero: any) =>
              hero.games_played > max.games_played ? hero : max,
            data[0].hero_statistics[0]
          ),
        };
      }
    }
  }
}
