import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatDialogModule 
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private alert: AlertService
  ) {}

  loading = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      gender: ['MALE', Validators.required],
      password: ['', Validators.required],
      role: ['USER']
    });
  }

  onRegister() {
    this.loading = true;
    if (this.registerForm.invalid) return;
    this.auth.register(this.registerForm.value).subscribe({
      next: response => {
        this.loading = false;
        this.snackBar.open(
          'Código OTP enviado para seu e-mail.',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/verify'], {
          state: { email: this.registerForm.value.email }
        });
      },
      error: err => {
        this.loading = false;
        if (err.error.status == 'ALREADY_VERIFIED') {
          this.alert.warning("Conta já existe, faça o login");
          this.router.navigate(['/login']);
        } else if(err.error.status == 'PENDING_VERIFICATION'){
          this.alert.success("Conta já existe mas não foi verificada, faça o login");
          this.router.navigate(['/login'], {
            state: { email: this.registerForm.value.email }
          });
        } else {
          this.alert.warning(err.error.password);
          console.log(err)
        }

      }
    });
  }
  
}
