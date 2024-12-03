import { Component, computed, input, model } from '@angular/core';
import { Attendee, TeamMember } from '../../models/Player';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-team-board',
  standalone: true,
  imports: [CommonModule, BadgeModule, DropdownModule],
  templateUrl: './team-board.component.html',
  styleUrl: './team-board.component.css',
})
export class TeamBoardComponent {
  teamName = input.required<string>();
  team = input.required<number>();
  elo = input<number>();
  memberList = model.required<TeamMember[]>();
  win = input(false);
  isSmall = input(false);
  attendance = model<Attendee[]>();
  manualMode = model<boolean>(false);

  getAvailableAttendees() {
    return this.attendance()?.filter((item) => !item.checked) ?? [];
  }

  onPlayerChange(event: any, index: number) {
    this.memberList.update((oldList) => {
      oldList[index].id = event.value.id;
      oldList[index].name = event.value.name;
      oldList[index].elo = event.value.elo;
      oldList[index].total_losts = event.value.total_losts;
      oldList[index].total_wins = event.value.total_wins;
      oldList[index].win_rate = event.value.win_rate;
      return oldList;
    });
    this.attendance.update((oldList) => {
      return oldList?.map((item, i) => {
        if (item.name === event.value.name) {
          item.checked = true;
        }
        return item;
      });
    });
  }
  removePlayer(name: string, index: number) {
    this.memberList.update((oldList) => {
      oldList[index].name = '';
      oldList[index].elo = 0;
      return oldList;
    });
    this.attendance.update((oldList) => {
      return oldList?.map((item, i) => {
        if (item.name === name) {
          item.checked = false;
        }
        return item;
      });
    });
  }
}