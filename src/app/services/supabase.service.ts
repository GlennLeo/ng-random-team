import { inject, Injectable, NgZone } from '@angular/core';
import {
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Player, TeamMember } from '../models/Player';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly ngZone = inject(NgZone);
  player = null;

  constructor() {
    this.supabase = this.ngZone.runOutsideAngular(() =>
      createClient(
        import.meta.env.NG_APP_PUBLIC_SUPABASE_URL,
        import.meta.env.NG_APP_PUBLIC_SUPABASE_ANON_KEY
      )
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async checkSession() {
    const { data, error } = await this.supabase.auth.getSession();
    return { data, error };
  }

  async handleSignInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    return { data, error };
  }

  async handleSignOut() {
    console.log('signout');
    const res = await this.supabase.auth.signOut();
    console.log({ res });
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

  async searchBoardList({
    playerName,
    hero,
    limit,
    offset,
  }: {
    playerName?: string;
    hero?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data, error } = await this.supabase.rpc('board_history', {
      player_name_input: playerName,
      hero_input: hero,
      page_limit: limit,
      page_offset: offset,
    });
    if (error) {
      console.error('Error fetching history:', error);
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
    const { data: userData } = await this.supabase.auth.getSession();
    const { data, error } = await this.supabase
      .from('session')
      .insert({
        winning_team: null,
        status: 'draft',
        dealer:
          userData.session?.user.identities?.[0].identity_data?.['name'] ??
          userData.session?.user.email,
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
      // Update the session status
      await this.supabase
        .from('session')
        .update({ status: 'confirmed' })
        .eq('id', id);

      // Prepare data for batch insertion
      const playerSessions = players.map((player) => ({
        session_id: id,
        player_id: player.id,
        team: player.team,
        hero: player.hero,
      }));

      // Batch insert into player_session
      const { error } = await this.supabase
        .from('player_session')
        .insert(playerSessions);
      if (error) {
        console.error('Batch insert failed:', error.message);
        throw error;
      }
    } catch (error) {
      throw error;
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
    const { data, error } = await this.supabase.rpc('player_statistic', {
      player_id_input: playerId,
    });
    if (error) {
      console.error('Error fetching grouped sessions:', error);
      return [];
    }
    return data;
  }

  async getAllPlayersWithStatistic() {
    const { data, error } = await this.supabase.rpc('all_player_statistic');
    if (error) {
      console.error('Error fetching grouped sessions:', error);
      return [];
    }
    return data;
  }
  async getPlayersByIdsWithStatistic(ids: string | number[]) {
    const { data, error } = await this.supabase.rpc('board_players_statistic', {
      player_ids: ids,
    });
    if (error) {
      console.error('Error fetching board_players_statistic:', error);
      return [];
    }
    return data;
  }

  async batchUpdatePlayers(players: TeamMember[]): Promise<any> {
    try {
      const updates = players.map((player) => ({
        id: player.id,
        name: player.name,
        elo: player.elo,
      }));

      const { data, error } = await this.supabase
        .from('player')
        .upsert(updates, { onConflict: 'id' }); // Use `update` if you want to strictly update existing records.

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating players:', error);
      throw error;
    }
  }

  async checkExistSessionId(sessionId: number) {
    const { data, error } = await this.supabase
      .from('session')
      .select(
        `
          id
        `
      )
      .eq('id', sessionId);
    if (error) {
      return false;
    }
    return !!data.length;
  }

  async deleteDraftSession(sessionId: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('session')
      .delete()
      .eq('id', sessionId)
      .eq('status', 'draft');

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }

    console.log('Deleted session:', data);
  }

  async deleteSessionById(sessionId: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('session')
      .delete()
      .eq('id', sessionId)
      .is('winning_team', null); // Only allow to delete non-finished session

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }

    console.log('Deleted session:', data);
  }

  async deletePlayerSessionsBySessionId(sessionId: number): Promise<void> {
    const { data, error } = await this.supabase
      .from('player_session')
      .delete()
      .eq('session_id', sessionId); // Filter rows by session_id

    if (error) {
      throw new Error(`Failed to delete player sessions: ${error.message}`);
    }

    console.log('Deleted player sessions:', data);
  }

  async cancelSession(sessionId: number) {
    await this.deleteSessionById(sessionId);
  }

  async getPlayerMannerHistory(playerId: number): Promise<any[]> {
    const { data, error } = await this.supabase.rpc('player_manner_history', {
      player_id_input: playerId,
    });

    if (error) {
      console.error('Error fetching manner history:', error);
      return [];
    }

    return data;
  }
}
