import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  hidePassword = true;
  email: string = '';
  flow: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    const navigation = history.state;
    this.email = navigation.email || '';
    this.flow = navigation.flow || '';
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: [this.email, [Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onResetPassword() {
    this.loading = true;
    if (this.resetForm.invalid) return;

    if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
      this.snackBar.open('As senhas não coincidem.', 'Fechar', { duration: 3000 });
      return;
    }

    this.auth.resetPassword(this.resetForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Senha redefinida com sucesso.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err.error.message, 'Fechar', { duration: 3000 })
      }
    });
  }
}
