# Medical Record Suite

A comprehensive medical records management system built with React, TypeScript, Supabase, and Tailwind CSS. This system provides secure patient record management, appointment scheduling, prescription tracking, medical report storage, billing, and comprehensive audit logging.

## Features Implemented

### 1. Database Schema & Security

**Complete PostgreSQL schema with:**
- Users & Profiles with role-based access (patient, doctor, nurse, receptionist, admin)
- Patients with encrypted sensitive fields (SSN, medical history, insurance)
- Doctors with credentials and specializations
- Appointments with conflict detection
- Medical Records with encrypted diagnosis and treatment data
- Prescriptions with encrypted medication details
- Medical Reports with file storage integration
- Billing & Insurance management
- Comprehensive Audit Logs

**Security Features:**
- Row Level Security (RLS) policies on all tables
- Field-level encryption using pgcrypto (AES-256)
- Encrypted fields: SSN, medical history, diagnoses, prescriptions, insurance details
- Role-based access control enforced at database level
- Automatic audit logging for all medical record changes
- IP address and user tracking in audit logs

### 2. Authentication & Authorization

- Supabase Auth integration with email/password
- JWT-based authentication
- Role-based route protection
- Automatic role-based dashboard routing
- Session management with refresh tokens
- Protected routes with RequireAuth component

**User Roles:**
- **Patient**: View own records, appointments, prescriptions
- **Doctor**: View/update assigned patients, create prescriptions, medical records
- **Nurse**: View patients and assist with care
- **Receptionist**: Schedule appointments, manage billing
- **Admin**: Full system access, analytics, audit logs

### 3. Patient Management

**Services Implemented:**
- Patient registration with automatic patient number generation (PAT000001, etc.)
- Encrypted health record storage (medical history, allergies, chronic conditions)
- Patient profile management with demographic data
- Blood group and allergy tracking
- Emergency contact information (encrypted)
- Insurance provider and policy details (encrypted)
- Primary doctor assignment

### 4. Appointment Scheduling

**Features:**
- Create, read, update appointments
- Conflict detection - prevents double-booking doctors
- Multiple appointment statuses: scheduled, confirmed, in_progress, completed, cancelled, no_show
- Appointment types and reasons
- Location tracking (in-person/online)
- Date and time range validation
- Doctor availability tracking
- Patient appointment history

### 5. Medical Records

**Capabilities:**
- Encrypted medical records with:
  - Chief complaint
  - Diagnosis
  - Treatment plan
  - Vital signs
  - Clinical notes
- Visit date tracking
- Follow-up scheduling
- Doctor-patient record linkage
- Automatic audit logging on all changes
- RLS ensures patients only see their own records

### 6. Prescription Management

**Features:**
- Create and track prescriptions
- Encrypted fields: medication name, dosage, frequency, instructions
- Refill tracking
- Pharmacy integration
- Valid-until dates
- Prescription status (active/expired)
- Link to medical records
- Patient prescription history

### 7. Medical Reports & File Upload

**Secure File Management:**
- Upload medical reports, lab results, scans
- Supabase Storage integration
- File metadata stored in database
- Report types: lab, imaging, pathology, etc.
- Encrypted findings and interpretations
- Doctor review tracking
- Signed URL generation for secure downloads
- File cleanup on deletion
- MIME type validation

**Storage Structure:**
```
medical-reports/
  {patient_id}/
    {timestamp}-{random}.{ext}
```

### 8. Billing & Insurance

**Billing System:**
- Invoice generation with automatic numbering (INV-YYYYMM-00001)
- Service itemization (stored as JSON)
- Tax calculation
- Payment status tracking: pending, paid, overdue, cancelled, insurance_pending
- Payment method recording
- Due date management
- Encrypted insurance claim numbers
- Link to appointments
- Patient billing history

### 9. Admin Analytics Dashboard

**Real-time KPIs:**
- Total patients count
- Total appointments
- Upcoming appointments
- Completed appointments
- Total revenue (from paid invoices)
- Pending bills amount

**Charts & Visualizations:**
- Revenue by month (last 6 months) - Area chart
- Appointments by week - Bar chart
- Patient distribution by condition
- Appointment trends

**Audit Logging:**
- View recent system activities
- Track who accessed/modified what
- IP address logging
- Timestamp tracking
- Action types: INSERT, UPDATE, DELETE

### 10. Patient Dashboard

**Personalized View:**
- Welcome message with patient name
- Quick stats: upcoming appointments, active prescriptions, medical records count
- Last visit date
- Upcoming appointments preview (next 3)
- Active prescriptions preview (latest 3)
- Health summary: blood type, allergies, chronic conditions
- Navigation to detailed views

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Recharts** for data visualization

### Backend Stack
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **Supabase Storage** for file storage
- **Row Level Security** for authorization
- **pgcrypto** extension for encryption

### Security Practices

