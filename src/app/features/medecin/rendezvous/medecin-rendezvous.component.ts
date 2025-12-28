import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, switchMap, map } from 'rxjs';
import {
  RendezVousMedecinService,
  RendezVousDto
} from '../../../core/services/medecin/rendezvous-medecin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-medecin-rendezvous',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medecin-rendezvous.component.html',
  styleUrls: ['./medecin-rendezvous.component.css']
})
export class MedecinRendezVousComponent {

  /** Refresh */
  private refresh$ = new BehaviorSubject<void>(undefined);

  /** RDV à venir uniquement */
  rendezVous$: Observable<RendezVousDto[]> = this.refresh$.pipe(
    switchMap(() => this.service.getMesRendezVous()),
    map(rdvs =>
      rdvs.filter(r => new Date(r.fin).getTime() > Date.now())
    )
  );

  /** Modale reprogrammation */
  showReprogrammer = false;
  rdvToUpdateId: number | null = null;

  form: FormGroup;

  constructor(
    private service: RendezVousMedecinService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nouvelleDate: ['', Validators.required]
    });
  }

  /* ===== REFUSER ===== */
  refuser(id: number): void {
    if (!confirm('Refuser ce rendez-vous ?')) return;

    this.service.refuserRendezVous(id).subscribe({
      next: () => this.refresh$.next(),
      error: () => alert('Erreur lors du refus')
    });
  }

  /* ===== REPROGRAMMER ===== */
  ouvrirReprogrammation(id: number): void {
    this.rdvToUpdateId = id;
    this.showReprogrammer = true;
  }

  annulerReprogrammation(): void {
    this.showReprogrammer = false;
    this.rdvToUpdateId = null;
    this.form.reset();
  }

  confirmerReprogrammation(): void {
    if (this.form.invalid || this.rdvToUpdateId === null) return;

    const nouvelleDate = this.form.value.nouvelleDate;

    this.service.reprogrammerRendezVous(this.rdvToUpdateId, nouvelleDate)
      .subscribe({
        next: () => {
          this.refresh$.next();
          this.annulerReprogrammation();
        },
        error: () => alert('Erreur lors de la reprogrammation')
      });
  }
}
