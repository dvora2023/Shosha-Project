import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  userService = inject(UserService);

  isEditing = signal(false);
  isSaving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  photoPreview = signal<string>('https://ui-avatars.com/api/?name=User&background=7aab8a&color=fff&size=200');
  selectedPhotoFile = signal<File | null>(null);

  form = this.fb.group({
    firstName:   ['', [Validators.required, Validators.minLength(2)]],
    lastName:    ['', [Validators.required, Validators.minLength(2)]],
    userName:    ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
    mail:        ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    const u = this.userService.currentUser();
    if (u) {
      this.patchForm(u);
      if (u.profilePhoto) {
        this.photoPreview.set(u.profilePhoto);
      } else {
        this.photoPreview.set(
          `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=7aab8a&color=fff&size=200`
        );
      }
    }
  }

  patchForm(u: any) {
    this.form.patchValue({
      firstName:   u.firstName   || '',
      lastName:    u.lastName    || '',
      userName:    u.userName    || '',
      phoneNumber: u.phoneNumber || '',
      mail:        u.mail        || '',
    });
  }

  startEditing() {
    this.isEditing.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  cancelEditing() {
    this.isEditing.set(false);
    this.patchForm(this.userService.currentUser());
    this.errorMessage.set('');
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedPhotoFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.photoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    const u = this.userService.currentUser();
    this.photoPreview.set(
      `https://ui-avatars.com/api/?name=${u?.firstName}+${u?.lastName}&background=7aab8a&color=fff&size=200`
    );
    this.selectedPhotoFile.set(null);
  }

  saveChanges() {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    this.errorMessage.set('');

    const userId = this.userService.currentUser()?._id!;

    const doUpdate = (extraData: any = {}) => {
      const data: any = { ...this.form.value, ...extraData };
      // שולח null במקום מחרוזת ריקה כדי לעקוף validation של MongoDB
      data.tz = null;
      this.userService.updateUser(userId, data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isEditing.set(false);
          this.successMessage.set('Profile updated successfully!');
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err: any) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message || 'Update failed. Please try again.');
        }
      });
    };

    if (this.selectedPhotoFile()) {
      this.userService.uploadPhoto(userId, this.selectedPhotoFile()!).subscribe({
        next: (updated) => doUpdate({ profilePhoto: updated.profilePhoto }),
        error: () => doUpdate()
      });
    } else {
      doUpdate();
    }
  }

  get f() { return this.form.controls; }
}