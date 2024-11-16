import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Civilization } from '../models/Civilization';
import { Player } from '../models/Player';
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

    async getSessionList(): Promise<GameSession> {
        return await lastValueFrom(this.apiService
            .get('/api/games')
            .pipe(map(ApiHelper.onSuccess), catchError(ApiHelper.onFail)));
    }
}
