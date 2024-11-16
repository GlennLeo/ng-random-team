import { Injectable } from '@angular/core';
import { Attendee, TeamMember } from '../models/Player';
import { shuffle } from 'lodash';
import { Civilization } from '../models/Civilization';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  selectedCivs = new Set(); // Keep track of already selected heroes

  constructor() {}

  generateTeams = async (teamSize: number, attendance: Attendee[], civilizations : Civilization[]) => {
    let bestTeams: {
      team1: TeamMember[];
      team2: TeamMember[];
    } = {
      team1: [],
      team2: [],
    };
    let lowestDifference = Infinity;

    for (let i = 0; i < 5; i++) {
      const { team1, team2 } =
        teamSize === 8
          ? this.generateTeams44(attendance)
          : this.generateTeams33(attendance);
      const team1Score = team1.reduce((acc, person) => acc + person.score, 0);
      const team2Score = team2.reduce((acc, person) => acc + person.score, 0);
      const difference = Math.abs(team1Score - team2Score);

      if (difference < lowestDifference) {
        lowestDifference = difference;
        bestTeams = { team1, team2 };
      }
    }

    const { team1, team2 } = bestTeams;
    const civListForTeam1 = this.selectTeam(civilizations);
    const civListForTeam2  = this.selectTeam(civilizations);
    const team1WithCiv = team1.map((person, index) => ({
      ...person,
      team: 1,
      hero: civListForTeam1[index].name,
      civId : civListForTeam1[index].id
    })) as TeamMember[];
    const team2WithCiv = team2.map((person, index) => ({
      ...person,
      team: 2,
      hero: civListForTeam2[index].name,
      civId : civListForTeam2[index].id
    }));
    this.handleSendWebhookMessage(team1WithCiv, team2WithCiv);
    return {
      team: [...team1WithCiv, ...team2WithCiv],
    };
  };

  generateCivilizations = async (memberList: TeamMember[], civilizations : Civilization[]) => {
    const hero1 = this.selectTeam(civilizations);
    const hero2 = this.selectTeam(civilizations);
    const team1WithCiv = memberList
      .filter((mem) => mem.team === 1)
      .map((person, index) => ({
        ...person,
        team: 1,
        hero: hero1[index].name,
        civId : hero1[index].id
      })) as TeamMember[];
    const team2WithCiv = memberList
      .filter((mem) => mem.team === 2)
      .map((person, index) => ({
        ...person,
        team: 2,
        hero: hero2[index].name,
        civId : hero2[index].id
      }));
    this.handleSendWebhookMessage(team1WithCiv, team2WithCiv);
    return {
      team: [...team1WithCiv, ...team2WithCiv],
    };
  };

  private generateTeams44(people: Attendee[]): {
    team1: TeamMember[];
    team2: TeamMember[];
  } {
    if (people.length !== 8) {
      return {
        team1: [],
        team2: [],
      };
    }

    // Sort people by score in descending order
    const sortedPeople = people
      .sort((a, b) => b.score - a.score)
      .map((p) => ({ ...p, hero: '', team: 0 })) as TeamMember[];

    const team1: TeamMember[] = [];
    const team2: TeamMember[] = [];
    // Shuffle the top 4 highest score members
    const top4Highest = sortedPeople.slice(0, 4);
    // Shuffle the top 4 lowest score members
    const top4Lowest = shuffle(sortedPeople.slice(4));

    // Distribute the top 4 highest score members into 2 teams
    team1.push(top4Highest[0], top4Highest[3]);
    team2.push(top4Highest[1], top4Highest[2]);

    // Distribute the top 4 lowest score members into 2 teams
    team1.push(top4Lowest[0], top4Lowest[3]);
    team2.push(top4Lowest[1], top4Lowest[2]);
    let team1Score = team1.reduce((acc, person) => acc + person.score, 0);
    let team2Score = team2.reduce((acc, person) => acc + person.score, 0);
    let retry = 0;
    while (Math.abs(team1Score - team2Score) > 1 && retry < 20) {
      // Shuffle the teams again
      const shuffledPeople = sortedPeople;
      const top4Highest = shuffledPeople.slice(0, 4);
      const top4Lowest = shuffle(shuffledPeople.slice(4));

      team1.length = 0;
      team2.length = 0;

      team1.push(top4Highest[0], top4Highest[3]);
      team2.push(top4Highest[1], top4Highest[2]);

      team1.push(top4Lowest[0], top4Lowest[3]);
      team2.push(top4Lowest[1], top4Lowest[2]);

      team1Score = team1.reduce((acc, person) => acc + person.score, 0);
      team2Score = team2.reduce((acc, person) => acc + person.score, 0);
      retry++;
    }
    retry = 0;
    while (Math.abs(team1Score - team2Score) > 1.5 && retry < 20) {
      // Shuffle the teams again
      const shuffledPeople = sortedPeople;
      const top4Highest = shuffledPeople.slice(0, 4);
      const top4Lowest = shuffle(shuffledPeople.slice(4));

      team1.length = 0;
      team2.length = 0;

      team1.push(top4Highest[0], top4Highest[3]);
      team2.push(top4Highest[1], top4Highest[2]);

      team1.push(top4Lowest[0], top4Lowest[3]);
      team2.push(top4Lowest[1], top4Lowest[2]);

      team1Score = team1.reduce((acc, person) => acc + person.score, 0);
      team2Score = team2.reduce((acc, person) => acc + person.score, 0);
      retry++;
    }
    retry = 0;
    while (Math.abs(team1Score - team2Score) > 2 && retry < 50) {
      // Shuffle the teams again
      const shuffledPeople = shuffle(sortedPeople);
      const top4Highest = shuffledPeople.slice(0, 4);
      const top4Lowest = shuffle(shuffledPeople.slice(4));

      team1.length = 0;
      team2.length = 0;

      team1.push(top4Highest[0], top4Highest[3]);
      team2.push(top4Highest[1], top4Highest[2]);

      team1.push(top4Lowest[0], top4Lowest[3]);
      team2.push(top4Lowest[1], top4Lowest[2]);

      team1Score = team1.reduce((acc, person) => acc + person.score, 0);
      team2Score = team2.reduce((acc, person) => acc + person.score, 0);
      retry++;
    }
    return { team1, team2 };
  }
  generateTeams33(people: Attendee[]): {
    team1: TeamMember[];
    team2: TeamMember[];
  } {
    if (people.length !== 6) {
      return {
        team1: [],
        team2: [],
      };
    }

    // Sort people by score in descending order
    const sortedPeople = people
      .sort((a, b) => b.score - a.score)
      .map((p) => ({ ...p, hero: '', team: 0 })) as TeamMember[];

    const team1: TeamMember[] = [];
    const team2: TeamMember[] = [];
    // Shuffle the top 2 highest score members
    const top2Highest = sortedPeople.slice(0, 2);
    // Shuffle remaining members
    const remaining = sortedPeople.slice(2);

    // Distribute the top 2 highest score members into 2 teams
    team1.push(top2Highest[0]);
    team2.push(top2Highest[1]);

    // Distribute the remaining members into 2 teams
    remaining.forEach((person, index) => {
      if (index % 2 === 0) {
        team1.push(person);
      } else {
        team2.push(person);
      }
    });

    // Ensure each team has exactly 3 members
    if (team1.length > 3) {
      team2.push(team1.pop()!);
    } else if (team2.length > 3) {
      team1.push(team2.pop()!);
    }

    let team1Score = team1.reduce((acc, person) => acc + person.score, 0);
    let team2Score = team2.reduce((acc, person) => acc + person.score, 0);
    let retry = 0;
    while (Math.abs(team1Score - team2Score) > 1.5 && retry < 20) {
      // Shuffle the teams again
      const shuffledPeople = sortedPeople.sort(() => Math.random() - 0.5);
      const top2Highest = shuffledPeople.slice(0, 2);
      const remaining = shuffledPeople.slice(2);

      team1.length = 0;
      team2.length = 0;

      team1.push(top2Highest[0]);
      team2.push(top2Highest[1]);

      remaining.forEach((person, index) => {
        if (index % 2 === 0) {
          team1.push(person);
        } else {
          team2.push(person);
        }
      });

      // Ensure each team has exactly 3 members
      if (team1.length > 3) {
        team2.push(team1.pop()!);
      } else if (team2.length > 3) {
        team1.push(team2.pop()!);
      }

      team1Score = team1.reduce((acc, person) => acc + person.score, 0);
      team2Score = team2.reduce((acc, person) => acc + person.score, 0);
      retry++;
    }
    return { team1, team2 };
  }
  private handleSendWebhookMessage = (
    team1: TeamMember[],
    team2: TeamMember[]
  ) => {
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
    console.log({ isWithinAllowedTime });
    if (isWithinAllowedTime) {
      this.sendWebhookMessage(team1, team2);
    }
  };
  private async sendWebhookMessage(team1: TeamMember[], team2: TeamMember[]) {
    const webhookUrl = `https://chat.googleapis.com/v1/spaces/AAAAO5WhQOI/messages?key=${
      import.meta.env.NG_APP_PUBLIC_GG_KEY
    }&token=${import.meta.env.NG_APP_PUBLIC_GG_TOKEN}`; // Replace with your actual webhook URL
    const message = {
      text: `Team 1: ${team1
        .map((member) => `${member.name} - ${member.hero}`)
        .join(', ')}\nTeam 2: ${team2
        .map((member) => `${member.name} - ${member.hero}`)
        .join(', ')}`,
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

  private getCivilizationsByTier(tier: number, civList : Civilization[]) {
    return civList.filter((c) => c.tier === tier);
  }

  private getRandomCivilization(tier: number, civList : Civilization[]) {
    const tierCivs = this.getCivilizationsByTier(tier, civList);
    const availableCivs = tierCivs.filter(
      (c) => !this.selectedCivs.has(c.name)
    );

    // 70% chance to select a unique hero, 30% chance to allow duplicates
    const useUniqueCiv = Math.random() < 0.65;

    if (useUniqueCiv && availableCivs.length > 0) {
      // Select from heroes not already picked
      const randomIndex = Math.floor(Math.random() * availableCivs.length);
      return availableCivs[randomIndex];
    } else {
      // Allow duplicates (pick from all heroes in the tier)
      const randomIndex = Math.floor(Math.random() * tierCivs.length);
      return tierCivs[randomIndex];
    }
  }

  // Hero selection logic based on tier rules
  selectTeam(civList : Civilization[]) {
    this.selectedCivs.clear(); // Clear previously selected heroes

    const firstTier = Math.floor(Math.random() * 4) + 1;
    const secondTier = 5 - firstTier;
    const thirdTier = Math.floor(Math.random() * 4) + 1;
    const fourthTier = 5 - thirdTier;

    const firstCiv = this.getRandomCivilization(firstTier, civList);
    this.selectedCivs.add(firstCiv.name);
    const secondCiv = this.getRandomCivilization(secondTier, civList);
    this.selectedCivs.add(secondCiv.name);
    const thirdCiv = this.getRandomCivilization(thirdTier, civList);
    this.selectedCivs.add(thirdCiv.name);
    const fourthCiv = this.getRandomCivilization(fourthTier, civList);
    this.selectedCivs.add(fourthCiv.name);

    const team = [firstCiv, secondCiv, thirdCiv, fourthCiv];
    return team;
  }
}
