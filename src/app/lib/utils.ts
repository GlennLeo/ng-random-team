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
