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


export const teamNames = shuffle(team.map((member) => member.name));
