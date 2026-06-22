import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = false;
  isLoading = false;
  showRegPassword = false;
  showLoginPassword = false;
  avatarPreview: string | null = null;
  selectedFile: File | null = null;
  loginError = '';
  loginSuccess = '';

  registerForm!: FormGroup;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // אם כבר מחובר - עבור לדף הבית
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.loginError = '';
    this.loginSuccess = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    this.loginError = '';

    const userData = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      userName: this.registerForm.value.userName,
      phoneNumber: this.registerForm.value.phoneNumber,
      mail: this.registerForm.value.mail,
      password: this.registerForm.value.password,
      profilePhoto: this.avatarPreview || null
    };

    this.userService.addUser(userData).subscribe({
      next: (newUser: any) => {
        this.isLoading = false;
        // אחרי הרשמה - אם יש תמונה, העלה אותה דרך multer
        if (this.selectedFile && newUser._id) {
          this.userService.uploadPhoto(newUser._id, this.selectedFile).subscribe();
        }
        this.registerForm.reset();
        this.avatarPreview = null;
        this.selectedFile = null;
        this.switchMode();
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'שגיאה בהרשמה, נסה שוב';
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.loginError = '';
    this.loginSuccess = '';

    this.userService.loginUser({
      mail: this.loginForm.value.email,
      password: this.loginForm.value.password
    }).subscribe({
      next: (user: any) => {
        this.isLoading = false;
        this.loginSuccess = `ברוך הבא, ${user.firstName}! 🎉`;
        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'אימייל או סיסמא שגויים';
      }
    });
  }

  getPasswordStrength(): number {
    const pwd = this.registerForm.get('password')?.value || '';
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 10) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 25;
    return strength;
  }

  getPasswordStrengthClass(): string {
    const s = this.getPasswordStrength();
    if (s <= 25) return 'weak';
    if (s <= 50) return 'fair';
    if (s <= 75) return 'good';
    return 'strong';
  }

  getPasswordStrengthLabel(): string {
    const s = this.getPasswordStrength();
    if (s <= 25) return 'Weak';
    if (s <= 50) return 'Fair';
    if (s <= 75) return 'Good';
    return 'Strong';
  }
}