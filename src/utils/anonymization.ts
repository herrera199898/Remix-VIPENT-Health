import { Patient } from '../types';

export interface AnonymizedPatient {
  anonymousId: string;
  ageRange: string;
  gender?: string;
  establishment?: 'Hualañé' | 'Curepto';
  pscvStatus: 'Activo' | 'Inactivo';
  risk: 'Alto' | 'Moderado' | 'Bajo';
  diagnoses: string[];
  compensationStatus: string;
  lastControlPeriod: string;
  nextControlStatus: string;
  nextControlPeriod?: string;
  alerts: string[];
  pendingExams: string[];
  appliedTechniques: string[];
}

function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const parts = birthDateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return 0;
}

function getAgeRange(age: number): string {
  if (age < 20) return '< 20';
  if (age < 30) return '20-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  if (age < 70) return '60-69';
  if (age < 80) return '70-79';
  return '80+';
}

function getMonthYear(dateStr: string): string {
  if (!dateStr || dateStr === 'Sin cita') return 'Sin registro';
  try {
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) return 'Sin registro';
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  } catch {
    return 'Sin registro';
  }
}

export function anonymizePatient(patient: Patient): AnonymizedPatient {
  const age = calculateAge(patient.birthDate);
  const ageRange = getAgeRange(age);

  let nextControlStatus = 'Sin próxima cita';
  let nextControlPeriod: string | undefined;

  if (patient.nextAppointmentDate && patient.nextAppointmentDate !== 'Sin cita') {
    const nextDate = new Date(patient.nextAppointmentDate);
    const today = new Date();
    // Assuming comparison logic for Control vigente / vencido
    if (!isNaN(nextDate.getTime())) {
      nextControlPeriod = getMonthYear(patient.nextAppointmentDate);
      if (nextDate >= today) {
        nextControlStatus = 'Control vigente';
      } else {
        nextControlStatus = 'Control vencido';
      }
    }
  }

  // derive compensation label
  let compStatus: string = patient.compensationStatus || 'Sin dato';
  if (compStatus !== 'Compensado' && patient.compensationByCondition) {
      const htaComp = patient.compensationByCondition.hta === 'No compensado';
      const dm2Comp = patient.compensationByCondition.dm2 === 'No compensado';
      if (htaComp && dm2Comp) compStatus = 'No compensado HTA + DM2';
      else if (htaComp) compStatus = 'No compensado HTA';
      else if (dm2Comp) compStatus = 'No compensado DM2';
  }

  // Filter alerts to keep it structured 
  const allowedAlerts = ['Inasistencia reciente', 'Control vencido', 'Examen pendiente', 'Sin próxima cita'];
  let structuredAlerts: string[] = [];
  if (patient.alerts) {
      structuredAlerts = patient.alerts.map(a => {
        const lower = a.toLowerCase();
        if (lower.includes('inasistencia')) return 'Inasistencia reciente';
        if (lower.includes('vencido') || lower.includes('vencida')) return 'Control vencido';
        if (lower.includes('pendiente')) return 'Examen pendiente';
        if (lower.includes('sin próxima cita')) return 'Sin próxima cita';
        return '';
      }).filter(a => a !== '');
  }

  return {
    anonymousId: `ANON-${patient.id.padStart(4, '0')}`,
    ageRange,
    gender: patient.gender,
    establishment: patient.establishment,
    pscvStatus: patient.status,
    risk: patient.risk,
    diagnoses: patient.diagnoses?.filter(d => ['HTA', 'DM2', 'Dislipidemia', 'Obesidad', 'ERC'].includes(d)) || [],
    compensationStatus: compStatus,
    lastControlPeriod: getMonthYear(patient.lastControlDate || ''),
    nextControlStatus,
    nextControlPeriod,
    alerts: Array.from(new Set(structuredAlerts)),
    pendingExams: patient.pendingExams || [],
    appliedTechniques: [
      'Supresión',
      'Tokenización',
      'Generalización',
      'Categorización',
      'Exclusión',
      'Minimización'
    ]
  };
}
