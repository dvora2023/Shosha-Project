import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  aboutData: any = null;
  loading = true;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/api/about').subscribe({
      next: (data) => {
        this.aboutData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching about data:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}