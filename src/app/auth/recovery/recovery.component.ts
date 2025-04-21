import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {
  recoveryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSendOtp() {
    if (this.recoveryForm.invalid) return;
    this.auth.sendOtp(this.recoveryForm.value).subscribe({
      next: () => {
        this.snackBar.open('Código OTP enviado para seu e-mail.', 'Fechar', { duration: 3000 });
        //this.auth.emailTemp = this.registerForm.value.email;
        this.router.navigate(['/verify'], {
          state: { email: this.recoveryForm.value.email, flow: 'recovery' }
        });
      },
      error: err => this.snackBar.open(err.error.message, 'Fechar', { duration: 3000 }),
    });
  }
}
