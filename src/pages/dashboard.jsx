import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function StatCard({ title, value, icon }) {
    const cardStyle = {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    };

    return (
        <div style={cardStyle}>
            <div style={{ fontSize: '32px' }}>{icon}</div>
            <div>
                <h4 style={{ margin: 0, color: '#718096', fontSize: '14px', textTransform: 'uppercase', tracking: 'wide' }}>{title}</h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#1a202c' }}>{value}</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();

    // Core Admissions List backed by localStorage persistence
    const [admissions, setAdmissions] = useState(() => {
        const savedAdmissions = localStorage.getItem('hms_admitted_patients');
        return savedAdmissions ? JSON.parse(savedAdmissions) : [
            {
                admission_id: 1,
                admission_number: 'ADM-2026-001',
                patient_number: 'PT-9821',
                first_name: 'John',
                last_name: 'Doe',
                age: 34,
                diagnosis: 'Severe Fever',
                room_number: '102'
            },
            {
                admission_id: 2,
                admission_number: 'ADM-2026-002',
                patient_number: 'PT-4412',
                first_name: 'Jane',
                last_name: 'Smith',
                age: 28,
                diagnosis: 'Migraine Aura',
                room_number: '205'
            }
        ];
    });

    const [notifications, setNotifications] = useState(2);
    const [showModal, setShowModal] = useState(false);

    // Controlled Form Inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [roomNumber, setRoomNumber] = useState('');

    // Sync admissions roster changes automatically with browser storage
    useEffect(() => {
        localStorage.setItem('hms_admitted_patients', JSON.stringify(admissions));
    }, [admissions]);

    const handleAddAdmission = (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !age || !diagnosis || !roomNumber) {
            alert('Please fill out all registration fields.');
            return;
        }

        const newAdmission = {
            admission_id: Date.now(),
            admission_number: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
            patient_number: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
            first_name: firstName,
            last_name: lastName,
            age: parseInt(age),
            diagnosis: diagnosis,
            room_number: roomNumber
        };

        setAdmissions([...admissions, newAdmission]);

        setFirstName('');
        setLastName('');
        setAge('');
        setDiagnosis('');
        setRoomNumber('');
    };

    // Tracks and records local date-time strings accurately upon action trigger
    const handleDischargePatient = (id, fullName) => {
        const now = new Date();
        const dischargeDate = now.toLocaleDateString('en-IN');
        const dischargeTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        alert(`Success: ${fullName} has been discharged officially!\nDate: ${dischargeDate}\nTime: ${dischargeTime}`);

        setAdmissions(admissions.filter(p => p.admission_id !== id));
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />

            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box', overflowX: 'hidden' }}>

                {/* Header Block Panel */}
                <header style={headerStyle}>
                    <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>Hospital Management Dashboard</h1>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/registry')} style={{ ...buttonStyle, backgroundColor: '#6b46c1' }}>
                            🔎 Search Master Registry
                        </button>
                        <button onClick={() => navigate('/roles')} style={{ ...buttonStyle, backgroundColor: '#4a5568' }}>
                            Roles Matrix
                        </button>
                        <button onClick={() => navigate('/doctors')} style={{ ...buttonStyle, backgroundColor: '#2b6cb0' }}>
                            View Doctors Directory
                        </button>
                        <button onClick={() => navigate('/appointments')} style={{ ...buttonStyle, backgroundColor: '#4c51bf' }}>
                            OP Desk
                        </button>
                        <button onClick={() => navigate('/admissions')} style={{ ...buttonStyle, backgroundColor: '#38a169' }}>
                            Admission Block
                        </button>
                        <button onClick={() => navigate('/billing')} style={{ ...buttonStyle, backgroundColor: '#dd6b20' }}>
                            Pharmacy & Billing Ledger
                        </button>
                        <button
                            style={buttonStyle}
                            onClick={() => {
                                setShowModal(true);
                                setNotifications(0);
                            }}
                        >
                            Notifications ({notifications})
                        </button>
                    </div>
                </header>

                <main style={gridStyle}>
                    <StatCard title="Active Admissions" value={admissions.length} icon="👤" />
                    <StatCard title="Available Doctors" value="42" icon="🩺" />
                    <StatCard title="Rooms Occupied" value="85%" icon="🏥" />
                </main>

                <div style={contentSplitStyle}>
                    {/* Intake Form */}
                    <div style={cardStyle}>
                        <h2 style={{ marginTop: 0, color: '#2d3748', fontSize: '20px' }}>Register New Admission</h2>
                        <form onSubmit={handleAddAdmission} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} />
                            <input type="text" placeholder="Diagnosis / Symptoms" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} style={inputStyle} />
                            <input type="text" placeholder="Assigned Room Number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} style={inputStyle} />
                            <button type="submit" style={{ ...buttonStyle, marginTop: '8px', width: '100%' }}>Admit Patient</button>
                        </form>
                    </div>

                    {/* Data Roster Grid */}
                    <div style={{ ...cardStyle, overflowX: 'auto' }}>
                        <h2 style={{ marginTop: 0, color: '#2d3748', fontSize: '20px' }}>Current Admitted Patients</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#4a5568' }}>
                                    <th style={{ padding: '12px 10px' }}>Admission No</th>
                                    <th style={{ padding: '12px 10px' }}>Patient Name</th>
                                    <th style={{ padding: '12px 10px' }}>Diagnosis</th>
                                    <th style={{ padding: '12px 10px' }}>Room</th>
                                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admissions.map(p => (
                                    <tr key={p.admission_id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                        <td style={{ padding: '12px 10px', color: '#718096', fontSize: '13px', fontWeight: 'bold' }}>{p.admission_number}</td>
                                        <td style={{ padding: '12px 10px', fontWeight: '500' }}>{p.first_name} {p.last_name} <span style={{ fontSize: '12px', color: '#a0aec0', fontWeight: 'normal' }}>({p.patient_number})</span></td>
                                        <td style={{ padding: '12px 10px', color: '#e53e3e' }}>{p.diagnosis}</td>
                                        <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{p.room_number}</td>
                                        <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDischargePatient(p.admission_id, `${p.first_name} ${p.last_name}`)}
                                                style={{ backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                                            >
                                                Discharge
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '30px', borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '450px', width: '90%', fontFamily: 'sans-serif'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#1a202c', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
                            🔔 System Alerts & Updates
                        </h3>
                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '15px' }} />
                        <ul style={{ paddingLeft: '20px', color: '#4a5568', lineHeight: '1.6', fontSize: '15px', marginBottom: '25px' }}>
                            <li style={{ marginBottom: '10px' }}><strong>Emergency Check:</strong> ER Room 102 requires an on-call intake confirmation check.</li>
                            <li><strong>Roster Change:</strong> Dr. Alok Mishra updated status shifts to <em>"In Surgery"</em>.</li>
                        </ul>
                        <button onClick={() => setShowModal(false)} style={{ width: '100%', backgroundColor: '#2b6cb0', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                            Dismiss Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '2px solid #e2e8f0', marginBottom: '25px', gap: '15px' };
const buttonStyle = { backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' };
const contentSplitStyle = { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' };
const cardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' };