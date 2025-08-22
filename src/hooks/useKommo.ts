import { useState, useEffect, useCallback } from 'react';

// Tipos para la API de Kommo
export interface KommoLead {
  id: number;
  name: string;
  price: number;
  responsible_user_id: number;
  group_id: number;
  status_id: number;
  pipeline_id: number;
  loss_reason_id?: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  closed_at?: number;
  closest_task_at?: number;
  is_deleted: boolean;
  custom_fields_values?: any[];
  score?: number;
  account_id: number;
  labor_cost?: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded?: {
    tags?: any[];
    companies?: any[];
    contacts?: any[];
  };
}

export interface KommoPipeline {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: {
    statuses: KommoStatus[];
  };
}

export interface KommoStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: number;
  account_id: number;
  _links: {
    self: {
      href: string;
    };
  };
}

export interface KommoStats {
  totalLeads: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  leadsPerStatus: { [statusId: number]: number };
  valuePerStatus: { [statusId: number]: number };
}

// Usar proxy local en desarrollo, URL directa en producción
const KOMMO_BASE_URL = import.meta.env.DEV 
  ? '/api/kommo' 
  : (import.meta.env.VITE_KOMMO_BASE_URL || 'https://bizmakermx.kommo.com/api/v4');

// Token desde variables de entorno
const KOMMO_ACCESS_TOKEN = import.meta.env.VITE_KOMMO_ACCESS_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc3OGYwZWYzOTA1Mjc3ZTliMDY4NzdkMDVmNTZiOTVlN2QzMDEwNDQ1OWY1ODdhZmViN2JmZDUxNGMyNmRhYjNmZTc3ZmI1NjIwYTAzYTE5In0.eyJhdWQiOiJhNzY5ZTgyNy1kOTgzLTQzZmUtOGI5Yi04YzFlN2E0ZDg0OWYiLCJqdGkiOiI3NzhmMGVmMzkwNTI3N2U5YjA2ODc3ZDA1ZjU2Yjk1ZTdkMzAxMDQ0NTlmNTg3YWZlYjdiZmQ1MTRjMjZkYWIzZmU3N2ZiNTYyMGEwM2ExOSIsImlhdCI6MTc1NTg4Njg5NSwibmJmIjoxNzU1ODg2ODk1LCJleHAiOjE3NTU5NzMyOTUsInN1YiI6IjExMjI3MTQzIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0MjMzNTA3LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiNzY5YWQ3YjUtMGZjNy00Nzg2LTg1YWUtZTcxOTQ0NzE2ZmY3IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.E5VMWm7VcDFaASIzSnUAGDyqBseGcTzMpHWXyYG0VL9UmyLiDJELs323IEJLoh8L8hDPg25Nzxbxfbx1bafxGqw-NTNqop15-PPlEVTi8-vBrDGa_FSAhjVpXAb0wfaBVy4Y6R-Vf8CghMoyEVNa9owwokZ8hw9sIsryv0yiEoH_UfMAMfteCkuWq3P8Sizr0dkqupr3zZ5no38OAautbv2-c65cYJ_TcFlhqvgMtXXF7E3KX2OT3fTybpxZqrl41csR23gpvmtlCAe4F62v0FXIoYqtQ-ioSbjh4i-8uvM-UA0nZRcoy_2akqWS3aBUc8j85y7GzDGvUJaxDlbpFw';

// Pipeline específico de Mayo Dental
const MAYO_DENTAL_PIPELINE_ID = 10619619;