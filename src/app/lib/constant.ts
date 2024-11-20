import { shuffle } from 'lodash';

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
  { name: 'Egyptian', tier: 1 },
  { name: 'Hittite', tier: 1 },
  { name: 'Yamato', tier: 1 },
  { name: 'Shang', tier: 1 },
  { name: 'Phoenician', tier: 2 },
  { name: 'Roman', tier: 2 },
  { name: 'Assyrian', tier: 2 },
  { name: 'Sumerian', tier: 2 },
  { name: 'Palmyran', tier: 3 },
  { name: 'Persian', tier: 3 },
  { name: 'Macedonia', tier: 3 },
  { name: 'Babylonian', tier: 3 },
  { name: 'Minoan', tier: 4 },
  { name: 'Choson', tier: 4 },
  { name: 'Carthaginian', tier: 4 },
  { name: 'Greek', tier: 4 },
];

export const teamNames = shuffle(team.map((member) => member.name));
