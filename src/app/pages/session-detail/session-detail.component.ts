import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { BoardSession } from '../../models/Board';
import { BoardColumnComponent } from '../../shared/board-column/board-column.component';
import { formatDate, getDuration } from '../../lib/utils';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, BoardColumnComponent, ImageModule],
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.css',
})
export class SessionDetailComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly route = inject(ActivatedRoute);
  id: string | number | null = null;
  boardSession: BoardSession | null = null;
  timelines: { itemImageSrc: string; thumbnailImageSrc: string }[] | undefined;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('sessionId'); // Get 'id' parameter
    });
    if (this.id) {
      const data = (await this.supabase.getSessionDetailById(+this.id)) as any;
      console.log(data);
      if (data) {
        this.boardSession = {
          id: data.id,
          team: data.player_session.map((playerSession: any) => ({
            id: playerSession.player_id,
            name: playerSession.player.name,
            hero: playerSession.hero,
            elo: playerSession.player.elo,
            team: +playerSession.team,
          })),
          winningTeam: data.winning_team,
          created_at: formatDate(data.created_at),
          duration: getDuration(data.created_at, data.updated_at),
          dealer: data.dealer,
          timelines: data.timelines,
        };
        this.timelines =
          this.boardSession.timelines?.map((item) => ({
            itemImageSrc: item,
            thumbnailImageSrc: item,
          })) ?? [];
      }
    }
    console.log(this.boardSession);
  }

  getMemberTeam1(boardSession: BoardSession) {
    return boardSession.team.filter(
      (member) => +member.team === 1 && member.name !== 'Phantom'
    );
  }

  getMemberTeam2(boardSession: BoardSession) {
    return boardSession.team.filter(
      (member) => +member.team === 2 && member.name !== 'Phantom'
    );
  }
  getWinningTeam(boardSession: BoardSession) {
    return boardSession.winningTeam;
  }
}
