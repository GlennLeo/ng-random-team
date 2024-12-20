import { shuffle } from 'lodash';
import { TeamMember } from '../models/Player';

export const team = [
  { name: 'HungDiv6', elo: 10 },
  { name: 'PhongBG', elo: 9 },
  { name: 'Bazemin', elo: 8 },
  { name: 'Glenn', elo: 7 },
  { name: 'HongHa', elo: 6 },
  { name: 'Hunter', elo: 6 },
  { name: 'Chemdiv2', elo: 6 },
  { name: 'Taton', elo: 6 },
  { name: 'Panzai', elo: 6 },
  { name: 'Hzz', elo: 5.5 },
  { name: 'Vtpozt', elo: 5.5 },
  { name: 'KHV', elo: 5.5 },
  { name: '1ConVit', elo: 3.5 },
  { name: 'Ga', elo: 2.5 },
  { name: 'Ebi', elo: 2 },
  { name: 'Phantom', elo: 0 },
];

export const heroes = [
  { name: 'Egyptian', tier: 1, rate: 1.1 },
  { name: 'Hittite', tier: 1, rate: 1.1 },
  { name: 'Yamato', tier: 1, rate: 1.1 },
  { name: 'Shang', tier: 1, rate: 1.1 },
  { name: 'Phoenician', tier: 2, rate: 0.9 },
  { name: 'Roman', tier: 2, rate: 0.9 },
  { name: 'Assyrian', tier: 2, rate: 0.9 },
  { name: 'Sumerian', tier: 2, rate: 0.9 },
  { name: 'Palmyran', tier: 3, rate: 0.9 },
  { name: 'Persian', tier: 3, rate: 0.8 },
  { name: 'Macedonia', tier: 3, rate: 0.8 },
  { name: 'Babylonian', tier: 3, rate: 0.8 },
  { name: 'Minoan', tier: 4, rate: 0.7 },
  { name: 'Choson', tier: 4, rate: 0.7 },
  { name: 'Carthaginian', tier: 4, rate: 0.7 },
  { name: 'Greek', tier: 4, rate: 0.7 },
];

//Hackaround to be aware of whom manually picked hero
export const heroesManualPick = [
  { name: 'Egyptian (M)', tier: 1, rate: 1.1 },
  { name: 'Hittite (M)', tier: 1, rate: 1.1 },
  { name: 'Yamato (M)', tier: 1, rate: 1.1 },
  { name: 'Shang (M)', tier: 1, rate: 1.1 },
  { name: 'Phoenician (M)', tier: 2, rate: 0.9 },
  { name: 'Roman (M)', tier: 2, rate: 0.9 },
  { name: 'Assyrian (M)', tier: 2, rate: 0.9 },
  { name: 'Sumerian (M)', tier: 2, rate: 0.9 },
  { name: 'Palmyran (M)', tier: 3, rate: 0.9 },
  { name: 'Persian (M)', tier: 3, rate: 0.8 },
  { name: 'Macedonia (M)', tier: 3, rate: 0.8 },
  { name: 'Babylonian (M)', tier: 3, rate: 0.8 },
  { name: 'Minoan (M)', tier: 4, rate: 0.7 },
  { name: 'Choson (M)', tier: 4, rate: 0.7 },
  { name: 'Carthaginian (M)', tier: 4, rate: 0.7 },
  { name: 'Greek (M)', tier: 4, rate: 0.7 },
];

export const teamNames = shuffle(team.map((member) => member.name));

export const membersPlaceholder11: TeamMember[] = [
  // Team 1
  {
    id: 100,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 700,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
];

export const membersPlaceholder22: TeamMember[] = [
  // Team 1
  {
    id: 100,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 200,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 600,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 700,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
];

export const membersPlaceholder33: TeamMember[] = [
  // Team 1
  {
    id: 100,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 200,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 300,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  // Team 2
  {
    id: 500,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 600,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 700,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
];

export const membersPlaceholder44: TeamMember[] = [
  // Team 1
  {
    id: 100,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 200,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 300,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 400,
    hero: '',
    name: '',
    elo: 0,
    team: 1,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },

  // Team 2
  {
    id: 500,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 600,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 700,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
  {
    id: 800,
    hero: '',
    name: '',
    elo: 0,
    team: 2,
    total_wins: 0,
    total_losts: 0,
    win_rate: 0,
  },
];
