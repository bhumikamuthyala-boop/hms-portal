import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MasterLedger() {
    const navigate = useNavigate();

    // ==========================================
    // 1. DOCTORS REGISTER (With Joining & Resignation Dates)
    // ==========================================
    const [doctorsList, setDoctorsList] = useState([
        { id: 'DOC-101', name: 'Dr. Alok Mishra', specialty: 'Cardiology', joinDate: '2024-03-15 10:00 AM', leaveDate: null, status: 'ACTIVE' },
        { id: 'DOC-102', name: 'Dr. Priya Sharma', specialty: 'Pediatrics', joinDate: '2025-01-10 09:30 AM', leaveDate: null, status: 'ACTIVE' },
        { id: 'DOC-103', name: 'Dr. R. K. Narayan', specialty: 'General Medicine', joinDate: '2023-06-01 11:15 AM', leaveDate: '2026-05-30 04:00 PM', status: 'RESIGNED' }
    ]);

    // ==========================================
    // 2. RECEPTIONISTS REGISTER (With Joining & Resignation Dates)
    // ==========================================
    const [receptionistsList, setReceptionistsList] = useState([
        { id: 'REC-501', name: 'Manya Reddy', shift: 'Morning', joinDate: '2025-02-01 08:00 AM', leaveDate: null, status: 'ACTIVE' },
        { id: 'REC-502', name: 'K. Suresh', shift: 'Night', joinDate: '2024-11-15 08:00 PM', leaveDate: '2026-02-28 08:00 AM', status: 'RESIGNED' }
    ]);

    // ==========================================
    // 3. LIVE PATIENTS IN THE HOSPITAL (With Admission Date/Time)
    // ==========================================
    const [livePatients, setLivePatients] = useState([
        { admissionNo: 'ADM-2026-001', name: 'John Doe', age: 34, diagnosis: 'Severe Fever', room: 'G-101', joinDateTime: '2026-07-01 09:30 AM' },
        { admissionNo: 'ADM-2026-002', name: 'Jane Smith', age: 29, diagnosis: 'Migraine Aura', room: 'ICU-201', joinDateTime: '2026-07-05 11:15 AM' }
    ]);

    // ==========================================
    // 4. HISTORICAL ARCHIVE LOGS (Every Discharge/Resign History)
    // ==========================================
    const [historicalLogs, setHistoricalLogs] = useState([
        { logId: 'LOG-101', targetName: 'Rahul Kumar', role: 'Patient', eventType: 'Discharge', startDateTime: '2026-07-01 10:30 AM', endDateTime: '2026-07-07 10:47 AM', details: 'Discharged fully recovered from Room 104' }
    ]);

    // Form inputs for adding a brand new doctor
    const [newDocName, setNewDocName] = useState('');
    const [newDocSpecialty, setNewDocSpecialty] = useState('Cardiology');

    // ==========================================
    // INTERACTIVE STATES FOR FILTERING & SEARCHING
    // ==========================================
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [eventFilter, setEventFilter] = useState('ALL');

    // ==========================================
    // TRANSACTION ACTION HANDLERS
    // ==========================================

    // Action: Process Patient Discharge & Move to History with precise timestamp
    const handlePatientDischarge = (admissionNo) => {
        const patient = livePatients.find(p => p.admissionNo === admissionNo);
        if (!patient) return;

        // Generate current date & time string
        const now = new Date();
        const currentDateTimeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

        // 1. Add entry to historical archive
        const newArchiveLog = {
            logId: `LOG-${Math.floor(100 + Math.random() * 900)}`,
            targetName: patient.name,
            role: 'Patient',
            eventType: 'Discharge',
            startDateTime: patient.joinDateTime, // When they admitted
            endDateTime: currentDateTimeStr,     // When they discharged
            details: `Discharged from Room ${patient.room} | Initial Diagnosis: ${patient.diagnosis}`
        };

        setHistoricalLogs([newArchiveLog, ...historicalLogs]);

        // 2. Clear out from active inpatients list
        setLivePatients(livePatients.filter(p => p.admissionNo !== admissionNo));
    };

    // Action: Process Doctor Resignation & Update Timestamps
    const handleDoctorResign = (docId) => {
        const now = new Date();
        const currentDateTimeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

        setDoctorsList(doctorsList.map(doc => {
            if (doc.id === docId) {
                // Archive into history log before altering state view
                const docLog = {
                    logId: `LOG-${Math.floor(100 + Math.random() * 900)}`,
                    targetName: doc.name,
                    role: 'Doctor',
                    eventType: 'Resigned',
                    startDateTime: doc.joinDate,
                    endDateTime: currentDateTimeStr,
                    details: `Physician left the ${doc.specialty} department.`
                };
                setHistoricalLogs(prev => [docLog, ...prev]);

                return { ...doc, status: 'RESIGNED', leaveDate: currentDateTimeStr };
            }
            return doc;
        }));
    };

    // Action: Add new doctor onboard record
    const handleAddDoctor = (e) => {
        e.preventDefault();
        if (!newDocName) return;

        const now = new Date();
        const currentDateTimeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

        const newDoc = {
            id: `DOC-${Math.floor(104 + Math.random() * 50)}`,
            name: newDocName,
            specialty: newDocSpecialty,
            joinDate: currentDateTimeStr,
            leaveDate: null,
            status: 'ACTIVE'
        };

        setDoctorsList([...doctorsList, newDoc]);
        setNewDocName('');
    };

    // ==========================================
    // DYNAMIC STATS COMPUTATION LOGIC
    // ==========================================
    const activeDoctorsCount = doctorsList.filter(doc => doc.status === 'ACTIVE').length;
    const activePatientsCount = livePatients.length;
    const totalLogsCount = historicalLogs.length;

    // ==========================================
    // FILTER LOGIC FOR THE ARCHIVE LEDGER
    // ==========================================
    const filteredLogs = historicalLogs.filter(log => {
        const matchesSearch =
            log.targetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.logId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'ALL' || log.role.toUpperCase() === roleFilter.toUpperCase();
        const matchesEvent = eventFilter === 'ALL' || log.eventType.toUpperCase() === eventFilter.toUpperCase();

        return matchesSearch && matchesRole && matchesEvent;
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />

            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box' }}>

                {/* HEADER TITLE */}
                <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' }}>
                    <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>Hospital Census & Operational Ledger</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>Real-time audit tracking for hospital presence, joining dates, discharge events, and staff resignations.</p>
                </header>

                {/* DYNAMIC STATISTICS SUMMARY BAR */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>

                    {/* Card 1: Active Doctors */}
                    <div style={{ ...cardStyle, borderLeft: '6px solid #3182ce', padding: '20px' }}>
                        <div style={{ fontSize: '14px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' }}>Active Medical Staff</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2b6cb0', marginTop: '5px' }}>
                            {activeDoctorsCount} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#a0aec0' }}>Physicians</span>
                        </div>
                    </div>

                    {/* Card 2: Current Patients */}
                    <div style={{ ...cardStyle, borderLeft: '6px solid #38a169', padding: '20px' }}>
                        <div style={{ fontSize: '14px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' }}>Active Inpatient Census</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2f855a', marginTop: '5px' }}>
                            {activePatientsCount} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#a0aec0' }}>Occupied Beds</span>
                        </div>
                    </div>

                    {/* Card 3: Historical Records */}
                    <div style={{ ...cardStyle, borderLeft: '6px solid #805ad5', padding: '20px' }}>
                        <div style={{ fontSize: '14px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' }}>Total Processed Logs</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6b46c1', marginTop: '5px' }}>
                            {totalLogsCount} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#a0aec0' }}>Events Tracked</span>
                        </div>
                    </div>

                </div>

                {/* --- SEPARATE BLOCK 1: MEDICAL SPECIALISTS & FRONT DESK SYSTEM REGISTRY --- */}
                <div style={cardStyle}>
                    <h2 style={{ marginTop: 0, fontSize: '18px', color: '#2b6cb0', marginBottom: '15px' }}>1. Institutional Human Resources Inventory</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>

                        {/* Doctors List Block */}
                        <div style={subContainerStyle}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2d3748' }}>Doctors Roster</h3>

                            {/* Simple Quick Add Form */}
                            <form onSubmit={handleAddDoctor} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                                <input type="text" placeholder="Dr. Name" value={newDocName} onChange={e => setNewDocName(e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '13px', flex: 1 }} />
                                <select value={newDocSpecialty} onChange={e => setNewDocSpecialty(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '13px' }}>
                                    <option value="Cardiology">Cardio</option>
                                    <option value="Pediatrics">Pedia</option>
                                    <option value="General Medicine">General Med</option>
                                </select>
                                <button type="submit" style={{ background: '#3182ce', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Onboard</button>
                            </form>

                            {doctorsList.map(doc => (
                                <div key={doc.id} style={{ ...listItemStyle, borderLeft: doc.status === 'ACTIVE' ? '5px solid #38a169' : '5px solid #a0aec0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <span style={{ fontWeight: 'bold', color: '#2d3748' }}>{doc.name}</span> <span style={{ fontSize: '12px', color: '#718096' }}>({doc.id})</span>
                                            <div style={{ fontSize: '12px', color: '#4a5568', margin: '3px 0' }}>Specialty: <strong>{doc.specialty}</strong></div>
                                            <div style={{ fontSize: '11px', color: '#718096' }}>🟢 Assigned Join: {doc.joinDate}</div>
                                            {doc.leaveDate && <div style={{ fontSize: '11px', color: '#e53e3e' }}>🛑 Resigned Out: {doc.leaveDate}</div>}
                                        </div>
                                        <div>
                                            {doc.status === 'ACTIVE' ? (
                                                <button onClick={() => handleDoctorResign(doc.id)} style={resignButtonStyle}>Resign</button>
                                            ) : (
                                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#718096', padding: '2px 6px', background: '#edf2f7', borderRadius: '4px' }}>EXITED</span>
                                            )
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Receptionists List Block */}
                        <div style={subContainerStyle}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2d3748' }}>Front-Desk Reception Staff</h3>
                            {receptionistsList.map(rec => (
                                <div key={rec.id} style={{ ...listItemStyle, borderLeft: rec.status === 'ACTIVE' ? '5px solid #4299e1' : '5px solid #a0aec0' }}>
                                    <span style={{ fontWeight: 'bold', color: '#2d3748' }}>{rec.name}</span> <span style={{ fontSize: '12px', color: '#718096' }}>({rec.id})</span>
                                    <div style={{ fontSize: '12px', color: '#4a5568', margin: '3px 0' }}>Assigned Shift Hours: <strong>{rec.shift}</strong></div>
                                    <div style={{ fontSize: '11px', color: '#718096' }}>📅 Joining Date: {rec.joinDate}</div>
                                    {rec.leaveDate && <div style={{ fontSize: '11px', color: '#e53e3e' }}>🛑 Terminated/Left: {rec.leaveDate}</div>}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* --- SEPARATE BLOCK 2: LIVE CURRENTLY ADMITTED HOSPITAL POPULATION --- */}
                <div style={{ ...cardStyle, marginTop: '25px' }}>
                    <h2 style={{ marginTop: 0, fontSize: '18px', color: '#2b6cb0', marginBottom: '15px' }}>2. Live Admitted Patient Census</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px' }}>
                        {livePatients.length === 0 ? (
                            <p style={{ color: '#a0aec0', fontSize: '14px' }}>No patients are currently checked into ward allocations.</p>
                        ) : (
                            livePatients.map(pt => (
                                <div key={pt.admissionNo} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #edf2f7', backgroundColor: '#f0fff4', borderLeft: '5px solid #38a169', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '15px' }}>{pt.name} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#718096' }}>({pt.age} yrs)</span></div>
                                        <div style={{ fontSize: '12px', color: '#4a5568', margin: '4px 0' }}>ID Code: <strong>{pt.admissionNo}</strong> | Room: <strong style={{ color: '#2b6cb0' }}>{pt.room}</strong></div>
                                        <div style={{ fontSize: '12px', color: '#e53e3e' }}>Diagnosis: {pt.diagnosis}</div>
                                        <div style={{ fontSize: '11px', color: '#718096', marginTop: '6px' }}>🕒 <strong>Admission Check-in:</strong> {pt.joinDateTime}</div>
                                    </div>
                                    <button onClick={() => handlePatientDischarge(pt.admissionNo)} style={dischargeButtonStyle}>
                                        Discharge & Free
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- SEPARATE BLOCK 3: HISTORICAL AUDIT ARCHIVE LOGS --- */}
                <div style={{ ...cardStyle, marginTop: '25px' }}>
                    <h2 style={{ marginTop: 0, fontSize: '18px', color: '#2c5282', marginBottom: '15px' }}>3. Institutional Lifecycle Historical Log (Discharges & Resignations)</h2>

                    {/* SEARCH AND FILTERS TOOLBAR */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Search logs by name, ID or details..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', flex: 1, minWidth: '200px' }}
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            <option value="ALL">All Roles</option>
                            <option value="PATIENT">Patient Only</option>
                            <option value="DOCTOR">Doctor Only</option>
                        </select>
                        <select
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            <option value="ALL">All Events</option>
                            <option value="DISCHARGE">Discharges</option>
                            <option value="RESIGNED">Resignations</option>
                        </select>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#4a5568', backgroundColor: '#f7fafc' }}>
                                <th style={{ padding: '12px' }}>Log Track</th>
                                <th style={{ padding: '12px' }}>Full Name</th>
                                <th style={{ padding: '12px' }}>Role Type</th>
                                <th style={{ padding: '12px' }}>Event Action</th>
                                <th style={{ padding: '12px' }}>Start/Join Timestamp</th>
                                <th style={{ padding: '12px' }}>Exit/Discharge Timestamp</th>
                                <th style={{ padding: '12px' }}>Description Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#a0aec0' }}>No historical items match your search criteria.</td>
                                </tr>
                            ) : (
                                filteredLogs.map(log => (
                                    <tr key={log.logId} style={{ borderBottom: '1px solid #edf2f7', backgroundColor: 'white' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#4a5568' }}>{log.logId}</td>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>{log.targetName}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', background: log.role === 'Patient' ? '#eef2ff' : '#fef3c7', color: log.role === 'Patient' ? '#4f46e5' : '#d97706' }}>
                                                {log.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: log.eventType === 'Discharge' ? '#2f855a' : '#b7791f' }}>
                                                {log.eventType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', color: '#718096', fontSize: '12px' }}>{log.startDateTime}</td>
                                        <td style={{ padding: '12px', color: '#c53030', fontWeight: 'bold', fontSize: '12px' }}>{log.endDateTime}</td>
                                        <td style={{ padding: '12px', color: '#4a5568', fontSize: '13px' }}>{log.details}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

// Inline Dashboard Presentation Theme Object Rules
const cardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' };
const subContainerStyle = { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #edf2f7' };
const listItemStyle = { backgroundColor: 'white', padding: '12px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0' };
const resignButtonStyle = { backgroundColor: '#edf2f7', color: '#e53e3e', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' };
const dischargeButtonStyle = { backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', shrink: 0 };