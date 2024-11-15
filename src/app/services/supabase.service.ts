import { inject, Injectable, NgZone } from '@angular/core';
import {
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Player, PlayerSession, TeamMember } from '../models/Player';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly ngZone = inject(NgZone);

  constructor() {
    this.supabase = this.ngZone.runOutsideAngular(() =>
      createClient(
        import.meta.env.NG_APP_PUBLIC_SUPABASE_URL,
        import.meta.env.NG_APP_PUBLIC_SUPABASE_ANON_KEY
      )
    );
  }
  async getPlayers() {
    const data = await this.supabase.from('player').select();
    return data as PostgrestSingleResponse<Player[]>;
  }

  async getBoardList() {
    const { data, error } = await this.supabase.rpc('grouped_session');
    if (error) {
      console.error('Error fetching grouped sessions:', error);
      return [];
    }
    return data;
  }

  async getLatestConfirmedSession() {
    const data = await this.getLatestSessionByStatus('confirmed');
    return data;
  }
  async getLatestFinishedSessionWithoutWinningTeam() {
    const { data, error } = await this.supabase
      .from('session')
      .select()
      .eq('status', 'finished')
      .is('winning_team', null)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest confirmed session:', error);
      return null;
    }

    return data?.[0] || null;
  }

  async getLatestSessionByStatus(status: string) {
    const { data, error } = await this.supabase
      .from('session')
      .select()
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest confirmed session:', error);
      return null;
    }

    return data?.[0] || null;
  }

  async getLastedBoard() {
    const latestFinishedSessionWithoutWinningTeam =
      await this.getLatestFinishedSessionWithoutWinningTeam();
    if (latestFinishedSessionWithoutWinningTeam) {
      return this.getBoardBySessionId(
        latestFinishedSessionWithoutWinningTeam.id
      );
    }
    // Get the latest draft session
    const latestConfirmedSession = await this.getLatestConfirmedSession();

    if (!latestConfirmedSession) {
      console.error('No confirmed session found');
      return [];
    }

    return this.getBoardBySessionId(latestConfirmedSession.id);
  }

  async getBoardBySessionId(sessionId: number) {
    if (!sessionId) {
      return [];
    }
    // Query player_session with session_id equal to the latest draft session id,
    // and include data for player_id and hero_id
    const { data, error } = await this.supabase
      .from('player_session')
      .select(
        `
          id,
          session_id (*),
          team,
          player_id (*),
          hero
        `
      )
      .eq('session_id', sessionId);
    if (error) {
      console.error('Error fetching player sessions:', error);
      return [];
    }
    return data;
  }

  async createSession() {
    const { data, error } = await this.supabase
      .from('session')
      .insert({
        winning_team: null,
        status: 'draft',
      })
      .select();

    if (error) {
      console.error('Error creating session:', error);
      return null;
    }

    return data?.[0] || null;
  }

  async createPlayerSession(id: string | number | null, players: TeamMember[]) {
    try {
      await this.supabase
        .from('session')
        .update({ status: 'confirmed' })
        .eq('id', id);
      for (const player of players) {
        await this.supabase.from('player_session').insert({
          session_id: id,
          player_id: player.id,
          team: player.team,
          hero: player.hero,
        });
      }
    } catch (error) {
      console.log({ error });
    }
  }
  async updateSessionStatus(id: number, status: string) {
    const { data, error } = await this.supabase
      .from('session')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating session status:', error);
    } else {
      console.log('Session status updated:', data);
    }
  }
  async updateSessionWinningTeam(id: number, winningTeam: number) {
    const { data, error } = await this.supabase
      .from('session')
      .update({ winning_team: winningTeam })
      .eq('id', id);

    if (error) {
      console.error('Error updating session winning team:', error);
    } else {
      console.log('Session status updated:', data);
    }
  }

  async getStatisticOfPlayer(playerId: number) {
    const { data, error } = await this.supabase.rpc('player_statistics', {
      player_id_input: playerId,
    });
    if (error) {
      console.error('Error fetching grouped sessions:', error);
      return [];
    }
    return data;
  }
}
