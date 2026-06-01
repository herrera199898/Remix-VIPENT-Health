export type ProfessionalRole = 'MEDICO' | 'NUTRICIONISTA' | 'ENFERMERA';

export interface Patient {
  id: string;
  name: string;
  rut: string;
  birthDate: string;
  status: 'Activo' | 'Inactivo';
  risk: 'Alto' | 'Moderado' | 'Bajo';
  gender?: string;
  phone?: string;
  email?: string;
  establishment?: 'Hualañé' | 'Curepto';
  diagnoses?: string[];
  compensationStatus?: 'Compensado' | 'No compensado' | 'Sin dato';
  compensationByCondition?: {
    hta?: 'Compensado' | 'No compensado' | 'Sin dato' | 'No aplica';
    dm2?: 'Compensado' | 'No compensado' | 'Sin dato' | 'No aplica';
  };
  lastControlDate?: string;
  nextAppointmentDate?: string;
  alerts?: string[];
  pendingExams?: string[];
  clinicalValidityStatus?: string;
  actionStatus?: string;
}

export const PATIENTS_MOCK: Patient[] = [
  { 
    id: '1', 
    name: 'ABUD VALENZUELA CRISTIAN ALEJANDRO', 
    rut: '10.034.682-K', 
    birthDate: '10/05/1972', 
    status: 'Activo', 
    risk: 'Alto', 
    gender: 'Masculino', 
    phone: '+56 9 8765 4321', 
    email: 'cristian.abud@email.com',
    establishment: 'Hualañé',
    diagnoses: ['HTA', 'DM2', 'Obesidad'],
    compensationStatus: 'No compensado',
    compensationByCondition: {
      hta: 'No compensado',
      dm2: 'No compensado'
    },
    lastControlDate: '2026-05-12',
    nextAppointmentDate: 'Sin cita',
    alerts: ['Riesgo de Abandono', 'Inasistencia reciente'],
    pendingExams: ['HbA1c', 'Examen de pie']
  },
  { 
    id: '2', 
    name: 'María López', 
    rut: '8.765.432-1', 
    birthDate: '15/05/1992', 
    status: 'Activo', 
    risk: 'Alto', 
    gender: 'Femenino',
    phone: '+56 9 1234 5678',
    email: 'maria.lopez@email.com',
    establishment: 'Curepto',
    diagnoses: ['HTA'],
    compensationStatus: 'No compensado',
    compensationByCondition: {
      hta: 'No compensado',
      dm2: 'No aplica'
    },
    lastControlDate: '2026-01-20',
    nextAppointmentDate: '2026-07-15',
    alerts: ['Control Vencido'],
    pendingExams: ['Perfil lipídico']
  },
  { 
    id: '3', 
    name: 'Carlos Sánchez', 
    rut: '11.223.344-5', 
    birthDate: '20/11/1975', 
    status: 'Activo', 
    risk: 'Moderado', 
    gender: 'Masculino',
    phone: '+56 9 5555 6666',
    email: 'carlos.sanchez@email.com',
    establishment: 'Hualañé',
    diagnoses: ['DM2', 'Dislipidemia'],
    compensationStatus: 'Compensado',
    compensationByCondition: {
      hta: 'No aplica',
      dm2: 'Compensado'
    },
    lastControlDate: '2026-04-24',
    nextAppointmentDate: '2026-10-24',
    alerts: ['Examen Pendiente'],
    pendingExams: ['Evaluación de pie']
  },
  { 
    id: '4', 
    name: 'Ana Torres', 
    rut: '14.556.677-8', 
    birthDate: '03/08/1985', 
    status: 'Activo', 
    risk: 'Moderado', 
    gender: 'Femenino',
    phone: '+56 9 9999 8888',
    email: 'ana.torres@email.com',
    establishment: 'Curepto',
    diagnoses: ['HTA', 'Dislipidemia'],
    compensationStatus: 'Compensado',
    compensationByCondition: {
      hta: 'Compensado',
      dm2: 'No aplica'
    },
    lastControlDate: '2026-05-10',
    nextAppointmentDate: 'Sin cita',
    alerts: ['Sin Próxima Cita'],
    pendingExams: []
  },
  { 
    id: '5', 
    name: 'Pedro Vera', 
    rut: '16.789.012-3', 
    birthDate: '12/12/1990', 
    status: 'Activo', 
    risk: 'Bajo', 
    gender: 'Masculino',
    phone: '+56 9 6666 7777',
    email: 'pedro.vera@email.com',
    establishment: 'Hualañé',
    diagnoses: ['HTA', 'Obesidad'],
    compensationStatus: 'No compensado',
    compensationByCondition: {
      hta: 'No compensado',
      dm2: 'No aplica'
    },
    lastControlDate: '2026-05-21',
    nextAppointmentDate: '2026-11-20',
    alerts: ['Inasistencia Reciente'],
    pendingExams: ['RAC']
  },
  { 
    id: '6', 
    name: 'Laura Fernández', 
    rut: '18.556.778-9', 
    birthDate: '03/08/1995', 
    status: 'Inactivo', 
    risk: 'Bajo', 
    gender: 'Femenino',
    phone: '+56 9 1111 2222',
    email: 'laura.f@email.com',
    establishment: 'Curepto',
    diagnoses: ['Dislipidemia'],
    compensationStatus: 'Compensado',
    compensationByCondition: {
      hta: 'No aplica',
      dm2: 'No aplica'
    },
    lastControlDate: '2026-01-10',
    nextAppointmentDate: 'Sin cita',
    alerts: [],
    pendingExams: []
  },
  { 
    id: '10', 
    name: 'REBOLLEDO ESPINOZA HUGO ALBERTO', 
    rut: '12.345.678-9', 
    birthDate: '18/07/1968', 
    status: 'Activo', 
    risk: 'Alto', 
    gender: 'Masculino',
    phone: '+56 9 4444 3333',
    email: 'hugo.rebolledo@email.com',
    establishment: 'Hualañé',
    diagnoses: ['HTA', 'DM2', 'ERC'],
    compensationStatus: 'No compensado',
    compensationByCondition: {
      hta: 'Compensado',
      dm2: 'No compensado'
    },
    lastControlDate: '2026-04-08',
    nextAppointmentDate: '2026-07-15',
    alerts: ['Fondo de ojo vencido'],
    pendingExams: ['VFG', 'RAC']
  },
  { 
    id: '11', 
    name: 'CARMONA IBARRA MARGARITA DEL CARMEN', 
    rut: '9.876.543-2', 
    birthDate: '22/03/1960', 
    status: 'Activo', 
    risk: 'Alto', 
    gender: 'Femenino',
    phone: '+56 9 7777 5555',
    email: 'margarita.carmona@email.com',
    establishment: 'Curepto',
    diagnoses: ['DM2', 'HTA'],
    compensationStatus: 'No compensado',
    compensationByCondition: {
      hta: 'No compensado',
      dm2: 'Compensado'
    },
    lastControlDate: '2026-03-22',
    nextAppointmentDate: 'Sin cita',
    alerts: ['Evaluación de pie pendiente', 'Sin Próxima Cita'],
    pendingExams: ['HbA1c']
  },
  { 
    id: '12', 
    name: 'FARÍAS MERINO ERNESTO JOSÉ', 
    rut: '13.456.789-0', 
    birthDate: '12/04/1970', 
    status: 'Activo', 
    risk: 'Moderado', 
    gender: 'Masculino',
    phone: '+56 9 2222 9999',
    email: 'ernesto.farias@email.com',
    establishment: 'Hualañé',
    diagnoses: ['HTA', 'Dislipidemia', 'Obesidad'],
    compensationStatus: 'Compensado',
    compensationByCondition: {
      hta: 'Compensado',
      dm2: 'No aplica'
    },
    lastControlDate: '2026-04-12',
    nextAppointmentDate: '2026-08-14',
    alerts: [],
    pendingExams: []
  },
  { 
    id: '13', 
    name: 'GONZALEZ ROJAS ORLANDO', 
    rut: '15.678.901-2', 
    birthDate: '15/04/1982', 
    status: 'Activo', 
    risk: 'Bajo', 
    gender: 'Masculino',
    phone: '+56 9 3333 1111',
    email: 'orlando.gonzalez@email.com',
    establishment: 'Curepto',
    diagnoses: ['Dislipidemia'],
    compensationStatus: 'Compensado',
    compensationByCondition: {
      hta: 'No aplica',
      dm2: 'No aplica'
    },
    lastControlDate: '2026-04-15',
    nextAppointmentDate: '2026-10-15',
    alerts: [],
    pendingExams: []
  }
];

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  rut: string;
  role: ProfessionalRole;
  professionalName: string;
  date: string; // ISO string or simple YYYY-MM-DD
  status: string;
  attentionType?: string;
  establishment?: 'Hualañé' | 'Curepto';
  observation?: string;
  instruction?: string;
}

