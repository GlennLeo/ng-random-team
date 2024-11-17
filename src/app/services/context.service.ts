import { Injectable } from '@angular/core';
import { Profile } from '../models/Profile';
import { ClientDataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class ContextService {

    private profile?: Profile;
    constructor(private dataService: ClientDataService) { }

    async currentProfile(): Promise<Profile> {
        if (this.profile) return Promise.resolve(this.profile!);
        this.profile = await this.dataService.getProfile();
        return this.profile;
    }
}