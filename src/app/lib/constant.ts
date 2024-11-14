import { shuffle } from 'lodash';

export const team = [
  { name: 'HungDiv6', score: 10 },
  { name: 'PhongBG', score: 9 },
  { name: 'Bazemin', score: 8 },
  { name: 'Glenn', score: 7 },
  { name: 'HongHa', score: 6 },
  { name: 'Hunter', score: 6 },
  { name: 'Chemdiv2', score: 6 },
  { name: 'Taton', score: 6 },
  { name: 'Panzai', score: 6 },
  { name: 'Hzz', score: 5.5 },
  { name: 'Vtpozt', score: 5.5 },
  { name: 'KHV', score: 5.5 },
  { name: '1ConVit', score: 3.5 },
  { name: 'Ga', score: 2.5 },
  { name: 'Ebi', score: 2 },
  { name: 'Phantom', score: 0 },
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
