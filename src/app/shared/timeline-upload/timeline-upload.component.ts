// upload.component.ts
import { Component, inject, input } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-upload',
  templateUrl: './timeline-upload.component.html',
  styleUrls: ['./timeline-upload.component.css'],
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule],
  providers: [MessageService],
})
export class TimelineUploadComponent {
  sessionId = input.required<number>();
  private readonly supabase = inject(SupabaseService);
  private readonly messageService = inject(MessageService);

  async onUploadFile(file: File) {
    const filePath = `images/${this.sessionId()}/${Date.now()}_${file.name}`; // Define the file path
    try {
      const data = await this.supabase.uploadTimelineImage({ filePath, file });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async onUpload(event: any, fileUpload: any) {
    try {
      const uploadPromises = event.files.map(async (file: any) => {
        // Upload file
        await this.onUploadFile(file);

        // Get the public URL of the uploaded image
        const image = await this.supabase.getImageUrl(file.name);

        // Update the session timeline with the public URL
        await this.supabase.updateSessionTimeline(
          this.sessionId(),
          image.publicUrl
        );
      });

      // Run all uploads and updates concurrently
      await Promise.all(uploadPromises);
      fileUpload.clear();
      // Add a success message after all operations complete
      this.messageService.add({
        severity: 'info',
        summary: 'Success',
        detail: 'All images uploaded successfully.',
      });
    } catch (error) {
      // Handle errors gracefully
      console.error('Error uploading images:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: 'Some images could not be uploaded. Please try again.',
      });
    }
  }
}
