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
}

export type GameMode = 'all' | 'at' | 'campaign' | 'coop' | 'ctf' | 'lts' | 'mfdp' | 'ps' | 'tdm';

export interface GameModeOption {
  value: GameMode;
  label: string;
} 