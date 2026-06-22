import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-category',
  imports: [ CommonModule],
  templateUrl: './all-category.html',
  styleUrl: './all-category.css'
})
export class AllCategory implements OnInit {
  arr: any[] = [];

  constructor(private router: Router, private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.arr = data;
        console.log('קטגוריות:', data);
      },
      error: (err) => {
        console.error('שגיאה בטעינת קטגוריות:', err);
      }
    });
  }

  nav(id: number) {
    this.router.navigate(['/products', id]);
  }
}