import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { ActivatedRoute } from '@angular/router';
import { HeroStatistic, PlayerStatistics } from '../../models/Statistic';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';

import { round } from 'lodash';

const quotes = [
  'Chưa tài đâu!!!',
  'Cũng ghê đấy!!!',
  'Tạm được!!!',
  'Cũng thường thôi!!!',
];

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [DatePipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly datePipe = inject(DatePipe);
  id: string | number | null = null;
  quote = '';
  statistic: PlayerStatistics | null = null;
  mannerChartData: any;
  mannerChartOptions: any;
  statChartData: any;
  statChartOptions: any;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.quote = quotes[Math.floor(Math.random() * quotes.length)];
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('playerId'); // Get 'id' parameter
    });
    if (this.id) {
      const data = await this.supabase.getStatisticOfPlayer(+this.id);
      console.log({ data });

      if (data[0]) {
        // Map data into PlayerStatistics format
        this.statistic = {
          player_id: data[0].player_id,
          player_name: data[0].player_name,
          total_games: data[0].total_games,
          total_wins: data[0].total_wins,
          total_losts: data[0].total_games - data[0].total_wins,
          win_rate: `${round(
            (data[0].total_wins / data[0].total_games) * 100,
            1
          )}%`,
          hero_statistics: data[0].hero_statistics as HeroStatistic[],
          most_hero: data[0].hero_statistics.reduce(
            (max: any, hero: any) =>
              hero.games_played > max.games_played ? hero : max,
            data[0].hero_statistics[0]
          ),
          most_lost_hero: data[0].most_lost_hero,
          most_won_hero: data[0].most_won_hero,
        };
        this.prepareStatChartData(this.statistic);
        this.prepareStatChartOptions();
      }

      const mannerHistory = await this.supabase.getPlayerMannerHistory(
        +this.id
      );
      this.prepareMannerChartData(mannerHistory);
      this.prepareMannerChartOptions();
    }
  }
  prepareMannerChartData(data: any[]): void {
    this.mannerChartData = {
      labels: data.map((row) =>
        this.datePipe.transform(row.created_at, 'dd-MM-yy')
      ), // X-axis labels: session dates
      datasets: [
        {
          label: 'Điểm',
          data: data.map((row) => row.manner), // Y-axis values: manner scores
          borderColor: '#42A5F5', // Line color
          fill: false, // Don't fill the area below the line
          tension: 0.4, // Smooth curves
        },
      ],
    };
  }

  prepareMannerChartOptions(): void {
    this.mannerChartOptions = {
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: false,
            text: 'Ngày thi đấu',
          },
        },
        y: {
          title: {
            display: false,
            text: 'Manner',
          },
          ticks: {
            stepSize: 1, // Increment values by 1
          },
        },
      },
    };
  }
  prepareStatChartData(stats: any): void {
    this.statChartData = {
      labels: ['Thắng', 'Thua'], // Labels for pie slices
      datasets: [
        {
          data: [stats.total_wins, stats.total_losts], // Values for the chart
          backgroundColor: ['#204887', '#FFA726'], // Colors for wins and losses
          hoverBackgroundColor: ['#183462', '#FB8C00'], // Colors on hover
        },
      ],
    };
  }

  prepareStatChartOptions(): void {
    this.statChartOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'top', // Position the legend
          labels: {
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              const value = tooltipItem.raw;
              const total = tooltipItem.chart.data.datasets[0].data.reduce(
                (acc: number, curr: number) => acc + curr,
                0
              );
              const percentage = ((value / total) * 100).toFixed(2);
              return `${tooltipItem.label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    };
  }
}
