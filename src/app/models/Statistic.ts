export interface HeroStatistic {
  hero: string;
  games_played: number;
  wins: number;
}

export interface PlayerStatistics {
  player_id: number;
  player_name: string;
  total_games: number;
  total_wins: number;
  total_losts: number;
  win_rate: string;
  hero_statistics: HeroStatistic[];
  most_hero: HeroStatistic;
  most_lost_hero: {
    hero: string;
    losses: number;
  };
  most_won_hero: {
    hero: string;
    wins: number;
  };
}
