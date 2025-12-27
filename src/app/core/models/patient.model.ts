// src/app/core/models/patient.model.ts
export interface Patient {
  id?: number;              // BDD: Id
  nom: string;              // BDD: Nom
  prenom: string;           // BDD: Prenom
  dateNaissance: string;    // BDD: DateNaissance
  sexe: string;             // BDD: Sexe
  lienParente: string;      // BDD: LienParente
  utilisateurId?: number;   // BDD: UtilisateurId (souvent géré par le back, mais présent)
}
