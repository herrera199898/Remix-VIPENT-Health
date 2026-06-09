import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Download, Shield, Activity, Calendar, FileText, 
  ChevronRight, Heart, AlertTriangle, CheckCircle, Clock, Info, HelpCircle, 
  Stethoscope, FlaskConical, ChevronDown, ChevronUp, Plus, Edit, 
  Phone, Mail, CalendarDays, TrendingUp, BarChart2, Eye, User, Settings, Search, Bell,
  Apple
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Patient } from '../types';

interface PatientDetailsProps {
  patient: Patient;
  onEditProfile: () => void;
  onBack: () => void;
}

export default function PatientDetails({ patient, onEditProfile, onBack }: PatientDetailsProps) {
  // Tabs matched to the image: 'timeline' (Historial Clínico), 'labs' (Resultados Lab), 'treatments' (Tratamientos Activos), 'docs' (Documentos)
  const [activeTab, setActiveTab] = useState<'timeline' | 'labs' | 'treatments' | 'docs'>('timeline');
  const [timelineFilter, setTimelineFilter] = useState<'all' | '6months' | '12months'>('all');
  
  // Track open/closed state for consultations
  const [expandedConsultations, setExpandedConsultations] = useState<Record<number, boolean>>({
    0: true, // Expand first element by default for a rich detailed visualization
    1: false,
    2: false,
  });

  // Dynamic next scheduled controls state
  const [appointments, setAppointments] = useState<Record<string, { date: string; time: string; status: string }>>({
    medico: { date: "2026-04-05", time: "10:30", status: "Programada" },
    enfermera: { date: "", time: "", status: "Sin Reservar" },
    nutricionista: { date: "2026-04-05", time: "15:00", status: "Programada" }
  });

  // Schedule Modal controls states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<'medico' | 'enfermera' | 'nutricionista'>('medico');
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formStatus, setFormStatus] = useState("Programada");
  const [isNewConsultationMode, setIsNewConsultationMode] = useState(false);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // If of format YYYY-MM-DD
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return dateStr;
  };

  const getNextAppointmentDisplay = () => {
    const med = appointments.medico;
    if (med.date && med.status !== 'Cancelada') {
      return `${formatDateDisplay(med.date)} - ${med.time}`;
    }
    const nut = appointments.nutricionista;
    if (nut.date && nut.status !== 'Cancelada') {
      return `${formatDateDisplay(nut.date)} - ${nut.time}`;
    }
    const enf = appointments.enfermera;
    if (enf.date && enf.status !== 'Cancelada') {
      return `${formatDateDisplay(enf.date)} - ${enf.time}`;
    }
    return "Sin Citas Activas";
  };

  const openScheduleModal = (specialty: 'medico' | 'enfermera' | 'nutricionista') => {
    setIsNewConsultationMode(false);
    setSelectedSpecialty(specialty);
    const curr = appointments[specialty];
    setFormDate(curr.date || "2026-04-05");
    setFormTime(curr.time || "09:00");
    setFormStatus(curr.status === "Sin Reservar" ? "Programada" : curr.status);
    setIsScheduleModalOpen(true);
  };

  const openNewConsultationModal = () => {
    setIsNewConsultationMode(true);
    setSelectedSpecialty('medico');
    setFormDate("");
    setFormTime("");
    setFormStatus("");
    setIsScheduleModalOpen(true);
  };

  const handleSaveAppointment = () => {
    setAppointments(prev => ({
      ...prev,
      [selectedSpecialty]: {
        date: formDate,
        time: formTime,
        status: formStatus || "Programada"
      }
    }));
    setIsScheduleModalOpen(false);
  };

  const getSpecialtyContext = (spec: string) => {
    switch (spec) {
      case 'medico':
        return {
          title: 'Control Médico PSCV',
          description: 'Ajuste de dosis farmacológicas, evaluación clínica de metas de compensación (HbA1c < 7%, P.A. < 140/90) y detección precoz de daño en órgano blanco.',
          bg: 'bg-blue-50/60 border-blue-150 text-blue-800',
          iconColor: 'text-blue-600'
        };
      case 'enfermera':
        return {
          title: 'Control de Enfermería PSCV',
          description: 'Seguimiento de constantes vitales, educación y fomento de adherencia farmacológica, empoderamiento del autocuidado y categorización de riesgo cardiovascular.',
          bg: 'bg-indigo-50/60 border-indigo-150 text-indigo-900',
          iconColor: 'text-indigo-600'
        };
      case 'nutricionista':
        return {
          title: 'Control Nutricional PSCV',
          description: 'Evaluación y ajuste antropométrico (peso, IMC, perímetro de cintura), diseño e instrucción de dietoterapia cardioprotectora y fomento de alimentación saludable.',
          bg: 'bg-emerald-50/60 border-emerald-150 text-emerald-900',
          iconColor: 'text-emerald-600'
        };
      default:
        return {
          title: 'Control Clínico General',
          description: 'Análisis preventivo en el programa de salud cardiovascular para asegurar la continuidad del cuidado continuo.',
          bg: 'bg-slate-50 border-slate-150 text-slate-800',
          iconColor: 'text-slate-600'
        };
    }
  };

  const toggleConsultation = (index: number) => {
    setExpandedConsultations(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Identify selected patient
  const isTargetPatient = patient.name.toUpperCase().includes('ABUD') || patient.rut.includes('10034682');

  // Hardcoded real patient data representing exact requested metrics
  const patientData = {
    name: isTargetPatient ? "ABUD VALENZUELA CRISTIAN ALEJANDRO" : patient.name,
    status: "Activo",
    rut: isTargetPatient ? "10034682" : patient.rut,
    id: isTargetPatient ? "P-X1I52N" : `P-${patient.id}X99Y`,
    age: isTargetPatient ? "54 años" : "45 años",
    gender: isTargetPatient ? "M" : (patient.gender || "M"),
    sector: "Sin Sector",
    program: "Estado en Programa",
    risk: isTargetPatient ? "Alto" : (patient.risk || "Alto"),
    phone: isTargetPatient ? "+56 9 8765 4321" : (patient.phone || "+56 9 1234 5678"),
    email: isTargetPatient ? "cristian.abud@email.com" : (patient.email || "paciente@email.com"),
    prevision: "FONASA Tramo C",
  };

  // Medical exam validity dates
  const examValidity = [
    { name: "Fondo de Ojo", status: "Sin Registro", last: null, expiry: null },
    { name: "ECG", status: "Vigente", last: "05-01-2026", expiry: "05-01-2027" },
    { name: "RAC (Urina)", status: "Vigente", last: "05-01-2026", expiry: "05-01-2027" },
    { name: "Eval. Pie Diabético", status: "Sin Registro", last: null, expiry: null },
    { name: "Curación", status: "Sin Registro", last: null, expiry: null }
  ];

  // The 9 clinical consultations chronologically provided in the patient's record
  const consultations = [
    {
      date: "05-01-2026",
      risk: "Alto",
      professional: "Cecilia Fuentes Vallejos",
      role: "Enfermera (o)",
      professionalId: "10092869",
      title: "Consulta Control Cardiovascular",
      description: "Paciente acude a control de hipertensión y dislipidemia. Se describe compensación de presión arterial y cumplimiento del régimen alimentario de manera parcial. Metas logradas en general.",
      vitals: {
        weight: "105.4 kg",
        height: "178 cm",
        imc: "33.3",
        bp: "129/79 mmHg",
        glycemia: "141 mg/dL",
        nutritionalStatus: "4:Obesa"
      },
      labs: {
        colesterolTotal: "108 mg/dL",
        colesterolHdl: "47.5 mg/dL",
        colesterolLdl: "41.1 mg/dL",
        trigliceridos: "97 mg/dL",
        hba1c: "5.6 %",
        vfg: "155 ml/min/1.73m²",
        rac: "2 mg/g"
      },
      pharmacology: [
        "Enalapril (Enalapril, Losartán)",
        "Atorvastatina (Estatina)",
        "Otros Antihipertensivos"
      ],
      diagnoses: [
        "Hipertensión",
        "Diabetes Mellitus Tipo 2",
        "Dislipidemia",
        "Obesidad Crónica"
      ],
      badge: "Receta Emitida"
    },
    {
      date: "10-11-2025",
      risk: "Alto",
      professional: "Jenifer Susan Armijo Allendes",
      role: "Nutricionista",
      professionalId: "15409738",
      title: "Consulta de Nutrición y Dieta",
      description: "Control de antropometría. Disminución de peso corporal lograda desde último ingreso (-0.3 kg). Se redefinen metas calóricas y pautas de actividad física adaptadas.",
      vitals: {
        weight: "103.5 kg",
        height: "178 cm",
        imc: "32.7",
        bp: "136/88 mmHg",
        glycemia: "141 mg/dL",
        nutritionalStatus: "4:Obesa"
      },
      labs: {
        colesterolTotal: "108 mg/dL",
        colesterolHdl: "47.5 mg/dL",
        colesterolLdl: "41.1 mg/dL",
        trigliceridos: "97.5 mg/dL",
        hba1c: "5.3 %",
        vfg: "155 ml/min/1.73m²",
        rac: "8.6 mg/g"
      },
      pharmacology: [
        "Enalapril, Losartán",
        "Estatina"
      ],
      diagnoses: [
        "Hipertensión",
        "Diabetes",
        "Dislipidemia",
        "Obesidad",
        "ERC"
      ],
      badge: "Plan Dietoterapéutico Activo"
    },
    {
      date: "03-11-2025",
      risk: "Alto",
      professional: "Constanza Bermont Portilla",
      role: "Médico",
      professionalId: "18526261",
      title: "Consulta Médica General PSCV",
      description: "Paciente solicita ajuste para su medicación crónica. Explica buena tolerancia gástrica al Losartán y Enalapril. Examen físico cardiovascular normal con ligera resistencia a la insulina.",
      vitals: {
        weight: "103.8 kg",
        height: "178 cm",
        imc: "32.8",
        bp: "136/88 mmHg",
        glycemia: "141 mg/dL",
        nutritionalStatus: "4:Obesa"
      },
      labs: {
        colesterolTotal: "108 mg/dL",
        colesterolHdl: "47.5 mg/dL",
        colesterolLdl: "41.1 mg/dL",
        trigliceridos: "97.5 mg/dL",
        hba1c: "5.3 %",
        vfg: "155 ml/min/1.73m²",
        rac: "8.6 mg/g"
      },
      pharmacology: [
        "Enalapril, Losartán",
        "Estatina",
        "Otros Antihipertensivos"
      ],
      diagnoses: [
        "Hipertensión",
        "Diabetes",
        "Dislipidemia",
        "Obesidad",
        "ERC"
      ],
      badge: "Medicamentos Autorizados"
    },
    {
      date: "06-08-2025",
      risk: "Alto",
      professional: "Cecilia Fuentes Vallejos",
      role: "Enfermera (o)",
      professionalId: "10092869",
      title: "Control de Seguimiento Intermedio",
      description: "Actualización de plan de cuidados. Disregulación tensional compensada tras asimilación de pautas físicas terapéuticas semanales.",
      vitals: {
        weight: "104 kg",
        height: "176 cm",
        imc: "33.6",
        bp: "125/79 mmHg",
        glycemia: "139 mg/dL",
        nutritionalStatus: "4:Obesa"
      },
      labs: {
        colesterolTotal: "90.7 mg/dL",
        colesterolHdl: "40.8 mg/dL",
        colesterolLdl: "35 mg/dL",
        trigliceridos: "74.7 mg/dL",
        hba1c: "6.4 %",
        vfg: "91.4 ml/min/1.73m²",
        rac: "8.6 mg/g"
      },
      pharmacology: [
        "Enalapril, Losartán",
        "Estatina",
        "Otros Antihipertensivos"
      ],
      diagnoses: [
        "Hipertensión",
        "Diabetes",
        "Dislipidemia",
        "Obesidad",
        "ERC"
      ],
      badge: "Receta Emitida"
    },
    {
      date: "06-06-2025",
      risk: null,
      professional: "Jonathan Andrés Badillo Jaramillo",
      role: "Enfermera (o)",
      professionalId: "18474397",
      title: "Prestaciones Clínicas en Box",
      description: "Realización de atenciones enfermeras en box. Se procede a realizar curación en extremidad inferior y toma electrocardiográfica correspondiente.",
      vitals: null,
      labs: null,
      pharmacology: null,
      diagnoses: null,
      procedures: [
        "Curación Compleja",
        "Curación Simple Ambulatoria",
        "Electrocardiograma"
      ],
      badge: "Procedimientos Realizados"
    },
    {
      date: "30-05-2025",
      risk: null,
      professional: "Chantal Anais Mienert Muñoz",
      role: "Médico",
      professionalId: "20276740",
      title: "Evaluación Médica de Descompensación",
      description: "Evaluación de sintomatología aguda por glicemia elevada (234 mg/dL). Se realiza diagnóstico clínico diferencial exhaustivo.",
      vitals: {
        weight: "112.5 kg",
        height: "176 cm",
        imc: "36.3",
        bp: "140/89 mmHg",
        glycemia: "234 mg/dL",
        nutritionalStatus: "4:Obesa"
      },
      labs: {
        colesterolTotal: "138 mg/dL",
        colesterolHdl: "40 mg/dL",
        colesterolLdl: "68 mg/dL",
        trigliceridos: "144 mg/dL",
        hba1c: "8.3 %",
        vfg: "95 ml/min/1.73m²",
        rac: "95 mg/g"
      },
      badge: "Orden de Reposo / Interconsulta"
    },
    {
      date: "05-05-2025",
      risk: "Alto",
      professional: "Tania Gamboa Torres",
      role: "Nutricionista",
      professionalId: "20025336",
      title: "Control de Peso e Ingreso Nutricional",
      description: "Identificación de hábitos de conducta sedentarios severos. El paciente reporta nula actividad deportiva. Perímetro abdominal de 113 cm registrado.",
      vitals: {
        weight: "110 kg",
        height: "176 cm",
        imc: "35.5",
        bp: "147/84 mmHg",
        glycemia: "163 mg/dL",
        nutritionalStatus: "4:Obesa",
        sedentary: "Sedentarismo",
        waist: "113 cm"
      },
      labs: {
        colesterolTotal: "138 mg/dL",
        colesterolHdl: "40 mg/dL",
        colesterolLdl: "77 mg/dL",
        trigliceridos: "107 mg/dL",
        hba1c: "7.6 %",
        vfg: null,
        rac: null
      },
      pharmacology: [
        "Enalapril, Losartán",
        "Estatina",
        "Otros Antihipertensivos"
      ],
      diagnoses: [
        "Hipertensión",
        "Diabetes",
        "Dislipidemia",
        "Obesidad",
        "ERC"
      ],
      badge: "Educación Alimentaria"
    },
    {
      date: "06-02-2025",
      risk: "Alto",
      professional: "Salome Araneda Bravo",
      role: "Enfermera (o)",
      professionalId: "18655418",
      title: "Mediciones de Control Vitotensiométrico",
      description: "Control de rutina en domicilio / box. Constatación de adhesión a los fármacos antihipertensivos indicados.",
      vitals: {
        weight: "112 kg",
        height: "177 cm",
        imc: "35.8",
        bp: "124/86 mmHg",
        glycemia: null,
        nutritionalStatus: null
      },
      labs: null,
      pharmacology: [
        "Enalapril, Losartán",
        "Estatina",
        "Otros Antihipertensivos"
      ],
      diagnoses: [
        "Hipertensión",
        "Diabetes",
        "Dislipidemia",
        "Obesidad",
        "ERC"
      ],
      badge: "Controles Al Día"
    },
    {
      date: "26-11-2024",
      risk: "Alto",
      professional: "Pablo Mendez Zuñiga",
      role: "Médico",
      professionalId: "19674074",
      title: "Examen de Admisión / Diagnóstico",
      description: "Ingreso primario al Programa de Salud Cardiovascular (PSCV). Presenta diagnóstico cruzado de dislipidemia, diabetes mellitus no insulinorresistente y obesidad grado II severa.",
      vitals: {
        weight: "115.5 kg",
        height: "177 cm",
        imc: "36.9",
        bp: "140/96 mmHg",
        glycemia: "163 mg/dL",
        nutritionalStatus: "4:Obesa",
        sedentary: "Sedentarismo",
        waist: "113 cm"
      },
      labs: {
        colesterolTotal: "138 mg/dL",
        colesterolHdl: "40 mg/dL",
        colesterolLdl: "77 mg/dL",
        trigliceridos: "107 mg/dL",
        hba1c: "5.7 %",
        vfg: "111 ml/min/1.73m²",
        rac: "2.8 mg/g"
      },
      pharmacology: [
        "Enalapril, Losartán",
        "Estatina",
        "Otros Antihipertensivos"
      ],
      diagnoses: [
        "Hipertensión",
        "Diabetes",
        "Dislipidemia",
        "Obesidad",
        "ERC"
      ],
      badge: "Ingreso Completado"
    }
  ];

  // Prepare chart data chronologically
  const chartTrends = [
    { name: '26-11-2024', TAS: 140, TAD: 96, HbA1c: 5.7, Peso: 115.5, Glicemia: 163 },
    { name: '06-02-2025', TAS: 124, TAD: 86, HbA1c: 5.7, Peso: 112, Glicemia: 163 },
    { name: '05-05-2025', TAS: 147, TAD: 84, HbA1c: 7.6, Peso: 110, Glicemia: 163 },
    { name: '30-05-2025', TAS: 140, TAD: 89, HbA1c: 8.3, Peso: 112.5, Glicemia: 234 },
    { name: '06-08-2025', TAS: 125, TAD: 79, HbA1c: 6.4, Peso: 104, Glicemia: 139 },
    { name: '03-11-2025', TAS: 136, TAD: 88, HbA1c: 5.3, Peso: 103.8, Glicemia: 141 },
    { name: '10-11-2025', TAS: 136, TAD: 88, HbA1c: 5.3, Peso: 103.5, Glicemia: 141 },
    { name: '05-01-2026', TAS: 129, TAD: 79, HbA1c: 5.6, Peso: 105.4, Glicemia: 141 }
  ];

  const handleExportPDF = () => {
    alert(`Generando y exportando Resumen Clínico PDF de ${patientData.name}...\nCumple con Ley 19.628 de Protección de Datos de Carácter Personal.`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-y-auto" id="patient-details-module">
      
      <div className="p-6 max-w-[1600px] w-full mx-auto space-y-6">

        {/* Dynamic header with clean back navigation */}
        <div className="flex items-center gap-4" id="details-top-branding">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-lg bg-white border border-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-3xs"
            title="Volver al listado de pacientes"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">Detalle del Paciente</h1>
        </div>

        {/* PROFILE HEADER CARD (VIPENT exact mapping) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6" id="patient-card-board">
          
          {/* Left Column: Avatar + Essential demographics + Action buttons */}
          <div className="flex flex-1 flex-col sm:flex-row items-center sm:items-start gap-5">
            
            {/* Elegant avatar mock profile */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-200 to-blue-50 border border-slate-300 flex items-center justify-center text-slate-400 font-bold overflow-hidden shadow-2xs">
                {isTargetPatient ? (
                  // Custom handsome graphic layout for Cristian Abud
                  <div className="flex flex-col items-center justify-center text-center space-y-1">
                    <User size={38} className="text-blue-600/80" />
                    <span className="text-[10px] bg-blue-650 bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">ACTIVO</span>
                  </div>
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
            </div>

            {/* Middle Data */}
            <div className="flex-1 text-center sm:text-left space-y-1 mt-1 sm:mt-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-gray-950 tracking-tight" id="patient-name-display">
                  {patientData.name}
                </h1>
              </div>
              
              <p className="text-sm text-slate-500 font-bold">
                RUT: <span className="text-slate-900 font-mono font-black">{patientData.rut}</span> |
                Edad: <span className="text-slate-900 font-black">{patientData.age}</span> |
                Sexo: <span className="text-slate-900 font-black">{patientData.gender === "M" ? "Masculino" : (patientData.gender === "F" ? "Femenino" : patientData.gender)}</span>
              </p>

              {/* Patient header buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-3">
                <button 
                  onClick={openNewConsultationModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  Nueva Consulta
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Split demographics stats layout exactly as layout in VIPENT */}
          <div className="w-full md:w-auto md:min-w-[400px] border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-8 flex flex-col justify-center text-sm font-medium">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-slate-700">
              
              {/* Row 1 */}
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Teléfono</span>
                <span className="text-slate-900 font-bold text-sm block">{patientData.phone}</span>
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Email</span>
                <span className="text-slate-905 text-slate-800 font-bold text-sm block truncate max-w-[180px]" title={patientData.email}>
                  {patientData.email}
                </span>
              </div>

              {/* Row 2 */}
              <div className="pt-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Última Atención</span>
                <span className="text-slate-800 font-bold text-xs block">
                  {consultations[0].date} - {consultations[0].professional.split(' ')[0]} ({consultations[0].role})
                </span>
              </div>
              <div className="pt-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Próxima Cita</span>
                <span className="text-blue-600 font-black text-xs block flex items-center gap-1">
                  <Calendar size={12} />
                  {getNextAppointmentDisplay()}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* MAIN TABBED INTERACTIVE CARD PANEL */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs" id="tabs-container-card">
          
          {/* Exact tabs header style (VIPENT aesthetic) */}
          <div className="flex border-b border-gray-250/70 bg-slate-50/50 rounded-t-xl overflow-x-auto" id="tabs-header-group">
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-4 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none whitespace-nowrap ${
                activeTab === 'timeline' 
                  ? 'border-blue-600 text-blue-600 bg-white font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/40'
              }`}
            >
              <Activity size={15} />
              Historial Clínico
            </button>
            <button 
              onClick={() => setActiveTab('labs')}
              className={`px-6 py-4 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none whitespace-nowrap ${
                activeTab === 'labs' 
                  ? 'border-blue-600 text-blue-600 bg-white font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/40'
              }`}
            >
              <FlaskConical size={15} />
              Resultados Lab
            </button>
            <button 
              onClick={() => setActiveTab('treatments')}
              className={`px-6 py-4 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none whitespace-nowrap ${
                activeTab === 'treatments' 
                  ? 'border-blue-600 text-blue-600 bg-white font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/40'
              }`}
            >
              <Shield size={15} />
              Tratamientos Activos
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-6 py-4 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none whitespace-nowrap ${
                activeTab === 'docs' 
                  ? 'border-blue-600 text-blue-600 bg-white font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/40'
              }`}
            >
              <FileText size={15} />
              Documentos
            </button>
          </div>

          <div className="p-6 overflow-hidden" id="tabs-contents-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="w-full flex flex-col"
              >
                {/* TAB 1: CLINICAL TIMELINE (Double columns exact layout match) */}
                {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="timeline-workframe">
                
                {/* LEFT 2 COLUMNS: Timeline items */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Reciente Evolución header and filter selects */}
                  <div className="flex items-center justify-between border-b border-slate-150 pb-3" id="recent-evolution-bar">
                    <h3 className="text-lg font-black text-gray-950 tracking-tight">
                      Evolución Reciente
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      {/* Interactive Timeframe Filter matching image UI */}
                      <select 
                        value={timelineFilter}
                        onChange={(e) => setTimelineFilter(e.target.value as any)}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold px-3 py-1.5 text-slate-705 outline-none cursor-pointer"
                      >
                        <option value="all">Ver todas las atenciones ({consultations.length})</option>
                        <option value="6months">Últimos 6 meses</option>
                        <option value="12months">Últimos 12 meses</option>
                      </select>
                      
                      <button 
                        onClick={() => {
                          setTimelineFilter('all');
                          alert('Filtros clínicos restablecidos. Mostrando todas las atenciones médicas.');
                        }}
                        className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg"
                        title="Restablecer Filtros"
                      >
                        <Settings size={15} />
                      </button>
                    </div>
                  </div>

                  {/* CHRONOLOGICAL TIMELINE BLOCK */}
                  <div className="relative pl-6 border-l-2 border-slate-200/90 space-y-6 ml-3" id="timeline-flow">
                    {consultations
                      .filter(c => {
                        if (timelineFilter === '6months') {
                          // Mock filter dates in 2025/2026
                          return c.date.endsWith('2026') || c.date.includes('-11-2025');
                        }
                        if (timelineFilter === '12months') {
                          return !c.date.endsWith('2024');
                        }
                        return true;
                      })
                      .map((consult, idx) => {
                        const isExpanded = !!expandedConsultations[idx];
                        const hasLabs = !!consult.labs;
                        const hasProcedures = !!consult.procedures;

                        // Medical criteria helper to determine clinical compensation status
                        const isCompensated = () => {
                          if (!consult.vitals) return true; // No vitals taken, assumed stable or procedural
                          
                          let isBpOk = true;
                          let isGlyOk = true;

                          if (consult.vitals.bp) {
                            const bpClean = consult.vitals.bp.split(' ')[0];
                            const [sysStr, diaStr] = bpClean.split('/');
                            const sys = parseInt(sysStr, 10);
                            const dia = parseInt(diaStr, 10);
                            if (!isNaN(sys) && sys >= 140) isBpOk = false;
                            if (!isNaN(dia) && dia >= 90) isBpOk = false;
                          }

                          if (consult.vitals.glycemia) {
                            const glyClean = consult.vitals.glycemia.split(' ')[0];
                            const gly = parseInt(glyClean, 10);
                            if (!isNaN(gly) && gly > 150) isGlyOk = false;
                          }

                          return isBpOk && isGlyOk;
                        };

                        const compensated = isCompensated();
                        const r = consult.role.toLowerCase();

                        // Two-tone high-contrast bi-color styles: 
                        // Blue tones for compensated, red tones for decompensated.
                        const iconBgClass = compensated 
                          ? 'bg-blue-50 border-2 border-blue-400 text-blue-600 shadow-xs hover:bg-blue-100' 
                          : 'bg-red-50 border-2 border-red-400 text-red-650 text-red-600 shadow-xs hover:bg-red-100';

                        // Select the representative icon shape according to role
                        const renderRoleIcon = () => {
                          if (r.includes('médico') || r.includes('medico')) {
                            return <Stethoscope size={16} />;
                          }
                          if (r.includes('nutricionista')) {
                            return <Apple size={16} />;
                          }
                          if (r.includes('enfermer')) {
                            return <Activity size={16} />;
                          }
                          return <Info size={16} />;
                        };

                        return (
                          <div key={idx} className="relative group" id={`consultation-node-${idx}`}>
                            
                            {/* Marker circle on the absolute left of the line */}
                            <span className="absolute -left-[37px] top-4 shrink-0 flex items-center justify-center">
                              <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${iconBgClass}`}>
                                {renderRoleIcon()}
                              </div>
                            </span>

                            {/* Card Content styled beautifully according to image */}
                            <div className={`bg-white border rounded-xl overflow-hidden shadow-2xs transition-all ${
                              isExpanded ? 'border-blue-300 ring-1 ring-blue-50/50' : 'border-slate-200 hover:border-slate-250'
                            }`}>
                              
                              {/* Header Trigger */}
                              <div 
                                onClick={() => toggleConsultation(idx)}
                                className="p-4 flex flex-wrap justify-between items-center bg-slate-50/40 hover:bg-slate-50/70 border-b border-slate-150 cursor-pointer select-none gap-4"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="font-bold text-xs text-blue-600 uppercase font-mono bg-blue-50/60 border border-blue-100 px-2 py-0.5 rounded-md">
                                      {consult.date}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full border ${
                                      r.includes('médico') || r.includes('medico')
                                        ? 'bg-blue-100/75 border-blue-200 text-blue-850 text-blue-800'
                                        : r.includes('nutricionista')
                                        ? 'bg-amber-100/75 border-amber-200 text-amber-850 text-amber-800'
                                        : 'bg-emerald-100/75 border-emerald-200 text-emerald-850 text-emerald-800'
                                    }`}>
                                      {consult.role}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-500 font-bold">
                                    Atendido por: <span className="text-slate-800 font-extrabold">{consult.professional}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                  {/* Quick Metrics display of arterial pressure & blood glucose (Glicemia) side-by-side! */}
                                  <div className="flex items-center gap-2">
                                    {consult.vitals?.bp && (
                                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 flex items-center gap-1.5 font-bold shadow-3xs hover:border-slate-300">
                                        <Heart size={11} className="text-red-500 fill-red-100 shrink-0" />
                                        P.A: <span className="font-mono text-slate-950 font-extrabold">{consult.vitals.bp.split(' ')[0]}</span> <span className="text-[9px] text-slate-400 font-semibold">mmHg</span>
                                      </span>
                                    )}
                                    {consult.vitals?.glycemia && (
                                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 flex items-center gap-1.5 font-bold shadow-3xs hover:border-slate-300">
                                        <Activity size={11} className="text-blue-500 shrink-0" />
                                        Glicemia: <span className="font-mono text-slate-950 font-extrabold">{consult.vitals.glycemia.split(' ')[0]}</span> <span className="text-[9px] text-slate-400 font-semibold">mg/dL</span>
                                      </span>
                                    )}
                                  </div>

                                  {isExpanded ? (
                                    <ChevronUp size={16} className="text-slate-400" />
                                  ) : (
                                    <ChevronDown size={16} className="text-slate-400" />
                                  )}
                                </div>
                              </div>

                              {/* Accordion Box Body */}
                              {isExpanded && (
                                <div className="p-4 space-y-4 text-xs font-semibold text-slate-700">
                                  
                                  {/* Procedures Render (if exists) */}
                                  {hasProcedures && (
                                    <div className="space-y-1.5 pt-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                        Prestaciones Realizadas en Box
                                      </span>
                                      <div className="flex flex-wrap gap-2">
                                        {consult.procedures?.map((proc, pidx) => (
                                          <span key={pidx} className="bg-emerald-50 border border-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1">
                                            <CheckCircle size={12} className="text-emerald-500" />
                                            {proc}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Metrics & Biophysical Vitals */}
                                  {consult.vitals && (consult.vitals.weight || consult.vitals.imc || consult.vitals.nutritionalStatus || consult.vitals.height) && (
                                    <div className="space-y-1.5 pt-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                        Signos Vitales y Biometría (Otros Registros)
                                      </span>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {consult.vitals.weight && (
                                          <div className="p-2 border border-slate-150 rounded-lg bg-slate-50/40">
                                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Peso</span>
                                            <span className="text-slate-900 font-extrabold text-xs font-mono block">{consult.vitals.weight}</span>
                                          </div>
                                        )}
                                        {consult.vitals.height && (
                                          <div className="p-2 border border-slate-150 rounded-lg bg-slate-50/40">
                                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Estatura</span>
                                            <span className="text-slate-900 font-extrabold text-xs font-mono block">{consult.vitals.height}</span>
                                          </div>
                                        )}
                                        {consult.vitals.imc && (
                                          <div className="p-2 border border-slate-150 rounded-lg bg-slate-50/40">
                                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">IMC</span>
                                            <span className="text-slate-900 font-extrabold text-xs font-mono block">{consult.vitals.imc}</span>
                                          </div>
                                        )}
                                        {consult.vitals.nutritionalStatus && (
                                          <div className="p-2 border border-slate-150 rounded-lg bg-slate-50/40">
                                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Estado Nutricional</span>
                                            <span className="text-red-700 font-black text-xs block">{consult.vitals.nutritionalStatus.replace('4:', '')}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Biological labs if exist rendered as a professional clinical table */}
                                  {hasLabs && consult.labs && (
                                    <div className="space-y-2 pt-1 border-t border-slate-100 mt-2">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                        Exámenes de Laboratorio Obtenidos
                                      </span>
                                      
                                      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-3xs">
                                        <table className="min-w-[600px] w-full text-left border-collapse text-[11px]" id={`labs-table-${idx}`}>
                                          <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                              <th className="py-2.5 px-3">Análisis Clínico / Examen</th>
                                              <th className="py-2.5 px-3">Abrev.</th>
                                              <th className="py-2.5 px-3 text-right">Resultado</th>
                                              <th className="py-2.5 px-3 text-center">Rango de Referencia</th>
                                              <th className="py-2.5 px-3 text-center">Estado Clínico</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                            {/* HbA1c */}
                                            {consult.labs.hba1c && (() => {
                                              const valNum = parseFloat(consult.labs.hba1c);
                                              const isHigh = valNum >= 7.0;
                                              return (
                                                <tr className="hover:bg-slate-50/50 transition-colors">
                                                  <td className="py-2 px-3">
                                                    <span className="font-extrabold text-slate-950 block">Hemoglobina Glicada</span>
                                                  </td>
                                                  <td className="py-2 px-3 text-slate-500 font-mono text-[10px]">HbA1c</td>
                                                  <td className="py-2 px-3 text-right font-black text-slate-950 font-mono text-xs">{consult.labs.hba1c}</td>
                                                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">&lt; 7.0% (Diabético compensado)</td>
                                                  <td className="py-2 px-3 text-center">
                                                    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                      isHigh 
                                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                      {isHigh ? 'Fuera de Rango' : 'Compensado'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            })()}

                                            {/* Colesterol Total */}
                                            {consult.labs.colesterolTotal && (() => {
                                              const valNum = parseFloat(consult.labs.colesterolTotal);
                                              const isHigh = valNum >= 200;
                                              return (
                                                <tr className="hover:bg-slate-50/50 transition-colors">
                                                  <td className="py-2 px-3">
                                                    <span className="font-extrabold text-slate-950 block">Colesterol Total</span>
                                                  </td>
                                                  <td className="py-2 px-3 text-slate-500 font-mono text-[10px]">COL-T</td>
                                                  <td className="py-2 px-3 text-right font-black text-slate-950 font-mono text-xs">{consult.labs.colesterolTotal}</td>
                                                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">&lt; 200 mg/dL (Normal)</td>
                                                  <td className="py-2 px-3 text-center">
                                                    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                      isHigh 
                                                        ? 'bg-red-50 text-red-700 border border-red-250' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                      {isHigh ? 'Elevado' : 'Óptimo'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            })()}

                                            {/* Colesterol LDL */}
                                            {consult.labs.colesterolLdl && (() => {
                                              const valNum = parseFloat(consult.labs.colesterolLdl);
                                              const isHighForHighRisk = valNum >= 100; // Under 70 for very high CV risk
                                              return (
                                                <tr className="hover:bg-slate-50/50 transition-colors">
                                                  <td className="py-2 px-3">
                                                    <span className="font-extrabold text-slate-950 block">Colesterol LDL</span>
                                                  </td>
                                                  <td className="py-2 px-3 text-slate-500 font-mono text-[10px]">LDL</td>
                                                  <td className="py-2 px-3 text-right font-black text-slate-950 font-mono text-xs">{consult.labs.colesterolLdl}</td>
                                                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">&lt; 100 mg/dL (&lt; 70 en alto riesgo)</td>
                                                  <td className="py-2 px-3 text-center">
                                                    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                      isHighForHighRisk 
                                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                      {isHighForHighRisk ? 'Elevado' : 'Óptimo bajo control'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            })()}

                                            {/* Colesterol HDL */}
                                            {consult.labs.colesterolHdl && (
                                              <tr className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-2 px-3">
                                                  <span className="font-extrabold text-slate-950 block">Colesterol HDL</span>
                                                </td>
                                                <td className="py-2 px-3 text-slate-500 font-mono text-[10px]">HDL</td>
                                                <td className="py-2 px-3 text-right font-black text-slate-950 font-mono text-xs">{consult.labs.colesterolHdl}</td>
                                                <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">&gt; 40 mg/dL (Masculino)</td>
                                                <td className="py-2 px-3 text-center">
                                                  <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Protector Activo
                                                  </span>
                                                </td>
                                              </tr>
                                            )}

                                            {/* Trigliceridos */}
                                            {consult.labs.trigliceridos && (() => {
                                              const valNum = parseFloat(consult.labs.trigliceridos);
                                              const isHigh = valNum >= 150;
                                              return (
                                                <tr className="hover:bg-slate-50/50 transition-colors">
                                                  <td className="py-2 px-3">
                                                    <span className="font-extrabold text-slate-950 block">Triglicéridos</span>
                                                  </td>
                                                  <td className="py-2 px-3 text-slate-500 font-mono text-[10px]">TG</td>
                                                  <td className="py-2 px-3 text-right font-black text-slate-950 font-mono text-xs">{consult.labs.trigliceridos}</td>
                                                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">&lt; 150 mg/dL</td>
                                                  <td className="py-2 px-3 text-center">
                                                    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                      isHigh 
                                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                      {isHigh ? 'Elevado' : 'Normal'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            })()}

                                            {/* Renal Filtering vfg */}
                                            {consult.labs.vfg && (() => {
                                              const valNum = parseFloat(consult.labs.vfg);
                                              const isLow = valNum < 90;
                                              return (
                                                <tr className="hover:bg-slate-50/50 transition-colors">
                                                  <td className="py-2 px-3">
                                                    <span className="font-extrabold text-slate-950 block">Velocidad de Filtración Glomerular</span>
                                                  </td>
                                                  <td className="py-2 px-3 text-slate-500 font-mono text-[10px]">VFG (CKD-EPI)</td>
                                                  <td className="py-2 px-3 text-right font-black text-slate-950 font-mono text-xs">{consult.labs.vfg.split(' ')[0]} mL/min</td>
                                                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">&gt; 90 mL/min/1.73m²</td>
                                                  <td className="py-2 px-3 text-center">
                                                    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                      isLow 
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                      {isLow ? 'Filtraje disminuido' : 'Función Normal'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            })()}

                                            {/* Albumin Creatinine Ratio rac */}
                                            {consult.labs.rac && (() => {
                                              const valNum = parseFloat(consult.labs.rac);
                                              const isHigh = valNum >= 30;
                                              return (
                                                <tr className="hover:bg-slate-50/50 transition-colors">
                                                  <td className="py-2 px-3">
                                                    <span className="font-extrabold text-slate-950 block">Relación Albúmina / Creatinina (Orina)</span>
                                                  </td>
                                                  <td className="py-2 px-3 text-slate-500 font-mono text-[10px]">RAC</td>
                                                  <td className="py-2 px-3 text-right font-black text-slate-950 font-mono text-xs">{consult.labs.rac}</td>
                                                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">&lt; 30 mg/g (Normal)</td>
                                                  <td className="py-2 px-3 text-center">
                                                    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                      isHigh 
                                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                      {isHigh ? 'Microalbuminuria' : 'Normal / Óptimo'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            })()}

                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}



                                </div>
                              )}

                            </div>
                          </div>
                        );
                      })}
                  </div>

                </div>

                {/* RIGHT 1 COLUMN: Signos Vitales Últimos + Alertas Médicas (VIPENT layout exactly matched) */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Card 1: Signos Vitales Últimos with red/blue high contrast */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4 hover:border-gray-300 transition-all">
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-slate-150 pb-3" id="vitals-side-box">
                      <Heart className="text-red-500 fill-red-100" size={18} />
                      <h4 className="font-black text-gray-950 text-sm tracking-tight">
                        Signos Vitales Últimos
                      </h4>
                    </div>

                    {/* Exact 2x2 Grid with Standard Font sizes, clean design */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Blood pressure */}
                      <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                          Presión Art.
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[17px] font-black tracking-tight text-slate-900 font-mono">
                            129/79
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">
                            mmHg
                          </span>
                        </div>
                      </div>

                      {/* Heart rate */}
                      <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                          Frec. Card.
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[17px] font-black tracking-tight text-slate-900 font-mono">
                            72
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">
                            lpm
                          </span>
                        </div>
                      </div>

                      {/* Weight */}
                      <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                          Peso
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[17px] font-black tracking-tight text-slate-900 font-mono">
                            105.4
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">
                            kg
                          </span>
                        </div>
                      </div>

                      {/* Height */}
                      <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                          Estatura
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[17px] font-black tracking-tight text-slate-900 font-mono">
                            1.78
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">
                            m
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card 2: Diagnósticos Clínicos Activos (Premium white bg with diagnostic states) */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4 hover:border-gray-300 transition-all">
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-slate-150 pb-2.5">
                      <Stethoscope className="text-blue-600 shrink-0" size={17} />
                      <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                        Diagnósticos Activos
                      </h4>
                    </div>

                    {/* Diagnostic list items */}
                    <div className="space-y-3">
                      {/* Diagnosis 1 */}
                      <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex flex-col gap-1 hover:bg-slate-100/60 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            Hipertensión Arterial Primaria
                          </span>
                          <span className="text-[9px] bg-emerald-100 border border-emerald-200 text-emerald-800 font-black uppercase px-2 py-0.5 rounded-md shrink-0">
                            Vigente
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Última P.A: <span className="font-mono text-slate-800 font-extrabold">129/79 mmHg</span> (Estable)
                        </span>
                      </div>

                      {/* Diagnosis 2 */}
                      <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex flex-col gap-1 hover:bg-slate-100/60 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            Diabetes Mellitus Tipo 2
                          </span>
                          <span className="text-[9px] bg-emerald-100 border border-emerald-200 text-emerald-800 font-black uppercase px-2 py-0.5 rounded-md shrink-0">
                            Compensado
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Último HbA1c: <span className="font-mono text-slate-800 font-extrabold">5.6%</span> (En Rango)
                        </span>
                      </div>

                      {/* Diagnosis 3 */}
                      <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex flex-col gap-1 hover:bg-slate-100/60 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            Dislipidemia Mixta
                          </span>
                          <span className="text-[9px] bg-emerald-100 border border-emerald-200 text-emerald-800 font-black uppercase px-2 py-0.5 rounded-md shrink-0">
                            Vigente
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Col. Total: <span className="font-mono text-slate-800 font-extrabold">108 mg/dL</span> (Controlado)
                        </span>
                      </div>

                      {/* Diagnosis 4 */}
                      <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex flex-col gap-1 hover:bg-slate-100/60 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            Obesidad de Grado II
                          </span>
                          <span className="text-[9px] bg-amber-100 border border-amber-200 text-amber-800 font-black uppercase px-2 py-0.5 rounded-md shrink-0">
                            En Control
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          IMC actual: <span className="font-mono text-slate-800 font-extrabold">33.3</span> (Estable)
                        </span>
                      </div>

                      {/* Diagnosis 5 */}
                      <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex flex-col gap-1 hover:bg-slate-100/60 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            Riesgo CV Global (PSCV)
                          </span>
                          <span className="text-[9px] bg-red-100 border border-red-200 text-red-800 font-black uppercase px-2 py-0.5 rounded-md shrink-0">
                            Alto
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Ingresado en programa de salud CV
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Card 3: Cardiovascular Control Agenda (Dynamic with modal triggers) */}
                  <div className="bg-blue-50/40 border border-blue-200/60 rounded-xl p-5 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-blue-200/50 pb-2.5">
                      <Clock className="text-blue-600" size={17} />
                      <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">
                        Controles Próximos Reservados
                      </h4>
                    </div>
                    <div className="space-y-3 text-xs text-slate-705">
                      
                      {/* Médico Row */}
                      <div className="flex justify-between items-center py-1.5 border-b border-blue-100/30">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-700">Próximo Médico:</span>
                          {appointments.medico.date ? (
                            <span className="text-[10px] text-blue-800 font-semibold uppercase bg-blue-50/80 px-1 py-0.2 rounded-md self-start mt-0.5">
                              {appointments.medico.status} • {appointments.medico.time}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Sin programar</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {appointments.medico.date ? (
                            <span className="font-mono font-black text-blue-700 bg-blue-100/50 px-2.5 py-1 rounded-lg">
                              {formatDateDisplay(appointments.medico.date)}
                            </span>
                          ) : (
                            <span className="font-mono font-semibold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-lg">N/A</span>
                          )}
                          <button 
                            onClick={() => openScheduleModal('medico')}
                            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-blue-605 text-blue-600 hover:text-blue-700 rounded-lg shadow-3xs cursor-pointer transition-colors"
                            title="Modificar Cita con Médico"
                          >
                            <Calendar size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Enfermera Row */}
                      <div className="flex justify-between items-center py-1.5 border-b border-blue-100/30">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-700">Próxima Enfermera:</span>
                          {appointments.enfermera.date ? (
                            <span className="text-[10px] text-blue-800 font-semibold uppercase bg-blue-50/80 px-1 py-0.2 rounded-md self-start mt-0.5">
                              {appointments.enfermera.status} • {appointments.enfermera.time}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Sin programar</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {appointments.enfermera.date ? (
                            <span className="font-mono font-black text-blue-700 bg-blue-100/50 px-2.5 py-1 rounded-lg">
                              {formatDateDisplay(appointments.enfermera.date)}
                            </span>
                          ) : (
                            <span className="font-mono font-semibold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-lg">N/A</span>
                          )}
                          <button 
                            onClick={() => openScheduleModal('enfermera')}
                            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-blue-605 text-blue-600 hover:text-blue-700 rounded-lg shadow-3xs cursor-pointer transition-colors"
                            title="Modificar Cita con Enfermera"
                          >
                            <Calendar size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Nutricionista Row */}
                      <div className="flex justify-between items-center py-1.5">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-700">Próxima Nutricionista:</span>
                          {appointments.nutricionista.date ? (
                            <span className="text-[10px] text-emerald-805 text-emerald-800 font-semibold uppercase bg-emerald-50/80 px-1 py-0.2 rounded-md self-start mt-0.5">
                              {appointments.nutricionista.status} • {appointments.nutricionista.time}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Sin programar</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {appointments.nutricionista.date ? (
                            <span className="font-mono font-black text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-lg">
                              {formatDateDisplay(appointments.nutricionista.date)}
                            </span>
                          ) : (
                            <span className="font-mono font-semibold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-lg">N/A</span>
                          )}
                          <button 
                            onClick={() => openScheduleModal('nutricionista')}
                            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-blue-650 text-blue-600 hover:text-blue-700 rounded-lg shadow-3xs cursor-pointer transition-colors"
                            title="Modificar Cita con Nutricionista"
                          >
                            <Calendar size={13} />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: REGISTERED COMPREHENSIVE LABS TAB */}
            {activeTab === 'labs' && (
              <div className="space-y-6" id="labs-tab-workframe">
                
                {/* Heading and visual trends toggle */}
                <div className="border-b border-slate-150 pb-3 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-950 tracking-tight">Historial de Laboratorios</h3>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      Exámenes oficiales registrados en el marco de la ficha PSCV para el paciente.
                    </p>
                  </div>
                  
                  {/* Recharts chart visualization toggle helper */}
                  <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-2">
                    <BarChart2 size={13} className="text-blue-600" />
                    Paciente bajo Metas del Programa Cardiovascular
                  </span>
                </div>

                {/* GRAPHIC OVERVIEW PLOT PANEL */}
                <PatientLabsCharts chartTrends={chartTrends} />

                {/* Laboratories Sheet Grid */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs" id="labs-metrics-sheet">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 text-xs text-slate-500 uppercase font-black tracking-wider">
                        <th className="py-4 px-6 font-bold">Fecha de Toma</th>
                        <th className="py-4 px-6 font-bold text-emerald-700">Hb Glicosilada (HbA1c)</th>
                        <th className="py-4 px-6 font-bold">Colesterol Total</th>
                        <th className="py-4 px-6 font-bold">Colesterol HDL / LDL</th>
                        <th className="py-4 px-6 font-bold">Triglicéridos</th>
                        <th className="py-4 px-6 font-bold">VFG Renal</th>
                        <th className="py-4 px-6 font-bold">RAC Urinario</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-slate-700">
                      {consultations.filter(c => c.labs).map((consult, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-mono font-bold text-slate-900">{consult.date}</td>
                          <td className="py-4 px-6 font-black text-emerald-600 font-mono text-sm">{consult.labs?.hba1c || '—'}</td>
                          <td className="py-4 px-6 font-mono font-semibold">{consult.labs?.colesterolTotal || '—'}</td>
                          <td className="py-4 px-6 text-xs">
                            <span className="font-mono">{consult.labs?.colesterolHdl || '—'}</span> / <span className="font-mono">{consult.labs?.colesterolLdl || '—'}</span>
                          </td>
                          <td className="py-4 px-6 font-mono font-semibold text-slate-800">{consult.labs?.trigliceridos || '—'}</td>
                          <td className="py-4 px-6 font-mono text-xs text-slate-650 text-slate-650 text-slate-600">{consult.labs?.vfg || '—'}</td>
                          <td className="py-4 px-6 font-mono text-blue-600 font-bold text-xs">{consult.labs?.rac || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 3: TRATAMIENTOS ACTIVOS (Pharmacology schematics) */}
            {activeTab === 'treatments' && (
              <div className="space-y-6" id="treatments-tab-workframe">
                
                <div className="border-b border-slate-150 pb-3">
                  <h3 className="text-lg font-black text-gray-950 tracking-tight">Tratamientos Farmacológicos Activos</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    Esquemas de medicamentos indicados para el control de la hipertensión, diabetes y dislipidemia.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="treatments-block">
                  
                  {/* Losartán / Enalapril card detail */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <h4 className="font-extrabold text-slate-950 text-sm flex items-center gap-2">
                          <Shield className="text-blue-600" size={18} />
                          Enalapril, Losartán
                        </h4>
                        <span className="bg-blue-100 text-blue-805 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Antihipertensivo
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700 font-medium">
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-400 font-bold">Esquema asignado:</span>
                          <span className="font-extrabold text-slate-900">Seguimiento en Programa Cardiovascular</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-400 font-bold">Estado Clínico:</span>
                          <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                            <CheckCircle size={13} /> Validado por Médico / Vigente
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400 font-bold">Última revisión:</span>
                          <span className="font-bold text-slate-600">05-01-2026 de Enfermera Cecilia Fuentes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatina card detail */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <h4 className="font-extrabold text-slate-950 text-sm flex items-center gap-2">
                          <Shield className="text-emerald-650 text-emerald-600" size={18} />
                          Estatina (Atorvastatina)
                        </h4>
                        <span className="bg-emerald-100 text-emerald-805 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Hipolipemiante
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700 font-medium">
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-400 font-bold">Esquema asignado:</span>
                          <span className="font-extrabold text-slate-900">Control de Dislipidemia Crónica</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-400 font-bold">Estado Clínico:</span>
                          <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                            <CheckCircle size={13} /> Vigente en Farmacia PSCV
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400 font-bold">Última revisión:</span>
                          <span className="font-bold text-slate-600">05-01-2026</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: HISTORIAL DE DOCUMENTOS (Exactly requested in overall tabs) */}
            {activeTab === 'docs' && (
              <div className="space-y-6" id="docs-tab-workframe">
                
                <div className="border-b border-slate-150 pb-3">
                  <h3 className="text-lg font-black text-gray-950 tracking-tight font-sans">Documentos y Reportes Clínicos</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    Descarga directa de archivos, recetas de farmacia extendidas y vigencias oficiales emitidas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="documents-grid text-sm">
                  
                  {/* Resumen Clínico PDF */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-all shadow-3xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                        PDF
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs md:text-sm">Ficha Resumen PSCV Completa</span>
                        <span className="text-[10px] text-slate-400 block font-semibold leading-tight mt-0.5">Generado: 05-01-2026 | 134 KB</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleExportPDF}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                      title="Descargar Ficha"
                    >
                      <Download size={16} />
                    </button>
                  </div>

                  {/* Receta de Farmacia */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-all shadow-3xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-750 text-blue-700 flex items-center justify-center font-bold">
                        REC
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs md:text-sm">Receta Farmacia Crónicos</span>
                        <span className="text-[10px] text-slate-400 block font-semibold leading-tight mt-0.5">Vence: 05-04-2026 | 98 KB</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert('Abriendo documento PDF de Receta Electrónica de Farmacia...')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                      title="Descargar Receta"
                    >
                      <Download size={16} />
                    </button>
                  </div>

                  {/* Resultados Laboratorio Renal */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-all shadow-3xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        LAB
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs md:text-sm">Resultados Renal - RAC Urinario</span>
                        <span className="text-[10px] text-slate-400 block font-semibold leading-tight mt-0.5">Fecha: 05-01-2026 | 1.2 MB</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert('Abriendo informe detallado de Laboratorio RAC/VFG...')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                      title="Descargar RAC"
                    >
                      <Download size={16} />
                    </button>
                  </div>

                </div>

              </div>
            )}
            </motion.div>
          </AnimatePresence>

          </div>
        </div>

      </div>

      {/* Dynamic Schedule/Modify Control Modal Overlay mimicking requested design */}
      {isScheduleModalOpen && (() => {
        // Patient initials for the sidebar
        const getPatientInitials = (nameStr: string) => {
          if (!nameStr) return "AP";
          const parts = nameStr.trim().split(/\s+/).filter(Boolean);
          if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
          }
          return nameStr.slice(0, 2).toUpperCase();
        };

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="schedule-control-modal-overlay">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative min-h-[360px]">
              
              {/* Left Column (Detalles del Paciente Sidebar) */}
              <div className="w-full md:w-[240px] bg-[#EEF2FC] border-r border-slate-200/50 p-6 flex flex-col justify-between shrink-0 text-left">
                <div className="space-y-6">
                  <h3 className="text-[#0059E4] font-bold text-sm">
                    Detalles del Paciente
                  </h3>
                  
                  {/* Paciente */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                      Paciente
                    </span>
                    <div className="flex items-center gap-2.5">
                      <div className="bg-[#0059E4] text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-2xs">
                        {getPatientInitials(patientData.name)}
                      </div>
                      <span className="text-slate-800 font-bold text-xs leading-tight">
                        {patientData.name}
                      </span>
                    </div>
                  </div>

                  {/* Especialista Dropdown (Allows changing or selecting specialist) */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                      Especialista
                    </span>
                    <div className="relative">
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value as 'medico' | 'enfermera' | 'nutricionista')}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2.5 pl-8 pr-6 text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer appearance-none shadow-3xs"
                      >
                        <option value="medico">Dr. Carlos Mendoza</option>
                        <option value="enfermera">Enf. Camila Silva</option>
                        <option value="nutricionista">Nut. María José</option>
                      </select>
                      <Stethoscope size={13} className="absolute left-2.5 top-[13px] text-[#0059E4] pointer-events-none" />
                      <ChevronDown size={11} className="absolute right-2.5 top-[14px] text-slate-405 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Program / Tipo */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                      Programa / Tipo
                    </span>
                    <span className="inline-block bg-[#FFF0E6] text-[#E65C00] border border-[#FFE5D3] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                      Consulta General
                    </span>
                  </div>
                </div>


              </div>

              {/* Right Column (Form to Schedule) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-white text-left">
                
                {/* Close Button ('X') */}
                <button 
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  <Plus size={16} className="rotate-45" />
                </button>

                <div className="space-y-6">
                  <h4 className="text-[#111827] font-bold text-base">
                    {isNewConsultationMode ? "Programar Nueva Consulta" : "Programar Cita"}
                  </h4>

                  <div className="space-y-5">
                    
                    {/* Grid with Date & Time inputs side-by-side */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Fecha input matching design */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 font-semibold text-xs mb-1 block">
                          Fecha
                        </label>
                        <input 
                          type="date"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 px-3 text-xs font-semibold text-slate-800 outline-none transition-all"
                        />
                      </div>

                      {/* Hora input matching design */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 font-semibold text-xs mb-1 block">
                          Hora
                        </label>
                        <input 
                          type="time"
                          value={formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 px-3 text-xs font-semibold text-slate-800 outline-none transition-all"
                        />
                      </div>

                    </div>

                    {/* Estado de la Cita */}
                    <div className="space-y-1.5">
                      <label className="text-slate-500 font-semibold text-xs mb-1 block">
                        Estado de la Cita
                      </label>
                      <select 
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2.5 px-3 text-xs font-bold text-slate-800 outline-none transition-all cursor-pointer shadow-2xs"
                      >
                        {isNewConsultationMode && <option value="">Seleccione Estado</option>}
                        <option value="Programada">Programada</option>
                        <option value="Realizada">Realizada</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Pendiente">Pendiente</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Footer with Divider & buttons */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-5 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg font-bold text-xs select-none transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveAppointment}
                    className="px-5 py-2 bg-[#0059E4] hover:bg-[#0048B3] text-white rounded-lg font-bold text-xs select-none transition-all cursor-pointer shadow-xs"
                  >
                    Guardar Cambios
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}

// Subcomponent to delay Recharts Rendering inside laboratory tab to avoid "width(-1) and height(-1)" layout warnings
function PatientLabsCharts({ chartTrends }: { chartTrends: any[] }) {
  const containerRef1 = React.useRef<HTMLDivElement>(null);
  const containerRef2 = React.useRef<HTMLDivElement>(null);
  const [width1, setWidth1] = useState(0);
  const [width2, setWidth2] = useState(0);
  const [showBPInfo, setShowBPInfo] = useState(false);
  const [showHbA1cInfo, setShowHbA1cInfo] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef1.current) {
        setWidth1(containerRef1.current.offsetWidth);
      }
      if (containerRef2.current) {
        setWidth2(containerRef2.current.offsetWidth);
      }
    };

    // Use a ResizeObserver to get precise width changes
    const resizeObserver1 = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth1(entry.contentRect.width);
        }
      }
    });

    const resizeObserver2 = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth2(entry.contentRect.width);
        }
      }
    });

    if (containerRef1.current) resizeObserver1.observe(containerRef1.current);
    if (containerRef2.current) resizeObserver2.observe(containerRef2.current);

    // Initial measure
    handleResize();

    // Small delay to let tab sliding animations settle and update final sizes
    const timer = setTimeout(handleResize, 100);

    return () => {
      resizeObserver1.disconnect();
      resizeObserver2.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Format date helper: "26-11-2024" -> "26/11/24"
  const formatTrendDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const shortYear = year.length === 4 ? year.slice(-2) : year;
      // Ensure two digit day and month format
      const formattedDay = day.padStart(2, '0');
      const formattedMonth = month.padStart(2, '0');
      return `${formattedDay}/${formattedMonth}/${shortYear}`;
    }
    return dateStr.replace(/-/g, '/');
  };

  const formattedTrends = (chartTrends || []).map((t: any) => ({
    ...t,
    formattedDate: formatTrendDate(t.name)
  }));

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4" id="visual-trends-block">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Compensación Histórica (HbA1c & Presión)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        
        {/* BP Trend Chart */}
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs relative">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="font-bold text-xs text-slate-800">Evolución Presión Sistólica / Diastólica</span>
            <button
              onClick={() => setShowBPInfo(!showBPInfo)}
              className="text-slate-400 hover:text-blue-600 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Información de unidades"
            >
              <HelpCircle size={15} />
            </button>
          </div>

          <AnimatePresence>
            {showBPInfo && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-4 right-4 top-[48px] z-10 bg-slate-900/95 backdrop-blur-xs text-white p-4.5 rounded-lg shadow-lg text-xs md:text-sm space-y-2.5 border border-slate-800 font-sans leading-relaxed text-left"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                  <span className="font-extrabold text-[#38bdf8] uppercase tracking-wider text-xs">Información de Presión Arterial</span>
                  <button onClick={() => setShowBPInfo(false)} className="text-slate-400 hover:text-white cursor-pointer font-bold text-base">&times;</button>
                </div>
                <p>
                  Medida en <strong className="text-[#38bdf8]">mmHg</strong> (milímetros de mercurio), que evalúa la presión ejercida por la sangre en las paredes arteriales:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong className="text-white">TAS (Sistólica):</strong> Presión máxima generada durante la contracción del corazón.</li>
                  <li><strong className="text-white">TAD (Diastólica):</strong> Presión mínima medida en el reposo entre latidos cardíacos.</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={containerRef1} className="h-[220px] w-full flex items-center justify-center">
            {width1 > 0 ? (
              <LineChart width={width1 - 8} height={220} data={formattedTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={9} tickLine={false} angle={-45} textAnchor="end" height={45} />
                <YAxis domain={[50, 160]} stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `${val} mmHg`} width={58} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="TAS" name="TAS (Sistólica)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="TAD" name="TAD (Diastólica)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <div className="text-[11px] text-gray-400 font-bold">Iniciando vista de presiones...</div>
            )}
          </div>
        </div>

        {/* Weight & HbA1c Trend Chart */}
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs relative">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="font-bold text-xs text-slate-800">Historial Glicosilada (HbA1c %)</span>
            <button
              onClick={() => setShowHbA1cInfo(!showHbA1cInfo)}
              className="text-slate-400 hover:text-emerald-600 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Información de unidades"
            >
              <HelpCircle size={15} />
            </button>
          </div>

          <AnimatePresence>
            {showHbA1cInfo && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-4 right-4 top-[48px] z-10 bg-slate-900/95 backdrop-blur-xs text-white p-4.5 rounded-lg shadow-lg text-xs md:text-sm space-y-2.5 border border-slate-800 font-sans leading-relaxed text-left"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                  <span className="font-extrabold text-[#10b981] uppercase tracking-wider text-xs">Información de HbA1c</span>
                  <button onClick={() => setShowHbA1cInfo(false)} className="text-slate-400 hover:text-white cursor-pointer font-bold text-base">&times;</button>
                </div>
                <p>
                  El porcentaje (<strong className="text-[#10b981]">%</strong>) mide la fracción de hemoglobina que tiene glucosa unida a ella en el torrente sanguíneo.
                </p>
                <p>
                  <strong className="text-white">¿Cómo se obtiene?</strong> Se calcula mediante una prueba de laboratorio que analiza la glicación de los glóbulos rojos. Como éstos viven unos <strong className="text-white">120 días</strong>, este examen revela el promedio retrospectivo de tus niveles de azúcar durante los últimos 3 meses, sin verse afectado por ayunos o alimentos recientes.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={containerRef2} className="h-[220px] w-full flex items-center justify-center">
            {width2 > 0 ? (
              <LineChart width={width2 - 8} height={220} data={formattedTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={9} tickLine={false} angle={-45} textAnchor="end" height={45} />
                <YAxis domain={[4, 10]} stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `${val}%`} width={40} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="HbA1c" name="HbA1c % Glicosilada" stroke="#10b981" strokeWidth={3.5} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <div className="text-[11px] text-gray-400 font-bold">Iniciando vista de glicosilada...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

