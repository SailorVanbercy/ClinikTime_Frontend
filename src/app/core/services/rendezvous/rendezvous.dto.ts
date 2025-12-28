export interface CreateRendezVousDto {
  medecinId: number;
  fichePatientId: number;
  debut: string;   // ISO string
  motif: string;
}

// ⚠️ Le back peut renvoyer soit des heures ("14:00"), soit des dates ISO.
// On garde un type simple pour pouvoir afficher directement.
export interface CreneauLibreDto{
  debut:string;
  fin:string;
}
export interface RendezVousDto{
  id: number;
  debut: string;        // ISO
  fin: string;          // ISO
  statut: string;
  motif: string;
  medecinId: number;
  medecinNom: string;
  medecinPrenom: string;
  specialite: string;
}

