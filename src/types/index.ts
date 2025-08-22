// Tipos para el sistema de prospectos
export interface ProspectoMkt {
  id: number;
  nombre_contacto: string | null;
  numero_telefono: string;
  created_at: string;
  updated_at: string;
  estado_embudo: string;
  score_interes: number;
  presupuesto_mencionado: number | null;
  urgencia_detectada: string | null;
  carrera_interes: string | null;
  plantel_interes: string | null;
  ultima_intencion: string | null;
  objeciones_detectadas: string | null;
  competencia_mencionada: string | null;
  momento_optimo_contacto: string | null;
  perfil_comunicacion: string | null;
  fecha_decision_estimada: string | null;
  probabilidad_conversion: number | null;
  resumen_ia: string | null;
  notas_ia: string | null;
  kommo_lead_id?: string | null;
  kommo_contact_id?: string | null;
}

// Tipos para conversaciones
export interface ConversacionMkt {
  id: number;
  prospecto_id: number;
  created_at: string;
  updated_at: string;
  estado: string;
  ultima_actividad: string | null;
}

// Tipos para mensajes
export interface MensajeMkt {
  id: number;
  conversacion_id: number;
  contenido: string;
  tipo: 'entrada' | 'salida';
  created_at: string;
  metadata?: any;
}

// Tipos para Kommo CRM
export interface KommoLead {
  id: number;
  name: string;
  price: number;
  status_id: number;
  pipeline_id: number;
  created_at: string;
  updated_at: string;
  custom_fields_values?: any[];
  _embedded?: {
    contacts?: Array<{
      id: number;
      name: string;
      custom_fields_values?: any[];
    }>;
    tags?: Array<{
      id: number;
      name: string;
    }>;
  };
}

export interface KommoPipeline {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  _embedded?: {
    statuses?: Array<{
      id: number;
      name: string;
      sort: number;
      is_editable: boolean;
      pipeline_id: number;
    }>;
  };
}

export interface KommoStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
}

// Tipos para la aplicación
export type AppView = 'prospectos' | 'conversaciones' | 'dashboard' | 'kommo';

export interface AppState {
  currentView: AppView;
  isLoading: boolean;
  error: string | null;
}