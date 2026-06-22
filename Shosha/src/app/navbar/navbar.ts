import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { Cart } from '../cart';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  categories: any[] = [];
  openDropdown: string | null = null;

  ids: { [key: string]: string } = {
    'Tablecloths and Napkins': '6a09be509fe9dc6768673992',
    Tablecloths: '6a09d6459fe9dc67686739a3',
    Napkins: '6a09bee19fe9dc6768673994',
    Tableware: '6a09bc2f9fe9dc6768673990',
    Plates: '6a09bb409fe9dc676867398d',
    Cups: '6a09d5ed9fe9dc67686739a0',
    Cutlery: '6a09d6289fe9dc67686739a1',
    'Serving utensils': '6a09d6379fe9dc67686739a2',
    Accessories: '6a09be7b9fe9dc6768673993',
    Vases: '6a09d6549fe9dc67686739a4',
    'Napkin holders': '6a09bc5a9fe9dc6768673991',
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    public userService: UserService,
    public cartService: Cart   // ← הוסף
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('שגיאה:', err),
    });
  }

  toggleDropdown(name: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.openDropdown = this.openDropdown === name ? null : name;
  }

  closeDropdown() {
    this.openDropdown = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeDropdown();
  }

  navigateTo(name: string) {
    if (this.categories.length > 0) {
      const cat = this.categories.find((c) => c.name === name);
      if (cat) {
        this.router.navigate(['/products', cat._id]);
        return;
      }
    }
    const id = this.ids[name];
    if (id) {
      this.router.navigate(['/products', id]);
    }
  }
}