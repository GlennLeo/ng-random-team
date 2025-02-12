import { Injectable } from '@angular/core';
import { Attendee, TeamMember } from '../models/Player';
import { round, shuffle } from 'lodash';
import { heroes } from '../lib/constant';
import { getGameCategory } from '../lib/utils';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  selectedHeroes = new Set(); // Keep track of already selected heroes

  constructor() {}

  generateTeams = async (attendance: Attendee[], manualMode: boolean) => {
    let bestTeams: {
      team1: TeamMember[];
      team2: TeamMember[];
    } = {
      team1: [],
      team2: [],
    };
    let lowestDifference = Infinity;

    for (let i = 0; i < 2; i++) {
      const { team1, team2 } = this.genTeamRandomly(attendance);
      const team1Elo = team1.reduce((acc, person) => acc + person.elo, 0);
      const team2Elo = team2.reduce((acc, person) => acc + person.elo, 0);
      const difference = Math.abs(team1Elo - team2Elo);

      if (difference < lowestDifference) {
        lowestDifference = difference;
        bestTeams = { team1, team2 };
      }
    }

    const { team1, team2 } = bestTeams;

    this.handleSendWebhookMessage(manualMode, team1, team2);
    return {
      team: [...team1, ...team2],
    };
  };

  generateHeroes = async (memberList: TeamMember[], manualMode: boolean) => {
    let attempts = 0; // Track attempts to avoid infinite loops
    const maxAttempts = 2000; // Safety limit for retries
    let maxScoreDifference = 100;
    const hero1 = this.selectTeam();
    const hero2 = this.selectTeam();
    let team1 = memberList
      .filter((mem) => mem.team === 1)
      .map((person, index) => ({
        ...person,
        eloWithHero: person.hero.includes('(M)')
          ? person.eloWithHero
          : round(person.elo * hero1[index].rate, 1),
        team: 1,
        hero: person.hero.includes('(M)') ? person.hero : hero1[index].name,
      })) as TeamMember[];
    let team2 = memberList
      .filter((mem) => mem.team === 2)
      .map((person, index) => ({
        ...person,
        eloWithHero: person.hero.includes('(M)')
          ? person.eloWithHero
          : round(person.elo * hero2[index].rate, 1),
        team: 2,
        hero: person.hero.includes('(M)') ? person.hero : hero2[index].name,
      })) as TeamMember[];

    while (attempts < maxAttempts) {
      const hero1 = this.selectTeam();
      const hero2 = this.selectTeam();
      const team1WithHero = memberList
        .filter((mem) => mem.team === 1)
        .map((person, index) => ({
          ...person,
          eloWithHero: person.hero.includes('(M)')
            ? person.eloWithHero
            : round(person.elo * hero1[index].rate, 1),
          team: 1,
          hero: person.hero.includes('(M)') ? person.hero : hero1[index].name,
        })) as TeamMember[];
      const team2WithHero = memberList
        .filter((mem) => mem.team === 2)
        .map((person, index) => ({
          ...person,
          eloWithHero: person.hero.includes('(M)')
            ? person.eloWithHero
            : round(person.elo * hero2[index].rate, 1),
          team: 2,
          hero: person.hero.includes('(M)') ? person.hero : hero2[index].name,
        }));
      // Calculate the scores of each team
      const team1Score = team1WithHero.reduce(
        (sum, player) => sum + (player.eloWithHero ?? player.elo),
        0
      );
      const team2Score = team2WithHero.reduce(
        (sum, player) => sum + (player.eloWithHero ?? player.elo),
        0
      );

      // Check if the score difference condition is met
      if (Math.abs(team1Score - team2Score) <= maxScoreDifference) {
        team1 = team1WithHero;
        team2 = team2WithHero;
        break;
      }
      attempts++;
      if (attempts > 1000) {
        maxScoreDifference = 200;
      }
    }
    this.handleSendWebhookMessage(manualMode, team1, team2);
    return {
      team: [...team1, ...team2],
    };
  };

  private genTeamRandomly = (people: Attendee[]) => {
    if (people.length % 2 !== 0) {
      return {
        team1: [],
        team2: [],
      };
    }
    const eachTeamCount = people.length / 2;
    let attempts = 0; // Track attempts to avoid infinite loops
    const maxAttempts = 2000; // Safety limit for retries
    let maxScoreDifference = 100;

    while (attempts < maxAttempts) {
      // Shuffle players randomly
      const shuffledPlayers = shuffle(people).map((p) => ({
        ...p,
        hero: '',
        team: 0,
      })) as TeamMember[];

      // Divide into two teams
      const team1 = shuffledPlayers.slice(0, eachTeamCount);
      const team2 = shuffledPlayers.slice(eachTeamCount);
      const hero1 = this.selectTeam();
      const hero2 = this.selectTeam();
      const team1WithHero = team1.map((person, index) => ({
        ...person,
        eloWithHero: round(person.elo * hero1[index].rate, 1),
        team: 1,
        hero: hero1[index].name,
      })) as TeamMember[];
      const team2WithHero = team2.map((person, index) => ({
        ...person,
        eloWithHero: round(person.elo * hero2[index].rate, 1),
        team: 2,
        hero: hero2[index].name,
      }));
      // Calculate the scores of each team
      const team1Score = team1WithHero.reduce(
        (sum, player) => sum + (player.eloWithHero ?? player.elo),
        0
      );
      const team2Score = team2WithHero.reduce(
        (sum, player) => sum + (player.eloWithHero ?? player.elo),
        0
      );

      // Check if the score difference condition is met
      if (Math.abs(team1Score - team2Score) <= maxScoreDifference) {
        return { team1: team1WithHero, team2: team2WithHero };
      }
      attempts++;
      if (attempts > 1000) {
        maxScoreDifference = 200;
      }
    }
    // If no result is found, return final last random result
    const shuffledPlayers = shuffle(people).map((p) => ({
      ...p,
      hero: '',
      team: 0,
    })) as TeamMember[];
    attempts = 0;
    // Divide into two teams
    let team1 = shuffledPlayers.slice(0, eachTeamCount);
    let team2 = shuffledPlayers.slice(eachTeamCount);

    while (attempts < maxAttempts) {
      const hero1 = this.selectTeam();
      const hero2 = this.selectTeam();
      const team1WithHero = shuffledPlayers
        .filter((mem) => mem.team === 1)
        .map((person, index) => ({
          ...person,
          eloWithHero: person.hero.includes('(M)')
            ? person.eloWithHero
            : round(person.elo * hero1[index].rate, 1),
          team: 1,
          hero: person.hero.includes('(M)') ? person.hero : hero1[index].name,
        })) as TeamMember[];
      const team2WithHero = shuffledPlayers
        .filter((mem) => mem.team === 2)
        .map((person, index) => ({
          ...person,
          eloWithHero: person.hero.includes('(M)')
            ? person.eloWithHero
            : round(person.elo * hero2[index].rate, 1),
          team: 2,
          hero: person.hero.includes('(M)') ? person.hero : hero2[index].name,
        }));
      // Calculate the scores of each team
      const team1Score = team1WithHero.reduce(
        (sum, player) => sum + (player.eloWithHero ?? player.elo),
        0
      );
      const team2Score = team2WithHero.reduce(
        (sum, player) => sum + (player.eloWithHero ?? player.elo),
        0
      );

      // Check if the score difference condition is met
      if (Math.abs(team1Score - team2Score) <= maxScoreDifference) {
        team1 = team1WithHero;
        team2 = team2WithHero;
        break;
      }
      attempts++;
      if (attempts > 1000) {
        maxScoreDifference = 200;
      }
    }

    return { team1, team2 };
  };

  private handleSendWebhookMessage = (
    manualMode: boolean,
    team1: TeamMember[],
    team2: TeamMember[]
  ) => {
    if (!team1.length || !team2.length) return;
    const now = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
    });
    const currentHour = new Date(now).getHours();
    const currentMinutes = new Date(now).getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;

    const isWithinTimeRange = (
      startHour: number,
      startMinute: number,
      endHour: number,
      endMinute: number
    ) => {
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      return currentTime >= startTime && currentTime <= endTime;
    };

    const isWithinAllowedTime =
      isWithinTimeRange(11, 30, 13, 30) || isWithinTimeRange(17, 0, 20, 0);
    if (isWithinAllowedTime) {
      this.sendWebhookMessage(manualMode, team1, team2);
    }
  };

  async sendWebhookMessageForSessionResult(
    winningTeam: number,
    sessionId: number
  ) {
    const now = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
    });
    const currentHour = new Date(now).getHours();
    const currentMinutes = new Date(now).getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;

    const isWithinTimeRange = (
      startHour: number,
      startMinute: number,
      endHour: number,
      endMinute: number
    ) => {
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      return currentTime >= startTime && currentTime <= endTime;
    };

    const isWithinAllowedTime =
      isWithinTimeRange(11, 30, 14, 30) || isWithinTimeRange(17, 0, 20, 0);
    if (isWithinAllowedTime) {
      const webhookUrl = `https://chat.googleapis.com/v1/spaces/AAAAO5WhQOI/messages?key=${
        import.meta.env.NG_APP_PUBLIC_GG_KEY
      }&token=${import.meta.env.NG_APP_PUBLIC_GG_TOKEN}`;
      const message = {
        text: `Kết thúc trận đấu: Đội *${winningTeam}* thắng! \n Xem kết quả, check timeline tại: <https://ng-random-team.vercel.app/session/${sessionId}|Balance Age - Trận đấu số ${sessionId}>`,
      };
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
        if (response.ok) {
          console.log('Message sent to Google Chat');
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  private async sendWebhookMessage(
    manualMode: boolean,
    team1: TeamMember[],
    team2: TeamMember[]
  ) {
    const webhookUrl = `https://chat.googleapis.com/v1/spaces/AAAAO5WhQOI/messages?key=${
      import.meta.env.NG_APP_PUBLIC_GG_KEY
    }&token=${import.meta.env.NG_APP_PUBLIC_GG_TOKEN}`; // Replace with your actual webhook URL
    const message = {
      text: `Chế độ quay: ${
        manualMode ? 'Thủ công' : 'Tự động'
      } \n Thể loại: ${getGameCategory(team1, team2)} \n_Đội 1_:  ${team1
        .map((member) => `*${member.name}* - ${member.hero} - ${member.elo}`)
        .join(' | ')}\n_Đội 2_:  ${team2
        .map((member) => `*${member.name}* - ${member.hero} - ${member.elo}`)
        .join(' | ')}`,
    };
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      if (response.ok) {
        console.log('Message sent to Google Chat');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  private getHeroesByTier(tier: number) {
    return heroes.filter((hero) => hero.tier === tier);
  }

  private getRandomHero(tier: number) {
    const tierHeroes = this.getHeroesByTier(tier);
    const availableHeroes = tierHeroes.filter(
      (hero) => !this.selectedHeroes.has(hero.name)
    );

    // 70% chance to select a unique hero, 30% chance to allow duplicates
    const useUniqueHero = Math.random() < 0.65;

    if (useUniqueHero && availableHeroes.length > 0) {
      // Select from heroes not already picked
      const randomIndex = Math.floor(Math.random() * availableHeroes.length);
      return availableHeroes[randomIndex];
    } else {
      // Allow duplicates (pick from all heroes in the tier)
      const randomIndex = Math.floor(Math.random() * tierHeroes.length);
      return tierHeroes[randomIndex];
    }
  }

  // Hero selection logic based on tier rules
  selectTeam() {
    this.selectedHeroes.clear(); // Clear previously selected heroes

    const firstTier = Math.floor(Math.random() * 4) + 1;
    const secondTier = 5 - firstTier;
    const thirdTier = Math.floor(Math.random() * 4) + 1;
    const fourthTier = 5 - thirdTier;

    const firstHero = this.getRandomHero(firstTier);
    this.selectedHeroes.add(firstHero.name);
    const secondHero = this.getRandomHero(secondTier);
    this.selectedHeroes.add(secondHero.name);
    const thirdHero = this.getRandomHero(thirdTier);
    this.selectedHeroes.add(thirdHero.name);
    const fourthHero = this.getRandomHero(fourthTier);
    this.selectedHeroes.add(fourthHero.name);

    const team = [firstHero, secondHero, thirdHero, fourthHero];
    return team;
  }
}
