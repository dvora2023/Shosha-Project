import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css'
})
export class AddUser {
  registrationForm: FormGroup;
  profilePhotoPreview = signal<string>('assets/default-avatar.png');
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  profilePhotoBase64 = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      tz: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhotoPreview.set(reader.result as string);
        this.profilePhotoBase64.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.errorMessage.set('Please fill in all required fields correctly');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const userData = {
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      userName: this.registrationForm.value.userName,
      phoneNumber: this.registrationForm.value.phoneNumber,
      mail: this.registrationForm.value.mail,
      password: this.registrationForm.value.password,
      tz: this.registrationForm.value.tz || null,
      profilePhoto: this.profilePhotoBase64(),
      status: true
    };

    this.userService.addUser(userData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Account created successfully! Redirecting to login...');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Registration error:', error);
        
        if (error.error?.message) {
          this.errorMessage.set(error.error.message);
        } else if (error.status === 400) {
          this.errorMessage.set('Invalid input. Please check your details.');
        } else {
          this.errorMessage.set('Registration failed. Please try again.');
        }
      }
    });
  }

  clearForm(): void {
    this.registrationForm.reset();
    this.profilePhotoPreview.set('assets/default-avatar.png');
    this.profilePhotoBase64.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}