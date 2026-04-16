// Deck naming constants, shared between client and server
// Win condition flags are stored per-card in cards.json (isWinCondition field),
// populated from RoyaleAPI data via scrape-royaleapi.js + update-cards.mjs.

export const RARITY_COLORS = {
  common: '#62a2ff', rare: '#f3821d', epic: '#a564d1',
  legendary: '#00c0b0', champion: '#f3ba25',
};

export const CARD_ABBREVS = {
  '26000021': 'Hog', '26000062': 'MA', '26000015': 'BBD', '26000027': 'DP',
  '26000042': 'EWiz', '26000067': 'EGolem', '26000085': 'EGiant', '26000061': 'FishBoy',
  '27000013': 'GobDrill', '27000001': 'GobHut', '26000020': 'GS', '28000010': 'GY',
  '26000038': 'IG', '26000006': 'Loon', '26000029': 'LH', '26000065': 'MM',
  '26000083': 'MW', '26000014': 'Musk', '28000012': 'Nado', '26000024': 'RG',
  '26000059': 'RHogs', '26000058': 'WB', '26000036': 'Ram', '28000014': 'EQ',
  '26000026': 'Princess', '26000035': 'LJ', '26000023': 'IceWiz', '26000048': 'NW',
  '26000072': 'AQ', '26000045': 'Exec', '26000056': 'SkelBarrel', '26000051': 'RR',
  '26000060': 'GobGiant', '26000034': 'Bowler', '26000032': 'Miner', '26000097': 'SBush',
  '26000055': 'MK', '26000074': 'GK', '26000069': 'SK', '28000004': 'GobBarrel',
  '26000004': 'PEKKA', '26000018': 'MiniP', '26000033': 'Sparky', '26000050': 'Ghost',
  '26000037': 'IDrag', '26000063': 'EDrag', '26000054': 'Cart', '28000003': 'Rocket',
  '28000007': 'Lightning', '26000043': 'EBarbs', '26000077': 'Monk', '26000064': 'FC',
  '26000057': 'FM', '26000041': 'GobGang', '26000012': 'SkelArmy', '26000093': 'LP',
  '26000080': 'SkelDrags', '26000087': 'Phoenix', '27000003': 'IT', '28000000': 'FB',
  '28000005': 'Freeze', '26000068': 'Healer', '26000046': 'Bandit', '26000016': 'Prince',
  '26000011': 'Valk', '26000053': 'Rascals', '26000008': 'Barbs', '26000022': 'MHorde',
  '26000005': 'Minions',
};

export const OMIT_FROM_NAME = new Set([
  '26000000', '26000010', '26000030', '26000031', '28000016',
  '26000084', '28000011', '28000008', '28000001', '27000000',
  '27000006', '27000009', '26000049',
]);

export const CYCLE_CARDS = new Set([
  '26000010', '26000030', '26000031', '28000016', '26000084',
  '26000000', '28000011', '28000008', '28000001', '26000049',
  '26000038',
]);

export const BAIT_CARDS = new Set([
  '26000026', '28000004', '26000041', '26000012', '26000010',
  '26000049', '26000025', '26000022',
]);
