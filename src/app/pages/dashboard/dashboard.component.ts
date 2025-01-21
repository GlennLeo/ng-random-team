import { Component, inject, OnInit } from '@angular/core';
import { Attendee, TeamMember } from '../../models/Player';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { find, round } from 'lodash';
import { PlayersService } from '../../services/players.service';
import { NgButtonComponent } from '../../shared/button/ng-button/ng-button.component';
import {
  calculatePlayerPoints,
  syncAttendance,
  updateAttendance,
} from '../../lib/utils';
import { TeamBoardComponent } from '../../shared/team-board/team-board.component';
import {
  heroes,
  membersPlaceholder11,
  membersPlaceholder22,
  membersPlaceholder33,
  membersPlaceholder44,
} from '../../lib/constant';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TimelineUploadComponent } from '../../shared/timeline-upload/timeline-upload.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TeamBoardComponent,
    FormsModule,
    CommonModule,
    NgButtonComponent,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TimelineUploadComponent,
  ],
  providers: [ConfirmationService, MessageService],
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
  manualMode = false;
  manualHeroPick = false;
  done = false;
  lockDialogVisible = false;
  timelineDialogVisible = false;

  private readonly supabase = inject(SupabaseService);
  private readonly playerService = inject(PlayersService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private tableInsertSub: Subscription | null = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.supabase.listenToTableChanges('session');
    this.tableInsertSub = this.supabase.tableInsert$.subscribe(async (data) => {
      console.log('New data:', data);
      if (data.eventType === 'DELETE') {
        this.memberList = [];
        this.sessionId = 0;
        this.sessionStatus = '';
        this.winningTeam = 0;
        this.done = false;
        this.lockDialogVisible = false;
        this.timelineDialogVisible = false;
      }
      if (data.new.status === 'confirmed') {
        await this.initialize();
      }
    });
    await this.initialize();
  }

  ngOnDestroy(): void {
    if (this.tableInsertSub) {
      this.tableInsertSub.unsubscribe();
    }
    this.supabase.unsubscribe();
  }

  async initialize() {
    await this.getPlayers();
    const latestBoard = (await this.supabase.getLastedBoard()) as any[];
    const statistics = await this.supabase.getPlayersByIdsWithStatistic(
      latestBoard.map((item) => item.player_id.id)
    );
    if (latestBoard.length) {
      this.memberList = latestBoard.map((item) => ({
        id: item.player_id.id,
        name: item.player_id.name,
        hero: item.hero,
        elo: item.player_id.elo,
        eloWithHero: round(
          item.player_id.elo *
            (heroes.find((hero) => hero.name === item.hero)?.rate || 1),
          1
        ),
        team: +item.team,
        total_wins: statistics.find(
          (stat: any) => stat.player_id === item.player_id.id
        ).total_wins,
        total_losts: statistics.find(
          (stat: any) => stat.player_id === item.player_id.id
        ).total_losses,
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
      console.log(this.memberList);
      this.teamSize = this.memberList.length;
      this.attendance = updateAttendance(this.attendance, this.memberList);
      this.sessionId = latestBoard[0]?.session_id.id;
      this.sessionStatus = latestBoard[0]?.session_id.status;
    } else {
      // this.getFromLocalData();
    }
  }

  private async getFromLocalData() {
    const sessionId = localStorage.getItem('sessionId');
    const memberList = localStorage.getItem('memberList');
    if (sessionId && memberList) {
      const sessionInfo = await this.supabase.getBoardBySessionId(+sessionId);
      console.log({ sessionInfo });
      if (!sessionInfo.length) {
        this.sessionId = +sessionId;
        this.memberList = JSON.parse(memberList);
        this.attendance = updateAttendance(this.attendance, this.memberList);
      }
    }
  }

  getAttendance() {
    return this.attendance.filter((a) => a.checked);
  }

  async getPlayers() {
    try {
      const data = await this.supabase.getAllPlayersWithStatistic();
      if (data) {
        this.attendance = data.map((player: any) => ({
          id: player.player_id,
          hero: '',
          name: player.player_name,
          elo: player.elo,
          team: 0,
          total_wins: player.total_wins,
          total_losts: player.total_losses,
          checked: false,
          win_rate:
            !player.total_wins || !player.total_games
              ? 0
              : round((player.total_wins / player.total_games) * 100, 1),
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
  totalMembers(): number {
    const selectedCount = this.memberList.filter(
      (player) => !!player.hero
    ).length;
    return selectedCount;
  }

  async onSubmit() {}

  getMemberTeam1() {
    return this.manualMode
      ? this.memberList.filter((mem) => mem.team === 1)
      : this.memberList.filter(
          (mem) => mem.team === 1 && mem.name !== 'Phantom'
        );
  }

  getMemberTeam2() {
    return this.manualMode
      ? this.memberList.filter((mem) => mem.team === 2)
      : this.memberList.filter(
          (mem) => mem.team === 2 && mem.name !== 'Phantom'
        );
  }

  getTotalReadyMembers() {
    return this.manualMode
      ? this.getMemberTeam1().filter((player) => player.name).length +
          this.getMemberTeam2().filter((player) => player.name).length
      : this.getMemberTeam1().length + this.getMemberTeam2().length;
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
  getTeam1EloWithHero() {
    return round(
      this.getMemberTeam1().reduce(
        (acc, member) => acc + (member.eloWithHero ?? member.elo),
        0
      ),
      1
    );
  }
  getTeam2EloWithHero() {
    return round(
      this.getMemberTeam2().reduce(
        (acc, member) => acc + (member.eloWithHero ?? member.elo),
        0
      ),
      1
    );
  }
  toggleManualMode(event: any) {
    this.manualMode = event.target.checked;
    this.attendance = this.attendance.map((player) => ({
      ...player,
      checked: false,
    }));
    if (this.manualMode) {
      switch (this.teamSize) {
        case 8:
          this.memberList = membersPlaceholder44;
          break;
        case 6:
          this.memberList = membersPlaceholder33;
          break;
        case 4:
          this.memberList = membersPlaceholder22;
          break;
        case 2:
          this.memberList = membersPlaceholder11;
          break;
        default:
          break;
      }
      this.attendance = updateAttendance(this.attendance, this.memberList);
    } else {
      this.memberList = [];
    }
  }

  onChangeTeamSize(event: any) {
    this.teamSize = +event.target.value;
    this.attendance = this.attendance.map((p) => ({
      ...p,
      checked: false,
    }));
    if (this.manualMode) {
      switch (this.teamSize) {
        case 8:
          this.memberList = membersPlaceholder44;
          break;
        case 6:
          this.memberList = membersPlaceholder33;
          break;
        case 4:
          this.memberList = membersPlaceholder22;
          break;
        case 2:
          this.memberList = membersPlaceholder11;
          break;
        default:
          break;
      }
    }
  }

  async onGenTeam() {
    this.done = false;
    const statistics = await this.supabase.getAllPlayersWithStatistic();
    this.attendance = syncAttendance(this.attendance, statistics);
    const data = await this.playerService.generateTeams(
      this.getAttendance(),
      this.manualMode
    );

    if (statistics.length) {
      this.memberList = data.team.map((item) => ({
        ...item,
        elo: find(statistics, (stat: any) => stat.player_id === item.id).elo,
        total_wins: find(statistics, (stat: any) => stat.player_id === item.id)
          .total_wins,
        total_losts: statistics.find((stat: any) => stat.player_id === item.id)
          .total_losses,
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
    // Delete the last draft session if any
    await this.supabase.deleteDraftSession(this.sessionId);
    // Create new session
    const session = await this.supabase.createSession();
    this.sessionId = session.id;
    localStorage.setItem('sessionId', session.id);
    localStorage.setItem('memberList', JSON.stringify(this.memberList));
    this.showLockModal();
  }

  async onGenHero() {
    this.done = false;
    const data = await this.playerService.generateHeroes(
      this.memberList,
      this.manualMode
    );
    const statistics = await this.supabase.getPlayersByIdsWithStatistic(
      data.team.map((item) => item.id)
    );
    if (statistics.length) {
      this.memberList = data.team.map((item) => ({
        ...item,
        elo: find(statistics, (stat: any) => stat.player_id === item.id).elo,
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

    // Delete the last draft session if any
    await this.supabase.deleteDraftSession(this.sessionId);

    // Create new session
    const session = await this.supabase.createSession();
    this.sessionId = session.id;
    localStorage.setItem('sessionId', session.id);
    localStorage.setItem('memberList', JSON.stringify(this.memberList));
    this.showLockModal();
  }

  async onStart() {
    const isExist = await this.supabase.checkExistSessionId(this.sessionId);
    if (!isExist) {
      // create new session
      const session = await this.supabase.createSession();
      this.sessionId = session.id;
      localStorage.setItem('sessionId', session.id);
    }
    // update session to confirmed
    await this.supabase.updateSessionStatus(this.sessionId, 'confirmed');

    this.sessionStatus = 'confirmed';
    // create player session
    await this.supabase.createPlayerSession(this.sessionId, this.memberList);
  }
  async onFinish() {
    // update session to finished and winning team
    await this.supabase.updateSessionStatus(this.sessionId, 'finished');
    this.sessionStatus = 'finished';
    this.showTimelineModal();
    localStorage.removeItem('sessionId');
    localStorage.removeItem('memberList');
  }
  async updateWinningTeam() {
    // Update winning team
    await this.supabase.updateSessionWinningTeam(
      this.sessionId,
      this.winningTeam
    );
    // Update elo only if no Phantom
    if (this.memberList.every((member) => member.name !== 'Phantom')) {
      const newPlayerList = calculatePlayerPoints(
        this.memberList.filter((player) => player.name !== 'Phantom'),
        this.winningTeam
      );
      await this.supabase.batchUpdatePlayers(newPlayerList);
      this.memberList = newPlayerList;
    }
    // Send notification result
    await this.playerService.sendWebhookMessageForSessionResult(
      this.winningTeam,
      this.sessionId
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

  checkAnyHasNoHero() {
    return this.memberList.some((player) => !player.hero);
  }

  getCompetitionCategoryTitle() {
    let title = '';
    switch (this.teamSize) {
      case 8:
        title = '4 vs 4';
        break;
      case 6:
        title = '3 vs 3';
        break;
      case 4:
        title = '2 vs 2';
        break;
      case 2:
        title = 'Solo';
        break;
      default:
        break;
    }
    return title;
  }

  showLockModal() {
    this.lockDialogVisible = true;
  }

  closeLockModal() {
    this.lockDialogVisible = false;
  }

  showTimelineModal() {
    this.timelineDialogVisible = true;
  }

  closeTimelineModal() {
    this.timelineDialogVisible = false;
  }

  async startAndCloseModal() {
    await this.onStart();
    this.closeLockModal();
  }

  async cancelSession() {
    await this.supabase.cancelSession(this.sessionId);
    this.done = false;
    this.sessionStatus = '';
    this.sessionId = 0;
  }

  onConfirmRemoveSession(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc muốn huỷ trận đấu này?',
      header: 'Xác nhận huỷ',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: async () => {
        await this.cancelSession();
        this.done = true;
        this.messageService.add({
          severity: 'info',
          detail: 'Đã huỷ trận đấu',
        });
      },
      reject: () => {},
    });
  }
}
