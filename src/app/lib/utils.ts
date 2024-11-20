import { round } from 'lodash';
import { Attendee, TeamMember } from '../models/Player';

export function updateAttendance(
  attendance: Attendee[],
  memberList: TeamMember[]
) {
  const updatedAttendance = [...attendance];
  // Convert memberList to a Set for faster lookups based on member id
  const memberIds = new Set(memberList.map((member) => member.id));

  // Update attendance items to checked if they exist in memberList
  updatedAttendance.forEach((item) => {
    if (memberIds.has(item.id)) {
      item.checked = true;
    }
  });
  return updatedAttendance;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return formatter.format(date);
}

export function getDuration(
  createdAt: string | Date,
  updatedAt: string | Date
): string {
  if (!updatedAt) return '';
  // Convert inputs to Date objects if they are strings
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);

  // Calculate the difference in milliseconds
  const durationMs = updatedDate.getTime() - createdDate.getTime();

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  // Format as HH:MM
  const formattedDuration = `${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}`;

  return formattedDuration;
}

export function calculatePlayerPoints(
  players: TeamMember[],
  winningTeam: number,
  basePoint: number = 20
): TeamMember[] {
  const averagePoint = players.reduce((sum, player) => sum + player.elo, 0) / 8;

  const updatedPlayers = players.map((player) => {
    let winPoint: number;
    let losePoint: number;

    if (player.elo > averagePoint) {
      winPoint = round(
        (1 - (player.elo - averagePoint) / averagePoint) * basePoint
      );
      losePoint = round(
        (1 + (player.elo - averagePoint) / averagePoint) * basePoint
      );
    } else {
      winPoint = round(
        (1 - (player.elo - averagePoint) / averagePoint) * basePoint
      );
      losePoint = round(
        (1 + (player.elo - averagePoint) / averagePoint) * basePoint
      );
    }
    if (+player.team === +winningTeam) {
      return {
        ...player,
        elo: player.elo + winPoint,
      };
    } else {
      return {
        ...player,
        elo: player.elo - losePoint,
      };
    }
  });
  return updatedPlayers;
}
