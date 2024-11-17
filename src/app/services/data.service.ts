import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Civilization } from '../models/Civilization';
import { Player } from '../models/Player';
import { Profile } from '../models/Profile';
import { GameSession } from '../models/Session';
import { ApiHelper } from './api.helper';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ClientDataService {
    constructor(private apiService: ApiService) { }

    async getPlayers(): Promise<Player[]> {
        return await lastValueFrom(this.apiService
            .get('/api/players')
            .pipe(map(ApiHelper.onSuccess), catchError(ApiHelper.onFail)));
    }

    async getCivilizations(): Promise<Civilization[]> {
        return await lastValueFrom(this.apiService
            .get('/api/civilizations')
            .pipe(map(ApiHelper.onSuccess), catchError(ApiHelper.onFail)));
    }

    async createSession(payload: any): Promise<any> {
        return await lastValueFrom(this.apiService
            .post('/api/games', payload)
            .pipe(map(ApiHelper.onSuccess), catchError(ApiHelper.onFail))); 
    }

    async updateSession(sessionId : string, payload: any): Promise<any> {
        return await lastValueFrom(this.apiService
            .put(`/api/games/${sessionId}`, payload)
            .pipe(map(ApiHelper.onSuccess), catchError(ApiHelper.onFail))); 
    }

    async getSessionList(pageIndex : number = 1, pageSize: number = 100): Promise<GameSession[]> {
        return await lastValueFrom(this.apiService
            .get('/api/games')
            .pipe(map(ApiHelper.onSuccess), catchError(ApiHelper.onFail)));
    }

    async getProfile() : Promise<Profile>{
        return await lastValueFrom(this.apiService
            .get('/api/profile')
            .pipe(map(ApiHelper.onSuccess), catchError(ApiHelper.onFail)));
    }
}