1. **Encryption at Rest:**
   - Sensitive fields encrypted using AES-256 via pgcrypto
   - Encryption/decryption handled server-side
   - Encryption key stored securely (should use Vault in production)

2. **Access Control:**
   - RLS policies enforce data isolation
   - Patients can only access their own data
   - Doctors can only access assigned patients
   - Admins have full access with audit trail

3. **Audit Logging:**
   - All changes to medical records, prescriptions, patients, appointments logged
   - Includes old/new values, timestamp, user, IP address
   - Triggers automatically fire on INSERT/UPDATE/DELETE

4. **Authentication:**
   - JWT tokens with expiration
   - Refresh token rotation
   - Role-based route protection
   - Session management

## Database Schema Overview

```
profiles (extends auth.users)
  ├─ patients (has encrypted SSN, medical history, insurance)
  ├─ doctors (license, specializations)
  └─ role-based access

appointments
  ├─ patient_id → patients
  ├─ doctor_id → doctors
  ├─ conflict detection via overlap checking
  └─ status workflow

medical_records (encrypted complaints, diagnosis, treatment)
  ├─ patient_id → patients
  ├─ doctor_id → doctors
  └─ audit triggers

prescriptions (encrypted medication details)
  ├─ patient_id → patients
  ├─ doctor_id → doctors
  └─ medical_record_id → medical_records

medical_reports
  ├─ patient_id → patients
  ├─ file_path → Supabase Storage
  └─ encrypted findings

billing
  ├─ patient_id → patients
  ├─ appointment_id → appointments
  └─ encrypted insurance claims

audit_logs (immutable)
  └─ tracks all sensitive data changes
```

## File Structure

