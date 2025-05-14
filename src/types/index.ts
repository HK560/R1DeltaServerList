export interface Server {
  ip: string;
  port: number;
  host_name: string;
  description: string;
  map_name: string;
  game_mode: GameMode;
  total_players: number;
  max_players: number;
  version: string;
  players: Player[];
  validated: boolean;
}

export type GameMode = 'all' | 'at' | 'campaign' | 'coop' | 'ctf' | 'lts' | 'mfdp' | 'ps' | 'tdm' | 'cp';

export interface GameModeOption {
  value: GameMode;
  label: string;
}

export interface Player {
  name: string;
  gen: number;
  lvl: number;
  team: number;
} 