import React, { useState, useCallback } from 'react';
import { useProspectos } from '../../hooks/useProspectos';
import { useKommo } from '../../hooks/useKommo';
import { ProspectoMkt } from '../../types';
import { Building2 } from 'lucide-react';

const ProspectosView: React.FC = () => {
  const { prospectos, loading, updateProspecto } = useProspectos();
  const { createLead, createContact, pipelines, leads } = useKommo();
  const [selectedProspecto, setSelectedProspecto] = useState<ProspectoMkt | null>(null);
  const [sendingToKommo, setSendingToKommo] = useState<string | null>(null);

  const handleSendToKommo = useCallback(async (prospecto: ProspectoMkt) => {
    if (!createLead || !createContact) {
      alert('Error: No se puede conectar a Kommo o crear contacto');
      return;
    }

    try {
      setSendingToKommo(prospecto.id.toString());
      
      // Debug: Analizar leads existentes para mapeo
      console.log('=== ANÁLISIS DE LEADS EXISTENTES ===');
      console.log('Total leads disponibles:', leads.length);
      
      // Tomar algunos leads como muestra para ver su estructura
      const sampleLeads = leads.slice(0, 3);
      sampleLeads.forEach((lead, index) => {
        console.log(`\n📋 Lead muestra ${index + 1}:`, {
          id: lead.id,
          name: lead.name,
          price: lead.price,
          status_id: lead.status_id,
          pipeline_id: lead.pipeline_id,
          custom_fields: lead.custom_fields_values,
          contacts: lead._embedded?.contacts?.map(c => ({
            id: c.id,
            name: c.name,
            custom_fields: c.custom_fields_values
          }))
        });
      });

      // Debug: Ver todos los pipelines disponibles
      console.log('\n=== DEBUG PIPELINES ===');
      console.log('Total pipelines disponibles:', pipelines.length);
      pipelines.forEach((pipeline, index) => {
        console.log(`Pipeline ${index + 1}:`, {
          id: pipeline.id,
          name: pipeline.name,
          statuses: pipeline._embedded?.statuses?.map(s => ({ id: s.id, name: s.name }))
        });
      });
      
      // Buscar el pipeline de Mayo Dental (ID 10619619) y obtener sus status
      const mayoPipeline = pipelines.find(p => p.id === 10619619);
      const statuses = mayoPipeline?._embedded?.statuses || [];
      
      console.log('=== PIPELINE MAYO DENTAL ===');
      console.log('Pipeline Mayo Dental encontrado:', mayoPipeline);
      console.log('Todos los statuses disponibles:', statuses.map(s => ({ 
        id: s.id, 
        name: s.name, 
        sort: s.sort, 
        is_editable: s.is_editable 
      })));
      
      // Intentar con diferentes status hasta encontrar uno válido
      let selectedStatus = null;
      const statusesToTry = [
        statuses[1], // Segundo status (puede ser más permisivo)
        statuses[0], // Primer status (original)
        statuses[2], // Tercer status
      ].filter(Boolean);
      
      console.log('Status a probar en orden:', statusesToTry.map(s => ({ id: s.id, name: s.name })));
      
      if (statusesToTry.length === 0) {
        throw new Error('No se encontraron status disponibles en el pipeline de Mayo Dental');
      }
      
      // Por ahora usar el segundo status si existe, sino el primero
      selectedStatus = statusesToTry[0];
      console.log('Status seleccionado:', selectedStatus);
      
      // 🎯 MAPEO INTELIGENTE DE PROSPECTO A KOMMO LEAD
      console.log('\n=== MAPEO DE DATOS PROSPECTO → KOMMO ===');
      console.log('📊 Datos originales del prospecto:', {
        nombre: prospecto.nombre,
        telefono: prospecto.numero_telefono,
        estado_embudo: prospecto.estado_embudo,
        score_interes: prospecto.score_interes,
        presupuesto: prospecto.presupuesto_mencionado,
        urgencia: prospecto.urgencia_detectada,
        carrera_interes: prospecto.carrera_interes,
        plantel_interes: prospecto.plantel_interes
      });
      
      // 💰 SISTEMA INTELIGENTE DE PRECIOS PARA TRATAMIENTOS DENTALES
      const calculateDentalPrice = (prospecto: any) => {
        // Si ya mencionó un presupuesto, usarlo
        if (prospecto.presupuesto_mencionado && prospecto.presupuesto_mencionado > 0) {
          return prospecto.presupuesto_mencionado;
        }
        
        // Mapeo de tratamientos dentales comunes y sus precios estimados
        const treatmentPrices: { [key: string]: number } = {
          // Tratamientos básicos
          'limpieza': 800,
          'profilaxis': 800,
          'blanqueamiento': 3500,
          'fluorización': 500,
          
          // Tratamientos de caries
          'resina': 1200,
          'amalgama': 800,
          'incrustación': 2500,
          
          // Endodoncia
          'endodoncia': 4500,
          'conducto': 4500,
          'tratamiento de conducto': 4500,
          
          // Periodoncia
          'limpieza profunda': 2500,
          'curetaje': 3000,
          'cirugía periodontal': 8000,
          
          // Prótesis
          'corona': 6000,
          'puente': 12000,
          'prótesis total': 15000,
          'prótesis parcial': 8000,
          
          // Implantes
          'implante': 18000,
          'implante dental': 18000,
          'implantología': 20000,
          
          // Ortodoncia
          'brackets': 25000,
          'ortodoncia': 25000,
          'invisalign': 45000,
          'retenedores': 3500,
          
          // Cirugía
          'extracción': 1500,
          'cirugía': 5000,
          'cordales': 2500,
          'muelas del juicio': 2500,
          
          // Estética
          'carillas': 8000,
          'diseño de sonrisa': 35000,
          'estética dental': 15000
        };
        
        // Buscar tratamientos mencionados en los datos del prospecto
        const searchText = [
          prospecto.carrera_interes,
          prospecto.plantel_interes,
          prospecto.ultima_intencion,
          prospecto.notas_ia,
          prospecto.resumen_ia
        ].filter(Boolean).join(' ').toLowerCase();
        
        console.log('🔍 Buscando tratamientos en:', searchText);
        
        let detectedTreatments = [];
        let maxPrice = 0;
        
        for (const [treatment, price] of Object.entries(treatmentPrices)) {
          if (searchText.includes(treatment)) {
            detectedTreatments.push({ treatment, price });
            maxPrice = Math.max(maxPrice, price);
          }
        }
        
        console.log('🦷 Tratamientos detectados:', detectedTreatments);
        
        if (maxPrice > 0) {
          return maxPrice;
        }
        
        // Si tiene score alto, probablemente es un caso más complejo
        if (prospecto.score_interes && prospecto.score_interes > 80) {
          return 15000; // Tratamiento complejo
        } else if (prospecto.score_interes && prospecto.score_interes > 60) {
          return 8000;  // Tratamiento intermedio
        } else if (prospecto.score_interes && prospecto.score_interes > 40) {
          return 3000;  // Tratamiento básico
        }
        
        // Precio base para consulta/evaluación
        return 1500;
      };
      
      const estimatedPrice = calculateDentalPrice(prospecto);
      
      // Crear nombre descriptivo para el lead
      const leadName = [
        prospecto.nombre || 'Prospecto',
        prospecto.carrera_interes || prospecto.plantel_interes ? 
          `(${prospecto.carrera_interes || prospecto.plantel_interes})` : '',
        '- Mayo Dental'
      ].filter(Boolean).join(' ');
      
      console.log('💰 Precio calculado:', estimatedPrice);
      console.log('📝 Nombre del lead:', leadName);
      
      // 🏗️ CREAR LEAD COMPLETO COMO JOSÉ MELGOZA
      
      // 1️⃣ Primero crear el contacto si tenemos datos
      let createdContactId = null;
      if (prospecto.numero_telefono || prospecto.nombre) {
        try {
          console.log('\n=== 👤 CREANDO CONTACTO PRIMERO ===');
          
          const contactData = {
            name: prospecto.nombre || 'Prospecto Mayo Dental',
            phone: prospecto.numero_telefono,
            email: null, // TODO: agregar email si lo tenemos
            custom_fields: [
              // Campo "Tipo de contacto" = "Prospecto"
              {
                field_id: 859046,
                values: [{ enum_id: 714886 }] // "Prospecto"
              }
            ]
          };
          
          const contactResult = await createContact(contactData);
          
          if (contactResult && contactResult._embedded && contactResult._embedded.contacts && contactResult._embedded.contacts[0]) {
            createdContactId = contactResult._embedded.contacts[0].id;
            console.log(`✅ Contacto creado con ID: ${createdContactId}`);
          }
        } catch (contactError) {
          console.log('⚠️  Error creando contacto (continuaremos sin él):', contactError);
        }
      }
      
      // 2️⃣ Generar tags automáticos basados en datos del prospecto
      const autoTags = [];
      
      // Tags basados en score de interés
      if (prospecto.score_interes) {
        if (prospecto.score_interes > 80) autoTags.push('ALTO INTERÉS');
        else if (prospecto.score_interes > 60) autoTags.push('MEDIO INTERÉS');
        else autoTags.push('NORMAL');
      }
      
      // Tags basados en urgencia
      if (prospecto.urgencia_detectada) {
        if (prospecto.urgencia_detectada.includes('alta') || prospecto.urgencia_detectada.includes('urgente')) {
          autoTags.push('URGENTE');
        }
      }
      
      // Tags basados en carrera/plantel
      if (prospecto.carrera_interes) {
        autoTags.push(prospecto.carrera_interes.toUpperCase());
      }
      
      // Tags estáticos
      autoTags.push('NUEVO', 'MAYO DENTAL');
      
      console.log('🏷️  Tags automáticos generados:', autoTags);
      
      // 3️⃣ Preparar notas inteligentes con toda la información del prospecto
      const smartNotes = [
        `🦷 PROSPECTO MAYO DENTAL - ${new Date().toLocaleString('es-MX')}`,
        `📊 Score de Interés: ${prospecto.score_interes}/100`,
        `📈 Probabilidad Conversión: ${prospecto.probabilidad_conversion || 'N/A'}%`,
        `🔄 Estado Embudo: ${prospecto.estado_embudo}`,
        `📞 Teléfono: ${prospecto.numero_telefono}`,
        '',
        `📋 RESUMEN IA:`,
        prospecto.resumen_ia || 'Sin resumen disponible',
        '',
        `💬 PERFIL COMUNICACIÓN:`,
        prospecto.perfil_comunicacion || 'estandar',
        '',
        `💡 Generado automáticamente desde el Monitor Mayo Dental`
      ].join('\n');
      
      console.log('📝 Notas inteligentes generadas:', smartNotes);
      
      // 4️⃣ Crear el lead con todos los datos
      const leadData = {
        name: leadName,
        price: estimatedPrice,
        status_id: selectedStatus.id,
        pipeline_id: 10619619, // Pipeline de Mayo Dental
        tags: autoTags,
        contact_id: createdContactId,
        notes: smartNotes
      };
      
      console.log('=== 🚀 LEAD DATA COMPLETO A ENVIAR ===');
      console.log('Lead data completo:', JSON.stringify(leadData, null, 2));
      
      // 5️⃣ Intentar crear el lead con diferentes status si falla
      let leadCreated = false;
      let lastError = null;
      
      for (let i = 0; i < statusesToTry.length; i++) {
        const status = statusesToTry[i];
        console.log(`\n🔄 Intento ${i + 1}/${statusesToTry.length} con status:`, status);
        
        try {
          const leadResult = await createLead({
            ...leadData,
            status_id: status.id
          });
          
          console.log(`✅ ¡Éxito con status "${status.name}" (ID: ${status.id})!`);
          
          // Actualizar el prospecto con la información de Kommo
          if (leadResult && leadResult._embedded && leadResult._embedded.leads && leadResult._embedded.leads[0]) {
            const createdLead = leadResult._embedded.leads[0];
            console.log('✅ Lead completo creado con ID:', createdLead.id);
            
            // Actualizar prospecto en la base de datos
            await updateProspecto(prospecto.id, {
              kommo_lead_id: createdLead.id.toString(),
              kommo_contact_id: createdContactId?.toString() || null
            });
            
            console.log('✅ Prospecto actualizado con información de Kommo');
          }
          
          leadCreated = true;
          break;
        } catch (leadError) {
          lastError = leadError;
          console.log(`❌ Falló con status "${status.name}" (ID: ${status.id}):`, leadError.message);
          
          if (i < statusesToTry.length - 1) {
            console.log('🔄 Probando con el siguiente status...');
          }
        }
      }
      
      if (!leadCreated) {
        throw new Error(`No se pudo crear el lead con ningún status. Último error: ${lastError?.message}`);
      }
      
      // 6️⃣ Mensaje de éxito
      alert(`✅ Prospecto enviado exitosamente a Kommo!\n\n📊 Lead creado con precio: $${estimatedPrice.toLocaleString('es-MX')}\n🏷️ Tags: ${autoTags.join(', ')}\n👤 Contacto: ${createdContactId ? 'Sí' : 'No'}`);
      
    } catch (error) {
      console.error('Error enviando a Kommo:', error);
      alert(`❌ Error enviando a Kommo: ${error.message}`);
    } finally {
      setSendingToKommo(null);
    }
  }, [createLead, createContact, pipelines, leads, updateProspecto]);

  const ProspectoDetail: React.FC<{ prospecto: ProspectoMkt }> = ({ prospecto }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {prospecto.nombre || 'Sin nombre'}
        </h3>
        <button
          onClick={() => handleSendToKommo(prospecto)}
          disabled={sendingToKommo === prospecto.id.toString()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Building2 size={16} />
          {sendingToKommo === prospecto.id.toString() ? 'Enviando...' : 'Enviar a Kommo'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-600">Teléfono:</span>
          <p className="text-gray-800">{prospecto.numero_telefono}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Score:</span>
          <p className="text-gray-800">{prospecto.score_interes}/100</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Estado:</span>
          <p className="text-gray-800">{prospecto.estado_embudo}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Presupuesto:</span>
          <p className="text-gray-800">
            {prospecto.presupuesto_mencionado ? `$${prospecto.presupuesto_mencionado.toLocaleString('es-MX')}` : 'No especificado'}
          </p>
        </div>
      </div>
      
      {prospecto.resumen_ia && (
        <div className="mt-4">
          <span className="font-medium text-gray-600">Resumen IA:</span>
          <p className="text-gray-800 mt-1">{prospecto.resumen_ia}</p>
        </div>
      )}
      
      {prospecto.kommo_lead_id && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            ✅ Ya enviado a Kommo (Lead ID: {prospecto.kommo_lead_id})
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando prospectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Prospectos Mayo Dental</h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{prospectos.length}</div>
            <div className="text-sm text-gray-500">Total de Prospectos</div>
          </div>
        </div>

        <div className="space-y-6">
          {prospectos.map((prospecto) => (
            <ProspectoDetail key={prospecto.id} prospecto={prospecto} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProspectosView;