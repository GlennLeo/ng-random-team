import { Component, OnInit } from '@angular/core';
// import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  // private readonly supabase = inject(SupabaseService);
  constructor() {}

  async ngOnInit(): Promise<void> {}
}
