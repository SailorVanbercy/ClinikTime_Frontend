import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import {
  DisponibiliteMedecinService,
  DisponibiliteDto,
  CreerDisponibiliteDto
} from '../../../core/services/medecin/disponibilite-medecin.service';

@Component({
  selector: 'app-medecin-disponibilites',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medecin-disponibilites.component.html',
  styleUrls: ['./medecin-disponibilites.component.css']
})
export class MedecinDisponibilitesComponent {

  /* ===== FORMULAIRE ===== */
  form: FormGroup;
  mode: 'OUVRIR' | 'BLOQUER' = 'OUVRIR';
  submitting = false;

  /* ===== MODALE ===== */
  showConfirm = false;
  dispoToDeleteId: number | null = null;

  /* ===== REFRESH ===== */
  private refresh$ = new BehaviorSubject<void>(undefined);
  disponibilites$: Observable<DisponibiliteDto[]> = this.refresh$.pipe(
    switchMap(() => this.service.getMesDisponibilites())
  );

  constructor(
    private fb: FormBuilder,
    private service: DisponibiliteMedecinService
  ) {
    this.form = this.fb.group({
      debut: ['', Validators.required],
      fin: ['', Validators.required]
    });
  }

  /* ===== AJOUT / BLOCAGE ===== */
  submit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    const dto: CreerDisponibiliteDto = this.form.value;

    const action$ =
      this.mode === 'OUVRIR'
        ? this.service.ouvrirDisponibilite(dto)
        : this.service.bloquerDisponibilite(dto);

    action$.subscribe({
      next: () => {
        this.form.reset();
        this.submitting = false;
        this.refresh$.next();
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  setMode(mode: 'OUVRIR' | 'BLOQUER'): void {
    this.mode = mode;
  }

  /* ===== SUPPRESSION AVEC MODALE ===== */
  demanderSuppression(id: number): void {
    this.dispoToDeleteId = id;
    this.showConfirm = true;
  }

  annulerSuppression(): void {
    this.showConfirm = false;
    this.dispoToDeleteId = null;
  }

  confirmerSuppression(): void {
    if (this.dispoToDeleteId === null) return;

    this.service.supprimerDisponibilite(this.dispoToDeleteId).subscribe({
      next: () => {
        this.refresh$.next();
        this.annulerSuppression();
      },
      error: () => {
        alert('Erreur lors de la suppression');
        this.annulerSuppression();
      }
    });
  }
}