export const APPOINTMENTS_MOCK: Appointment[] = [
  // MAY 5 - 1
  { id: 'm5-1', time: '09:00 AM', patientName: 'ABUD VALENZUELA CRISTIAN ALEJANDRO', rut: '10.034.682-K', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-05', status: 'Realizada', attentionType: 'Control PSCV', establishment: 'Hualañé', observation: 'Paciente compensado, mantener dosis.' },
  
  // MAY 6 - 2
  { id: 'm6-1', time: '09:00 AM', patientName: 'María López', rut: '8.765.432-1', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-06', status: 'Realizada', attentionType: 'Control HTA', establishment: 'Curepto', observation: 'Presión arterial levemente elevada.' },
  { id: 'm6-2', time: '10:00 AM', patientName: 'Carlos Sánchez', rut: '11.223.344-5', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-05-06', status: 'Cancelada', attentionType: 'Nutricionista', establishment: 'Hualañé', observation: 'Solicitado reagendar por videollamada' },
  
  // MAY 8 - 1
  { id: 'm8-1', time: '09:00 AM', patientName: 'Ana Torres', rut: '14.556.677-8', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-05-08', status: 'Realizada', attentionType: 'Enfermería', establishment: 'Curepto' },

  // MAY 11 - 4
  { id: '1', time: '09:00 AM', patientName: 'Pedro Vera', rut: '16.789.012-3', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-11', status: 'Realizada', attentionType: 'Control DM2', establishment: 'Hualañé', observation: 'Paciente estable.' },
  { id: '2', time: '10:00 AM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-11', status: 'Inasistencia', attentionType: 'Evaluación de pie', establishment: 'Hualañé', observation: 'Paciente no se presentó en la consulta de las 10:00.' },
  { id: '3', time: '12:00 PM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-05-11', status: 'Reprogramada', attentionType: 'Control HTA', establishment: 'Curepto' },
  { id: '4', time: '03:00 PM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-05-11', status: 'Realizada', attentionType: 'Control PSCV', establishment: 'Hualañé' },
  
  // MAY 13 - 7
  { id: '5', time: '08:00 AM', patientName: 'ABUD VALENZUELA CRISTIAN ALEJANDRO', rut: '10.034.682-K', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-13', status: 'Confirmada', attentionType: 'Control PSCV', establishment: 'Hualañé', observation: 'Paciente requiere confirmar asistencia' },
  { id: '6', time: '09:00 AM', patientName: 'María López', rut: '8.765.432-1', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-05-13', status: 'Confirmada', attentionType: 'Nutricionista', establishment: 'Curepto', instruction: 'Asistir en ayunas para control metabólico.' },
  { id: '7', time: '10:00 AM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-05-13', status: 'Inasistencia', attentionType: 'Evaluación de pie', establishment: 'Hualañé', observation: 'No asistió a cita, requiere rescate' },
  { id: '8', time: '11:00 AM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-05-13', status: 'Programada', attentionType: 'Enfermería', establishment: 'Curepto' },
  { id: '9', time: '12:00 PM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-05-13', status: 'Pendiente', attentionType: 'Revisión de exámenes', establishment: 'Hualañé', observation: 'Exámenes pendientes de entrega por laboratorio' },
  { id: '10', time: '03:00 PM', patientName: 'GONZALEZ ROJAS ORLANDO', rut: '15.678.901-2', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-05-13', status: 'Cancelada', attentionType: 'Rescate / seguimiento', establishment: 'Curepto' },
  { id: '11', time: '04:00 PM', patientName: 'Laura Fernández', rut: '18.556.778-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-13', status: 'Programada', attentionType: 'Control PSCV', establishment: 'Curepto' },
  
  // MAY 14 - 1
  { id: '12', time: '11:00 AM', patientName: 'Carlos Sánchez', rut: '11.223.344-5', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-14', status: 'Programada', attentionType: 'Control HTA', establishment: 'Hualañé' },
  
  // MAY 15 - 3
  { id: '13', time: '09:00 AM', patientName: 'Ana Torres', rut: '14.556.677-8', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-15', status: 'Programada', attentionType: 'Control DM2', establishment: 'Curepto' },
  { id: '14', time: '11:00 AM', patientName: 'Pedro Vera', rut: '16.789.012-3', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-05-15', status: 'Pendiente', attentionType: 'Nutricionista', establishment: 'Hualañé' },
  { id: '15', time: '12:00 PM', patientName: 'Laura Fernández', rut: '18.556.778-9', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-05-15', status: 'Programada', attentionType: 'Nutricionista', establishment: 'Curepto' },

  // MAY 18 - 1
  { id: 'm18-1', time: '09:00 AM', patientName: 'ABUD VALENZUELA CRISTIAN ALEJANDRO', rut: '10.034.682-K', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-18', status: 'Programada', attentionType: 'Control HTA', establishment: 'Hualañé' },

  // MAY 21 - 6
  { id: 'm21-1', time: '09:00 AM', patientName: 'María López', rut: '8.765.432-1', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-21', status: 'Programada', attentionType: 'Control PSCV', establishment: 'Curepto' },
  { id: 'm21-2', time: '10:00 AM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-21', status: 'Confirmada', attentionType: 'Evaluación de pie', establishment: 'Hualañé' },
  { id: 'm21-3', time: '11:00 AM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-21', status: 'Programada', attentionType: 'Control DM2', establishment: 'Curepto' },
  { id: 'm21-4', time: '12:00 PM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-21', status: 'Pendiente', attentionType: 'Revisión de exámenes', establishment: 'Hualañé' },
  { id: 'm21-5', time: '01:00 PM', patientName: 'GONZALEZ ROJAS ORLANDO', rut: '15.678.901-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-21', status: 'Inasistencia', attentionType: 'Control PSCV', establishment: 'Curepto' },
  { id: 'm21-6', time: '02:00 PM', patientName: 'Laura Fernández', rut: '18.556.778-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-21', status: 'Programada', attentionType: 'Control HTA', establishment: 'Curepto' },

  // MAY 26 - 5
  { id: 'm26-1', time: '09:00 AM', patientName: 'Carlos Sánchez', rut: '11.223.344-5', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-26', status: 'Programada', attentionType: 'Control DM2', establishment: 'Hualañé' },
  { id: 'm26-2', time: '10:00 AM', patientName: 'Ana Torres', rut: '14.556.677-8', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-26', status: 'Confirmada', attentionType: 'Control HTA', establishment: 'Curepto' },
  { id: 'm26-3', time: '11:00 AM', patientName: 'Pedro Vera', rut: '16.789.012-3', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-26', status: 'Pendiente', attentionType: 'Enfermería', establishment: 'Hualañé' },
  { id: 'm26-4', time: '12:00 PM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-26', status: 'Programada', attentionType: 'Control PSCV', establishment: 'Hualañé' },
  { id: 'm26-5', time: '01:00 PM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-26', status: 'Inasistencia', attentionType: 'Nutricionista', establishment: 'Curepto' },

  // MAY 28 - 2
  { id: 'm28-1', time: '09:00 AM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-28', status: 'Confirmada', attentionType: 'Control PSCV', establishment: 'Hualañé' },
  { id: 'm28-2', time: '10:00 AM', patientName: 'GONZALEZ ROJAS ORLANDO', rut: '15.678.901-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-05-28', status: 'Programada', attentionType: 'Revisión de exámenes', establishment: 'Curepto' },

  // JUNE 5 - 1
  { id: 'j5-1', time: '09:00 AM', patientName: 'ABUD VALENZUELA CRISTIAN ALEJANDRO', rut: '10.034.682-K', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-05', status: 'Realizada', attentionType: 'Control PSCV', establishment: 'Hualañé', observation: 'Paciente compensado, mantener dosis.' },
  
  // JUNE 6 - 2
  { id: 'j6-1', time: '09:00 AM', patientName: 'María López', rut: '8.765.432-1', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-06', status: 'Realizada', attentionType: 'Control HTA', establishment: 'Curepto', observation: 'Presión arterial levemente elevada.' },
  { id: 'j6-2', time: '10:00 AM', patientName: 'Carlos Sánchez', rut: '11.223.344-5', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-06-06', status: 'Cancelada', attentionType: 'Nutricionista', establishment: 'Hualañé', observation: 'Solicitado reagendar por videollamada' },
  
  // JUNE 8 - 1
  { id: 'j8-1', time: '09:00 AM', patientName: 'Ana Torres', rut: '14.556.677-8', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-06-08', status: 'Realizada', attentionType: 'Enfermería', establishment: 'Curepto' },

  // JUNE 11 - 4
  { id: 'j11-1', time: '09:00 AM', patientName: 'Pedro Vera', rut: '16.789.012-3', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-11', status: 'Realizada', attentionType: 'Control DM2', establishment: 'Hualañé', observation: 'Paciente stable.' },
  { id: 'j11-2', time: '10:00 AM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-11', status: 'Inasistencia', attentionType: 'Evaluación de pie', establishment: 'Hualañé', observation: 'Paciente no se presentó en la consulta de las 10:00.' },
  { id: 'j11-3', time: '12:00 PM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-06-11', status: 'Reprogramada', attentionType: 'Control HTA', establishment: 'Curepto' },
  { id: 'j11-4', time: '03:00 PM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-06-11', status: 'Realizada', attentionType: 'Control PSCV', establishment: 'Hualañé' },
  
  // JUNE 13 - 7
  { id: 'j13-1', time: '08:00 AM', patientName: 'ABUD VALENZUELA CRISTIAN ALEJANDRO', rut: '10.034.682-K', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-13', status: 'Confirmada', attentionType: 'Control PSCV', establishment: 'Hualañé', observation: 'Paciente requiere confirmar asistencia' },
  { id: 'j13-2', time: '09:00 AM', patientName: 'María López', rut: '8.765.432-1', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-06-13', status: 'Confirmada', attentionType: 'Nutricionista', establishment: 'Curepto', instruction: 'Asistir en ayunas para control metabólico.' },
  { id: 'j13-3', time: '10:00 AM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-06-13', status: 'Inasistencia', attentionType: 'Evaluación de pie', establishment: 'Hualañé', observation: 'No asistió a cita, requiere rescate' },
  { id: 'j13-4', time: '11:00 AM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-06-13', status: 'Programada', attentionType: 'Enfermería', establishment: 'Curepto' },
  { id: 'j13-5', time: '12:00 PM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-06-13', status: 'Pendiente', attentionType: 'Revisión de exámenes', establishment: 'Hualañé', observation: 'Exámenes pendientes de entrega por laboratorio' },
  { id: 'j13-6', time: '03:00 PM', patientName: 'GONZALEZ ROJAS ORLANDO', rut: '15.678.901-2', role: 'ENFERMERA', professionalName: 'Enf. Camila Silva', date: '2026-06-13', status: 'Cancelada', attentionType: 'Rescate / seguimiento', establishment: 'Curepto' },
  { id: 'j13-7', time: '04:00 PM', patientName: 'Laura Fernández', rut: '18.556.778-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-13', status: 'Programada', attentionType: 'Control PSCV', establishment: 'Curepto' },
  
  // JUNE 14 - 1
  { id: 'j14-1', time: '11:00 AM', patientName: 'Carlos Sánchez', rut: '11.223.344-5', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-14', status: 'Programada', attentionType: 'Control HTA', establishment: 'Hualañé' },
  
  // JUNE 15 - 3
  { id: 'j15-1', time: '09:00 AM', patientName: 'Ana Torres', rut: '14.556.677-8', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-15', status: 'Programada', attentionType: 'Control DM2', establishment: 'Curepto' },
  { id: 'j15-2', time: '11:00 AM', patientName: 'Pedro Vera', rut: '16.789.012-3', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-06-15', status: 'Pendiente', attentionType: 'Nutricionista', establishment: 'Hualañé' },
  { id: 'j15-3', time: '12:00 PM', patientName: 'Laura Fernández', rut: '18.556.778-9', role: 'NUTRICIONISTA', professionalName: 'Nut. María José', date: '2026-06-15', status: 'Programada', attentionType: 'Nutricionista', establishment: 'Curepto' },

  // JUNE 18 - 1
  { id: 'j18-1', time: '09:00 AM', patientName: 'ABUD VALENZUELA CRISTIAN ALEJANDRO', rut: '10.034.682-K', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-18', status: 'Programada', attentionType: 'Control HTA', establishment: 'Hualañé' },

  // JUNE 21 - 6
  { id: 'j21-1', time: '09:00 AM', patientName: 'María López', rut: '8.765.432-1', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-21', status: 'Programada', attentionType: 'Control PSCV', establishment: 'Curepto' },
  { id: 'j21-2', time: '10:00 AM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-21', status: 'Confirmada', attentionType: 'Evaluación de pie', establishment: 'Hualañé' },
  { id: 'j21-3', time: '11:00 AM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-21', status: 'Programada', attentionType: 'Control DM2', establishment: 'Curepto' },
  { id: 'j21-4', time: '12:00 PM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-21', status: 'Pendiente', attentionType: 'Revisión de exámenes', establishment: 'Hualañé' },
  { id: 'j21-5', time: '01:00 PM', patientName: 'GONZALEZ ROJAS ORLANDO', rut: '15.678.901-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-21', status: 'Inasistencia', attentionType: 'Control PSCV', establishment: 'Curepto' },
  { id: 'j21-6', time: '02:00 PM', patientName: 'Laura Fernández', rut: '18.556.778-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-21', status: 'Programada', attentionType: 'Control HTA', establishment: 'Curepto' },

  // JUNE 26 - 5
  { id: 'j26-1', time: '09:00 AM', patientName: 'Carlos Sánchez', rut: '11.223.344-5', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-26', status: 'Programada', attentionType: 'Control DM2', establishment: 'Hualañé' },
  { id: 'j26-2', time: '10:00 AM', patientName: 'Ana Torres', rut: '14.556.677-8', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-26', status: 'Confirmada', attentionType: 'Control HTA', establishment: 'Curepto' },
  { id: 'j26-3', time: '11:00 AM', patientName: 'Pedro Vera', rut: '16.789.012-3', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-26', status: 'Pendiente', attentionType: 'Enfermería', establishment: 'Hualañé' },
  { id: 'j26-4', time: '12:00 PM', patientName: 'REBOLLEDO ESPINOZA HUGO ALBERTO', rut: '12.345.678-9', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-26', status: 'Programada', attentionType: 'Control PSCV', establishment: 'Hualañé' },
  { id: 'j26-5', time: '01:00 PM', patientName: 'CARMONA IBARRA MARGARITA DEL CARMEN', rut: '9.876.543-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-26', status: 'Inasistencia', attentionType: 'Nutricionista', establishment: 'Curepto' },

  // JUNE 28 - 2
  { id: 'j28-1', time: '09:00 AM', patientName: 'FARÍAS MERINO ERNESTO JOSÉ', rut: '13.456.789-0', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-28', status: 'Confirmada', attentionType: 'Control PSCV', establishment: 'Hualañé' },
  { id: 'j28-2', time: '10:00 AM', patientName: 'GONZALEZ ROJAS ORLANDO', rut: '15.678.901-2', role: 'MEDICO', professionalName: 'Dr. Carlos Mendoza', date: '2026-06-28', status: 'Programada', attentionType: 'Revisión de exámenes', establishment: 'Curepto' },
];

export function parseDisplayTimeToInput(timeStr: string | undefined): string {
  if (!timeStr) return "09:00";
  const parts = timeStr.trim().split(/\s+/);
  if (parts.length === 0) return "09:00";
  
  let timeVal = parts[0]; // e.g. "09:30" or "15:00"
  let meridian = parts[1]; // e.g. "AM" or "PM"
  
  let [hoursStr, minutesStr] = timeVal.split(':');
  let hours = parseInt(hoursStr, 10);
  
  if (isNaN(hours)) return "09:00";
  
  if (meridian === 'PM' && hours < 12) {
    hours += 12;
  } else if (meridian === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${(minutesStr || '00').substring(0, 2)}`;
}

export function formatInputTimeToDisplay(timeStr: string | undefined): string {
  if (!timeStr) return "09:00 AM";
  const [hoursStr, minutesStr] = timeStr.split(':');
  let hours = parseInt(hoursStr, 10);
  if (isNaN(hours)) return "09:00 AM";
  
  const meridian = hours >= 12 ? 'PM' : 'AM';
  return `${hours.toString().padStart(2, '0')}:${minutesStr || '00'} ${meridian}`;
}

