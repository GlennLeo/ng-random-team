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
