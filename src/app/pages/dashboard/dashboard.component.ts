import { Component, inject, OnInit } from '@angular/core';
import { BoardColumnComponent } from '../../shared/board-column/board-column.component';
import { Attendee, TeamMember } from '../../models/Player';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { find, round } from 'lodash';
import { PlayersService } from '../../services/players.service';
import { NgButtonComponent } from '../../shared/button/ng-button/ng-button.component';
import { calculatePlayerPoints, updateAttendance } from '../../lib/utils';
import { TeamBoardComponent } from '../../shared/team-board/team-board.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TeamBoardComponent, FormsModule, CommonModule, NgButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  attendance: Attendee[] = [];
  memberList: TeamMember[] = [];
  teamSize = 8;
  sessionId = 0;
  sessionStatus = '';
  winningTeam = 0;
  done = false;

  private readonly supabase = inject(SupabaseService);
  private readonly playerService = inject(PlayersService);

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.getPlayers();
    const latestBoard = (await this.supabase.getLastedBoard()) as any[];
    const statistics = await this.supabase.getPlayersByIdsWithStatistic(
      this.memberList.map((item) => item.id)
    );
    console.log({ statistics });
    if (latestBoard.length) {
      this.memberList = latestBoard.map((item) => ({
        id: item.player_id.id,
        name: item.player_id.name,
        hero: item.hero,
        elo: item.player_id.elo,
        team: +item.team,
        total_wins: statistics.find(
          (stat: any) => stat.player_id === item.player_id.id
        ).total_wins,
        total_losts: statistics.find(
          (stat: any) => stat.player_id === item.player_id.id
        ).total_losts,
        win_rate:
          !statistics.find((stat: any) => stat.player_id === item.player_id.id)
            .total_wins ||
          !statistics.find((stat: any) => stat.player_id === item.player_id.id)
            .total_games
            ? 0
            : round(
                (statistics.find(
                  (stat: any) => stat.player_id === item.player_id.id
                ).total_wins /
                  statistics.find(
                    (stat: any) => stat.player_id === item.player_id.id
                  ).total_games) *
                  100,
                1
              ),
      }));
      this.attendance = updateAttendance(this.attendance, this.memberList);
      this.sessionId = latestBoard[0]?.session_id.id;
      this.sessionStatus = latestBoard[0]?.session_id.status;
    }
  }

  getAttendance() {
    return this.attendance.filter((a) => a.checked);
  }

  async getPlayers() {
    try {
      const { data } = await this.supabase.getPlayers();
      if (data) {
        this.attendance = data.map((item) => ({
          ...item,
          checked: false,
          elo: item.elo,
        }));
      }
    } catch (error) {}
  }

  isDisabled(attendee: Attendee): boolean {
    return this.totalAttendees() >= this.teamSize && !attendee.checked;
  }

  totalAttendees(): number {
    const selectedCount = this.getAttendance().length;
    return selectedCount;
  }

  async onSubmit() {}

  getMemberTeam1() {
    return this.memberList.filter(
      (mem) => mem.team === 1 && mem.name !== 'Phantom'
    );
  }

  getMemberTeam2() {
    return this.memberList.filter(
      (mem) => mem.team === 2 && mem.name !== 'Phantom'
    );
  }
  getTeam1Elo() {
    return round(
      this.getMemberTeam1().reduce((acc, member) => acc + member.elo, 0),
      1
    );
  }
  getTeam2Elo() {
    return round(
      this.getMemberTeam2().reduce((acc, member) => acc + member.elo, 0),
      1
    );
  }

  async onGenTeam() {
    this.done = false;
    const data = await this.playerService.generateTeams(this.getAttendance());
    const statistics = await this.supabase.getPlayersByIdsWithStatistic(
      data.team.map((item) => item.id)
    );
    if (statistics.length) {
      this.memberList = data.team.map((item) => ({
        ...item,
        total_wins: find(statistics, (stat: any) => stat.player_id === item.id)
          .total_wins,
        total_losts: statistics.find(
          (stat: any) => +stat.player_id === +item.id
        ).total_losses,
        win_rate:
          !find(statistics, (stat: any) => stat.player_id === item.id)
            .total_wins ||
          !find(statistics, (stat: any) => stat.player_id === item.id)
            .total_games
            ? 0
            : round(
                (statistics.find((stat: any) => stat.player_id === item.id)
                  .total_wins /
                  statistics.find((stat: any) => stat.player_id === item.id)
                    .total_games) *
                  100,
                1
              ),
      }));
    } else {
      this.memberList = data.team;
    }
    console.log(this.memberList);
    const session = await this.supabase.createSession();
    this.sessionId = session.id;
    localStorage.setItem('sessionId', session.id);
  }

  async onGenHero() {
    this.done = false;
    const data = await this.playerService.generateHeroes(this.memberList);
    const statistics = await this.supabase.getPlayersByIdsWithStatistic(
      data.team.map((item) => item.id)
    );
    if (statistics.length) {
      this.memberList = data.team.map((item) => ({
        ...item,
        total_wins: find(statistics, (stat: any) => stat.player_id === item.id)
          .total_wins,
        total_losts: statistics.find(
          (stat: any) => +stat.player_id === +item.id
        ).total_losses,
        win_rate:
          find(statistics, (stat: any) => +stat.player_id === +item.id)
            .total_wins ||
          find(statistics, (stat: any) => +stat.player_id === +item.id)
            .total_games
            ? 0
            : round(
                (statistics.find((stat: any) => +stat.player_id === +item.id)
                  .total_wins /
                  statistics.find((stat: any) => +stat.player_id === +item.id)
                    .total_games) *
                  100,
                1
              ),
      }));
    } else {
      this.memberList = data.team;
    }
    const session = await this.supabase.createSession();
    this.sessionId = session.id;
    localStorage.setItem('sessionId', session.id);
  }

  async onStart() {
    // update session to confirmed
    this.supabase.updateSessionStatus(this.sessionId, 'confirmed');

    this.sessionStatus = 'confirmed';
    // create player session
    this.supabase.createPlayerSession(this.sessionId, this.memberList);
  }
  async onFinish() {
    // update session to finished and winning team
    this.supabase.updateSessionStatus(this.sessionId, 'finished');
    this.sessionStatus = 'finished';
  }
  async updateWinningTeam() {
    // Update winning team
    await this.supabase.updateSessionWinningTeam(
      this.sessionId,
      this.winningTeam
    );
    // Update elo only if no Phantom
    if (this.memberList.some((member) => member.name !== 'Phantom')) {
      const newPlayerList = calculatePlayerPoints(
        this.memberList.filter((player) => player.name !== 'Phantom'),
        this.winningTeam
      );
      await this.supabase.batchUpdatePlayers(newPlayerList);
      this.memberList = newPlayerList;
    }
    // Send notification result
    await this.playerService.sendWebhookMessageForSessionResult(
      this.winningTeam
    );
    this.sessionStatus = '';
    this.done = true;
  }

  checkSessionLocked() {
    return (
      this.sessionStatus === 'confirmed' ||
      (this.sessionStatus === 'finished' && !this.done)
    );
  }
}
