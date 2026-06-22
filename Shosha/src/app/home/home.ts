import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  images = [
    'images/allimages/HomePage/alternate/Table_set%20(1).png',
    'images/allimages/HomePage/alternate/Table_set%20(2).png',
    'images/allimages/HomePage/alternate/Table_set%20(3).png',
    'images/allimages/HomePage/alternate/Table_set%20(4).png',
    'images/allimages/HomePage/alternate/Table_set%20(5).png',
    'images/allimages/HomePage/alternate/Table_set%20(6).png',
    'images/allimages/HomePage/alternate/Table_set%20(7).png',
    'images/allimages/HomePage/alternate/Table_set%20(8).png',
    'images/allimages/HomePage/alternate/Table_set%20(9).png',
    'images/allimages/HomePage/alternate/Table_set%20(10).png',
    'images/allimages/HomePage/alternate/Table_set%20(11).png',
    'images/allimages/HomePage/alternate/Table_set%20(12).png',
    'images/allimages/HomePage/alternate/Table_set%20(13).png',
  ];

  currentIndex = signal(0);
  isVisible = signal(true);
  private interval?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.interval = setInterval(() => {
      this.isVisible.set(false);
      setTimeout(() => {
        this.currentIndex.set((this.currentIndex() + 1) % this.images.length);
        this.isVisible.set(true);
      }, 600);
    }, 3500);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
