import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { GameSession } from '../../models/Session';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-update-game-session-dialog',
    templateUrl: './update-session-dialog.component.html',
    imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, FormsModule, MatRadioModule, MatInputModule ],
    standalone: true
})
export class UpdateGameSessionDialogComponent {
    gameSession: GameSession;

    constructor(
        public dialogRef: MatDialogRef<UpdateGameSessionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: GameSession
    ) {
        this.gameSession = { ...data };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        this.gameSession.winningTeam = Number(this.gameSession.winningTeam);
        this.dialogRef.close(this.gameSession);
    }
}