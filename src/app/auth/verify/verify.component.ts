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
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatIcon
  ],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  verifyForm!: FormGroup;
  email: string = '';
  flow: string = '';

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
    this.verifyForm = this.fb.group({
      email: [this.email],
      otp: ['', Validators.required],
    });
  }

  onVerify() {
    if (this.verifyForm.invalid) return;
    this.auth.verify(this.verifyForm.value).subscribe({
      next: () => {
        if(this.flow == 'recovery') {
          this.snackBar.open('Agora altere sua senha.', 'Fechar', { duration: 3000 });
          this.router.navigate(['/reset-password'], {
            state: { email: this.email, flow: 'recovery' }
          });
        } else if(this.flow == 'verify') {
          this.snackBar.open('Conta verificada com sucesso.', 'Fechar', { duration: 3000 });
          this.router.navigate(['/login'])
        } else {
          this.snackBar.open('Conta verificada com sucesso.', 'Fechar', { duration: 3000 });
          this.router.navigate(['/login']);
        }

      },
      error: err => this.snackBar.open(err.error.message, 'Fechar', { duration: 3000 }),
    });
  }
}
