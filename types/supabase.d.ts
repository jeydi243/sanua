export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alerte: {
        Row: {
          alerte_id: string
          created_at: string
          created_by: string | null
          date_heure_generation: string | null
          date_heure_lecture: string | null
          entite_concernee_id: string | null
          entite_type: string
          message: string
          severite: string
          statut_alerte: string
          type_alerte: string
          updated_at: string
          updated_by: string | null
          utilisateur_assigne_id: string | null
        }
        Insert: {
          alerte_id?: string
          created_at?: string
          created_by?: string | null
          date_heure_generation?: string | null
          date_heure_lecture?: string | null
          entite_concernee_id?: string | null
          entite_type: string
          message: string
          severite: string
          statut_alerte?: string
          type_alerte: string
          updated_at?: string
          updated_by?: string | null
          utilisateur_assigne_id?: string | null
        }
        Update: {
          alerte_id?: string
          created_at?: string
          created_by?: string | null
          date_heure_generation?: string | null
          date_heure_lecture?: string | null
          entite_concernee_id?: string | null
          entite_type?: string
          message?: string
          severite?: string
          statut_alerte?: string
          type_alerte?: string
          updated_at?: string
          updated_by?: string | null
          utilisateur_assigne_id?: string | null
        }
        Relationships: []
      }
      classe: {
        Row: {
          code: string | null
          created: string | null
          created_at: string
          description: string | null
          id: string
          updated: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client: {
        Row: {
          adresse: string | null
          client_id: string
          created_at: string
          created_by: string | null
          date_naissance: string | null
          documents_identite: string | null
          nom: string
          prenom: string
          statut_civil: string | null
          telephone: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          adresse?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          date_naissance?: string | null
          documents_identite?: string | null
          nom: string
          prenom: string
          statut_civil?: string | null
          telephone: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          adresse?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          date_naissance?: string | null
          documents_identite?: string | null
          nom?: string
          prenom?: string
          statut_civil?: string | null
          telephone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      compte: {
        Row: {
          client_id: string
          compte_id: string
          created_at: string
          created_by: string | null
          date_fermeture: string | null
          date_ouverture: string | null
          devise: string
          solde: number
          statut_compte: string
          type_compte: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          client_id: string
          compte_id?: string
          created_at?: string
          created_by?: string | null
          date_fermeture?: string | null
          date_ouverture?: string | null
          devise?: string
          solde?: number
          statut_compte?: string
          type_compte: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          client_id?: string
          compte_id?: string
          created_at?: string
          created_by?: string | null
          date_fermeture?: string | null
          date_ouverture?: string | null
          devise?: string
          solde?: number
          statut_compte?: string
          type_compte?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_compte_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      document: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          document_id: string
          entite_liee_id: string
          entite_liee_type: string
          est_public: boolean
          link: string
          mime_type: string
          nom_fichier: string
          taille_octet: number
          type_document: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          document_id?: string
          entite_liee_id: string
          entite_liee_type: string
          est_public?: boolean
          link: string
          mime_type: string
          nom_fichier: string
          taille_octet: number
          type_document: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          document_id?: string
          entite_liee_id?: string
          entite_liee_type?: string
          est_public?: boolean
          link?: string
          mime_type?: string
          nom_fichier?: string
          taille_octet?: number
          type_document?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      echeancierpret: {
        Row: {
          created_at: string
          created_by: string | null
          date_echeance: string
          date_remboursement_effectif: string | null
          echeancier_id: string
          montant_interets_prevu: number
          montant_penalites_du: number
          montant_principal_prevu: number
          montant_rembourse: number
          montant_total_prevu: number
          notes: string | null
          numero_echeance: number
          pret_id: string
          statut_echeance: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_echeance: string
          date_remboursement_effectif?: string | null
          echeancier_id?: string
          montant_interets_prevu: number
          montant_penalites_du?: number
          montant_principal_prevu: number
          montant_rembourse?: number
          montant_total_prevu: number
          notes?: string | null
          numero_echeance: number
          pret_id: string
          statut_echeance?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_echeance?: string
          date_remboursement_effectif?: string | null
          echeancier_id?: string
          montant_interets_prevu?: number
          montant_penalites_du?: number
          montant_principal_prevu?: number
          montant_rembourse?: number
          montant_total_prevu?: number
          notes?: string | null
          numero_echeance?: number
          pret_id?: string
          statut_echeance?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_echeancier_pret"
            columns: ["pret_id"]
            isOneToOne: false
            referencedRelation: "pret"
            referencedColumns: ["pret_id"]
          },
        ]
      }
      journalisation: {
        Row: {
          adresse_ip: string
          date_heure_action: string
          details_apres: Json | null
          details_avant: Json | null
          entite_affectee_id: string | null
          entite_affectee_type: string
          journal_id: string
          navigateur_os: string | null
          statut_action: string
          type_action: string
          utilisateur_id: string | null
        }
        Insert: {
          adresse_ip: string
          date_heure_action?: string
          details_apres?: Json | null
          details_avant?: Json | null
          entite_affectee_id?: string | null
          entite_affectee_type: string
          journal_id?: string
          navigateur_os?: string | null
          statut_action: string
          type_action: string
          utilisateur_id?: string | null
        }
        Update: {
          adresse_ip?: string
          date_heure_action?: string
          details_apres?: Json | null
          details_avant?: Json | null
          entite_affectee_id?: string | null
          entite_affectee_type?: string
          journal_id?: string
          navigateur_os?: string | null
          statut_action?: string
          type_action?: string
          utilisateur_id?: string | null
        }
        Relationships: []
      }
      lookup: {
        Row: {
          classe_id: string | null
          code: string | null
          created: string | null
          created_at: string
          description: string | null
          id: number
          lookup_id: string
          nom: string | null
          updated: string | null
          updated_at: string | null
        }
        Insert: {
          classe_id?: string | null
          code?: string | null
          created?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lookup_id?: string
          nom?: string | null
          updated?: string | null
          updated_at?: string | null
        }
        Update: {
          classe_id?: string | null
          code?: string | null
          created?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lookup_id?: string
          nom?: string | null
          updated?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lookup_classe_id_fkey"
            columns: ["classe_id"]
            isOneToOne: false
            referencedRelation: "classe"
            referencedColumns: ["id"]
          },
        ]
      }
      organisation: {
        Row: {
          adresse: string
          code: string | null
          created: string | null
          created_by: string | null
          date_creation: string | null
          email: string | null
          lookup_id: string
          nom: string
          organisation_id: string
          telephone: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          adresse: string
          code?: string | null
          created?: string | null
          created_by?: string | null
          date_creation?: string | null
          email?: string | null
          lookup_id: string
          nom: string
          organisation_id?: string
          telephone?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          adresse?: string
          code?: string | null
          created?: string | null
          created_by?: string | null
          date_creation?: string | null
          email?: string | null
          lookup_id?: string
          nom?: string
          organisation_id?: string
          telephone?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      paiementpret: {
        Row: {
          affectation_interets: number
          affectation_penalites: number
          affectation_principal: number
          commentaire: string | null
          created_at: string
          created_by: string | null
          date_heure_paiement: string | null
          devise: string
          methode_paiement: string
          montant_paiement: number
          paiement_id: string
          pret_id: string
          reference_paiement: string | null
          transaction_id: string | null
          updated_at: string
          updated_by: string | null
          utilisateur_id: string
        }
        Insert: {
          affectation_interets?: number
          affectation_penalites?: number
          affectation_principal?: number
          commentaire?: string | null
          created_at?: string
          created_by?: string | null
          date_heure_paiement?: string | null
          devise?: string
          methode_paiement: string
          montant_paiement: number
          paiement_id?: string
          pret_id: string
          reference_paiement?: string | null
          transaction_id?: string | null
          updated_at?: string
          updated_by?: string | null
          utilisateur_id: string
        }
        Update: {
          affectation_interets?: number
          affectation_penalites?: number
          affectation_principal?: number
          commentaire?: string | null
          created_at?: string
          created_by?: string | null
          date_heure_paiement?: string | null
          devise?: string
          methode_paiement?: string
          montant_paiement?: number
          paiement_id?: string
          pret_id?: string
          reference_paiement?: string | null
          transaction_id?: string | null
          updated_at?: string
          updated_by?: string | null
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_paiement_pret"
            columns: ["pret_id"]
            isOneToOne: false
            referencedRelation: "pret"
            referencedColumns: ["pret_id"]
          },
          {
            foreignKeyName: "fk_paiementpret_transaction"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transaction"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      permission: {
        Row: {
          code: string | null
          created_at: string
          created_by: string | null
          description: string
          permission_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          permission_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          permission_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      plafondcredit: {
        Row: {
          created_at: string
          created_by: string | null
          date_debut_validite: string
          date_fin_validite: string | null
          description: string | null
          devise: string
          entite_id: string | null
          est_actif: boolean
          montant_maximum: number
          plafond_id: string
          type_plafond: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_debut_validite?: string
          date_fin_validite?: string | null
          description?: string | null
          devise?: string
          entite_id?: string | null
          est_actif?: boolean
          montant_maximum: number
          plafond_id?: string
          type_plafond: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_debut_validite?: string
          date_fin_validite?: string | null
          description?: string | null
          devise?: string
          entite_id?: string | null
          est_actif?: boolean
          montant_maximum?: number
          plafond_id?: string
          type_plafond?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      pret: {
        Row: {
          agent_id: string
          client_id: string
          conditions_speciales: string | null
          created_at: string
          created_by: string | null
          date_dernier_remboursement: string | null
          date_octroi: string
          date_premiere_echeance: string | null
          duree_mois: number
          montant_principal: number
          montant_total_a_rembourser: number | null
          periode_interet: string
          pret_id: string
          solde_du_interets: number
          solde_du_penalites: number
          solde_du_principal: number
          statut_pret: string
          taux_interet: number
          type_pret: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agent_id: string
          client_id: string
          conditions_speciales?: string | null
          created_at?: string
          created_by?: string | null
          date_dernier_remboursement?: string | null
          date_octroi: string
          date_premiere_echeance?: string | null
          duree_mois: number
          montant_principal: number
          montant_total_a_rembourser?: number | null
          periode_interet: string
          pret_id?: string
          solde_du_interets?: number
          solde_du_penalites?: number
          solde_du_principal: number
          statut_pret?: string
          taux_interet: number
          type_pret: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agent_id?: string
          client_id?: string
          conditions_speciales?: string | null
          created_at?: string
          created_by?: string | null
          date_dernier_remboursement?: string | null
          date_octroi?: string
          date_premiere_echeance?: string | null
          duree_mois?: number
          montant_principal?: number
          montant_total_a_rembourser?: number | null
          periode_interet?: string
          pret_id?: string
          solde_du_interets?: number
          solde_du_penalites?: number
          solde_du_principal?: number
          statut_pret?: string
          taux_interet?: number
          type_pret?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pret_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_type: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      rapportaudit: {
        Row: {
          chemin_fichier_rapport: string
          created_at: string
          created_by: string | null
          criteres_selection: string | null
          date_heure_generation: string | null
          format_fichier: string
          rapport_id: string
          statut: string
          type_rapport: string
          updated_at: string
          updated_by: string | null
          utilisateur_id: string
        }
        Insert: {
          chemin_fichier_rapport: string
          created_at?: string
          created_by?: string | null
          criteres_selection?: string | null
          date_heure_generation?: string | null
          format_fichier: string
          rapport_id?: string
          statut?: string
          type_rapport: string
          updated_at?: string
          updated_by?: string | null
          utilisateur_id: string
        }
        Update: {
          chemin_fichier_rapport?: string
          created_at?: string
          created_by?: string | null
          criteres_selection?: string | null
          date_heure_generation?: string | null
          format_fichier?: string
          rapport_id?: string
          statut?: string
          type_rapport?: string
          updated_at?: string
          updated_by?: string | null
          utilisateur_id?: string
        }
        Relationships: []
      }
      rolepermission: {
        Row: {
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rolepermission_permission"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["permission_id"]
          },
          {
            foreignKeyName: "fk_rolepermission_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      roles_assignments: {
        Row: {
          created_at: string
          created_by: string
          end_date: string | null
          id: string | null
          role_id: string | null
          start_date: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          end_date?: string | null
          id?: string | null
          role_id?: string | null
          start_date: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          end_date?: string | null
          id?: string | null
          role_id?: string | null
          start_date?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction: {
        Row: {
          compte_id: string
          date_heure_transaction: string
          description: string | null
          devise: string
          montant: number
          reference_externe: string | null
          solde_apres_transaction: number | null
          solde_avant_transaction: number | null
          statut_transaction: string
          transaction_id: string
          type_transaction: string
          utilisateur_id: string
        }
        Insert: {
          compte_id: string
          date_heure_transaction?: string
          description?: string | null
          devise?: string
          montant: number
          reference_externe?: string | null
          solde_apres_transaction?: number | null
          solde_avant_transaction?: number | null
          statut_transaction?: string
          transaction_id?: string
          type_transaction: string
          utilisateur_id: string
        }
        Update: {
          compte_id?: string
          date_heure_transaction?: string
          description?: string | null
          devise?: string
          montant?: number
          reference_externe?: string | null
          solde_apres_transaction?: number | null
          solde_avant_transaction?: number | null
          statut_transaction?: string
          transaction_id?: string
          type_transaction?: string
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transaction_compte"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "compte"
            referencedColumns: ["compte_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    -
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
