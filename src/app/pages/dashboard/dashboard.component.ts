import { Component, inject, OnInit } from '@angular/core';
import { BoardColumnComponent } from '../../shared/board-column/board-column.component';
import { Attendee, TeamMember } from '../../models/Player';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { round } from 'lodash';
import { PlayersService } from '../../services/players.service';
import { NgButtonComponent } from '../../shared/button/ng-button/ng-button.component';
import { ClientDataService } from '../../services/data.service';
import { Civilization } from '../../models/Civilization';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BoardColumnComponent, FormsModule, CommonModule, NgButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  attendance: Attendee[] = [];
  memberList: TeamMember[] = [];
  civilizations: Civilization[] = [];
  teamSize = 8;
  sessionId = '';
  sessionStatus = '';
  winningTeam = 0;
  done = false;
  secret = '';

  private readonly playerService = inject(PlayersService);
  private readonly dataService = inject(ClientDataService);

  constructor() { }

  async ngOnInit(): Promise<void> {
    await this.getPlayers();
    this.civilizations = await this.dataService.getCivilizations();
  }

  getAttendance() {
    return this.attendance.filter((a) => a.checked);
  }

  async getPlayers() {
    try {
      const players = await this.dataService.getPlayers();
      if (players) {
        this.attendance = players.map((item) => ({
          ...item,
          checked: false
        }));
      }
    } catch (error) { }
  }

  isDisabled(attendee: Attendee): boolean {
    const selectedCount = this.getAttendance().length;
    return selectedCount >= this.teamSize && !attendee.checked;
  }

  totalAttendees(): number {
    const selectedCount = this.getAttendance().length;
    return selectedCount;
  }

  async onSubmit() { }

  getMemberTeam1() {
    return this.memberList.filter((mem) => mem.team === 1);
  }

  getMemberTeam2() {
    return this.memberList.filter((mem) => mem.team === 2);
  }
  getTeam1Score() {
    return round(
      this.getMemberTeam1().reduce((acc, member) => acc + member.score, 0),
      1
    );
  }
  getTeam2Score() {
    return round(
      this.getMemberTeam2().reduce((acc, member) => acc + member.score, 0),
      1
    );
  }

  async onGenTeam() {
    this.done = false;
    const data = await this.playerService.generateTeams(
      this.teamSize,
      this.getAttendance().map((a) => ({
        ...a
      })),
      this.civilizations
    );
    this.memberList = data.team;
    this.sessionStatus = 'ready';
  }

  async onGenHero() {
    this.done = false;
    const data = await this.playerService.generateCivilizations(this.memberList, this.civilizations);
    this.memberList = data.team;
    this.sessionStatus = 'ready';
  }

  async onStart() {
    const submitPlayerList = this.memberList.map(m => ({
      playerId : m.id,
      civId : m.civId,
      team : m.team
    }));
    await this.dataService.createSession({ players: submitPlayerList});
    this.sessionStatus = 'confirmed';
  }

  async onFinish() {
    this.sessionStatus = '';
    this.memberList = [];
    this.attendance.forEach(a => a.checked = false);
    
  }

  checkSessionLocked() {
    return this.sessionStatus === 'confirmed';
  }
}