```
project/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx         # Auth state management
│   ├── services/
│   │   ├── patientService.ts       # Patient CRUD
│   │   ├── appointmentService.ts   # Appointment scheduling
│   │   ├── medicalRecordService.ts # Medical records
│   │   ├── prescriptionService.ts  # Prescriptions
│   │   ├── reportService.ts        # File uploads
│   │   ├── billingService.ts       # Billing & invoicing
│   │   └── analyticsService.ts     # Dashboard KPIs
│   ├── pages/
│   │   ├── Login.tsx               # Authentication
│   │   ├── PatientDashboard.tsx    # Patient view
│   │   ├── DoctorDashboard.tsx     # Doctor view
│   │   └── AdminDashboard.tsx      # Admin analytics
│   ├── lib/
│   │   ├── encryption.ts           # Encryption helpers
│   │   └── utils.ts                # Utilities
│   ├── types/
│   │   └── database.ts             # TypeScript types
│   └── integrations/
│       └── supabase/
│           ├── client.ts           # Supabase client
│           └── types.ts            # Generated types
└── supabase/
    └── migrations/
        └── create_medical_record_schema.sql
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Git

### 1. Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The database migration has already been applied. It includes:
- All table schemas
- Enum types for roles and statuses
- Row Level Security policies
- Encryption functions
- Audit triggers
- Indexes for performance

### 4. Create Storage Bucket

In Supabase Dashboard:
1. Go to Storage
2. Create bucket named `medical-reports`
3. Set policies to allow authenticated users

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

## Usage Guide

### Creating a User

1. Users are created via Supabase Auth
2. After signup, a profile record is automatically created
3. For patients, create a patient record linking to the profile
4. For doctors, create a doctor record with license info

### Example: Create a Patient Profile

```typescript
// After user signs up, create patient record
const patient = await createPatient({
  profile_id: user.id,
  patient_number: await generatePatientNumber(),
  blood_group: 'O+',
  allergies: ['Penicillin'],
  chronic_conditions: ['Hypertension'],
  insurance_provider: 'Blue Cross',
});
```

### Example: Schedule Appointment

```typescript
const appointment = await createAppointment({
  patient_id: patientId,
  doctor_id: doctorId,
  appointment_date: '2025-11-15',
  start_time: '10:00',
  end_time: '10:30',
  appointment_type: 'General Checkup',
  reason: 'Annual physical',
  location: 'Clinic Room 3',
});
```

### Example: Upload Medical Report

```typescript
const report = await uploadMedicalReport(
  file,
  patientId,
  {
    report_type: 'lab',
    report_date: '2025-10-30',
    title: 'Complete Blood Count',
    findings_encrypted: await encryptField('Normal ranges'),
  }
);
```

## Security Considerations

### Production Checklist

- [ ] Use Supabase Vault for encryption keys (not environment variables)
- [ ] Implement key rotation policy
- [ ] Enable 2FA for admin accounts
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Compliance review (HIPAA/GDPR)
- [ ] Backup and disaster recovery plan
- [ ] Pen testing before launch

### Encryption Notes

**Current Implementation:**
- Uses pgcrypto with a placeholder key
- Key stored in migration (NOT PRODUCTION SAFE)

**Production Requirements:**
- Store encryption key in Supabase Vault
- Use separate keys for different data types
- Implement key rotation
- Consider using a dedicated KMS (AWS KMS, Azure Key Vault)

### HIPAA Compliance Notes

This system includes features for HIPAA compliance but requires additional setup:
1. Business Associate Agreement (BAA) with Supabase
2. Encrypted backups with key management
3. Access logging and monitoring (implemented)
4. Data retention and disposal policies
5. Employee training
6. Incident response plan
7. Regular risk assessments

## API Services Summary

### Patient Service
- `createPatient(data)` - Register new patient
- `getPatientByProfileId(id)` - Get patient by profile
- `updatePatient(id, updates)` - Update patient info
- `getAllPatients()` - List all active patients
- `generatePatientNumber()` - Generate unique patient ID

### Appointment Service
- `createAppointment(data)` - Schedule appointment
- `checkAppointmentConflict()` - Validate time slot
- `getAppointmentsByPatient(id)` - Patient's appointments
- `getAppointmentsByDoctor(id)` - Doctor's schedule
- `updateAppointmentStatus(id, status)` - Change status
- `deleteAppointment(id)` - Cancel appointment

### Medical Record Service
- `createMedicalRecord(data)` - Add medical record
- `getMedicalRecordsByPatient(id)` - Patient history
- `getMedicalRecordById(id)` - Single record
- `updateMedicalRecord(id, updates)` - Update record

### Prescription Service
- `createPrescription(data)` - Write prescription
- `getPrescriptionsByPatient(id)` - Patient's prescriptions
- `getActivePrescriptionsByPatient(id)` - Active only
- `updatePrescription(id, updates)` - Update prescription

### Report Service
- `uploadMedicalReport(file, patientId, data)` - Upload file
- `getReportsByPatient(id)` - Patient's reports
- `getReportDownloadUrl(path)` - Signed URL
- `updateReport(id, updates)` - Update metadata
- `deleteReport(id)` - Remove report and file

### Billing Service
- `createBilling(data)` - Generate invoice
- `getBillingByPatient(id)` - Patient's bills
- `getPendingBilling()` - Outstanding invoices
- `updateBillingStatus(id, status, method)` - Record payment
- `generateInvoiceNumber()` - Unique invoice ID

### Analytics Service
- `getDashboardStats()` - KPI summary
- `getAppointmentsByWeek()` - Weekly appointment data
- `getPatientsByCondition()` - Condition distribution
- `getRevenueByMonth(months)` - Revenue trends
- `getAuditLogs(limit)` - Recent system activity

## Future Enhancements

### Recommended Features
1. **AI Integration** (per original request):
   - Health risk prediction model
   - Symptom checker chatbot
   - OCR for medical document scanning
   - NLP for medical report summarization
   - Voice dictation for doctor notes
   - Prescription recommendations (with clinician approval)
   - Natural language search

2. **Communication**:
   - Email notifications for appointments (via Supabase Edge Functions)
   - SMS reminders
   - Patient portal messaging
   - Telemedicine integration

3. **Advanced Analytics**:
   - Predictive analytics dashboard
   - Disease trend projections
   - Resource utilization forecasting

4. **Interoperability**:
   - HL7 FHIR integration
   - Lab system integration
   - Pharmacy system integration
   - Insurance claim automation

5. **Enhanced UX**:
   - Mobile app (React Native)
   - Offline mode with sync
   - Advanced search and filters
   - Customizable reports

## Troubleshooting

### Authentication Issues
- Check Supabase URL and anon key in .env
- Verify email confirmation settings in Supabase Auth
- Check RLS policies if data not appearing

### File Upload Fails
- Verify `medical-reports` bucket exists
- Check storage policies allow authenticated uploads
- Ensure file size under limits

### Encryption Errors
- Ensure pgcrypto extension enabled
- Verify encryption functions created in migration
- Check encryption key configured

### Build Errors
- Run `npm install` to ensure dependencies
- Check TypeScript errors with `npm run lint`
- Clear node_modules and reinstall if needed

## Contributing

When adding new features:
1. Add RLS policies for new tables
2. Include audit logging for sensitive data
3. Encrypt PII/PHI fields
4. Add TypeScript types
5. Update this README
6. Test with different user roles

## License

This is a demonstration project. Review licensing requirements for production use, especially regarding HIPAA compliance and medical software regulations.

## Support

For issues or questions about this implementation, review:
- Supabase documentation: https://supabase.com/docs
- shadcn/ui components: https://ui.shadcn.com
- React documentation: https://react.dev

---

**IMPORTANT SECURITY NOTICE:**
This system handles Protected Health Information (PHI). Before deploying to production:
1. Complete security audit
2. Implement proper key management
3. Obtain necessary compliance certifications
4. Set up comprehensive monitoring
5. Establish incident response procedures
6. Review all applicable healthcare regulations