import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AppointmentBlock({ patients, onRegisterPatient }) {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState(() => {
        const savedApts = localStorage.getItem('hospital_appointments_queue');
        return savedApts ? JSON.parse(savedApts) : [
            { appointment_id: 1, appointment_number: 'APT-2026-881', patient_id: 'PT-1044', patient_name: 'Rahul Kumar', mobile: '+91 94405 67890', address: 'Trunk Road, Nellore', doctor_name: 'Dr. Alok Mishra', appointment_date: '2026-07-07', appointment_time: '10:30 AM', patient_type: 'RETURNING' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('hospital_appointments_queue', JSON.stringify(appointments));
    }, [appointments]);

    const [patientName, setPatientName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [doctorName, setDoctorName] = useState('Dr. Alok Mishra');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const matchedPatient = patients?.find(p => {
        const fullRegisteredName = `${p.first_name} ${p.last_name}`.trim().toLowerCase();
        return fullRegisteredName === patientName.trim().toLowerCase() || p.first_name.toLowerCase() === patientName.trim().toLowerCase();
    });

    const handleApplyOldProfile = () => {
        if (matchedPatient) {
            setMobile(matchedPatient.mobile);
            setAddress(matchedPatient.address);
        }
    };

    const handleBookAppointment = (e) => {
        e.preventDefault();
        if (!patientName || !mobile || !date || !time) {
            return alert('Please fill in Patient Name, Mobile Number, Date, and Time.');
        }

        let finalPatientId = matchedPatient?.id;

        if (!matchedPatient) {
            finalPatientId = `PT-${Math.floor(5000 + Math.random() * 4000)}`;
            const nameParts = patientName.trim().split(' ');
            onRegisterPatient({
                id: finalPatientId,
                first_name: nameParts[0] || patientName,
                last_name: nameParts.slice(1).join(' ') || ' ',
                mobile: mobile,
                address: address || 'N/A',
                blood_group: 'Unknown',
                gender: 'Unspecified',
                type: 'PATIENT',
                status: 'ACTIVE'
            });
        }

        const newApt = {
            appointment_id: Date.now(),
            appointment_number: `APT-2026-${Math.floor(100 + Math.random() * 900)}`,
            patient_id: finalPatientId,
            patient_name: matchedPatient ? `${matchedPatient.first_name} ${matchedPatient.last_name}` : patientName,
            mobile: mobile,
            address: address || 'N/A',
            doctor_name: doctorName,
            appointment_date: date,
            appointment_time: time,
            patient_type: matchedPatient ? 'RETURNING' : 'NEW'
        };

        setAppointments([newApt, ...appointments]);
        setPatientName('');
        setMobile('');
        setAddress('');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />
            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box' }}>
                <header style={headerStyle}>
                    <div>
                        <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>OP & Appointment Desk</h1>
                        <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>Phase 4: Persistent Global Search Validation and Storage Systems</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} style={backButtonStyle}>Back to Dashboard</button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '30px' }}>
                    <div style={cardStyle}>
                        <h3 style={{ marginTop: 0, color: '#4c51bf', marginBottom: '5px' }}>Schedule OP Slot</h3>

                        <div style={{ marginBottom: '15px' }}>
                            {patientName.trim() === '' ? (
                                <span style={{ fontSize: '11px', color: '#a0aec0', fontWeight: 'bold' }}>Awaiting name entry...</span>
                            ) : matchedPatient ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ebf8ff', padding: '8px', borderRadius: '6px', border: '1px solid #bee3f8' }}>
                                    <span style={{ fontSize: '12px', color: '#2b6cb0', fontWeight: 'bold' }}>📋 EXISTED PATIENT (PAST RECORD)</span>
                                    <button type="button" onClick={handleApplyOldProfile} style={{ backgroundColor: '#2b6cb0', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>Auto-Fill</button>
                                </div>
                            ) : (
                                <div style={{ backgroundColor: '#f0fff4', padding: '8px', borderRadius: '6px', border: '1px solid #c6f6d5' }}>
                                    <span style={{ fontSize: '12px', color: '#38a169', fontWeight: 'bold' }}>✨ NEW PATIENT ENTRY</span>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={labelStyle}>Patient Full Name</label>
                                <input type="text" placeholder="e.g. John Doe" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Mobile Number</label>
                                <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Residential Address</label>
                                <input type="text" placeholder="Residential Address" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Assigned Medical Officer</label>
                                <select value={doctorName} onChange={(e) => setDoctorName(e.target.value)} style={inputStyle}>
                                    <option value="Dr. Alok Mishra">Dr. Alok Mishra (Cardiology)</option>
                                    <option value="Dr. Priya Sharma">Dr. Priya Sharma (Pediatrics)</option>
                                    <option value="Dr. K. Srinivas Rao">Dr. K. Srinivas Rao (Orthopedics)</option>
                                    <option value="Dr. Sneha Reddy">Dr. Sneha Reddy (Neurology)</option>
                                    <option value="Dr. Vikram Malhotra">Dr. Vikram Malhotra (General Medicine)</option>
                                    <option value="Dr. Ananya Goel">Dr. Ananya Goel (Dermatology)</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Date</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Time Slot</label>
                                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
                                </div>
                            </div>
                            <button type="submit" style={blueButtonStyle}>Generate Appointment Token</button>
                        </form>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Today's Token Roster</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#4a5568' }}>
                                    <th style={{ padding: '10px' }}>Token No / ID</th>
                                    <th style={{ padding: '10px' }}>Patient Details</th>
                                    <th style={{ padding: '10px' }}>Consultant & Slot</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Classification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(apt => (
                                    <tr key={apt.appointment_id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{apt.appointment_number}</div>
                                            <div style={{ fontSize: '11px', color: '#a0aec0', fontFamily: 'monospace' }}>{apt.patient_id}</div>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: '600', color: '#2d3748' }}>{apt.patient_name}</div>
                                            <div style={{ fontSize: '12px', color: '#718096' }}>📱 {apt.mobile}</div>
                                            <div style={{ fontSize: '11px', color: '#a0aec0' }}>📍 {apt.address}</div>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ color: '#2b6cb0', fontWeight: '500' }}>{apt.doctor_name}</div>
                                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '3px' }}>📅 {apt.appointment_date} | ⏰ {apt.appointment_time}</div>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px',
                                                backgroundColor: apt.patient_type === 'RETURNING' ? '#e2e8f0' : '#c6f6d5',
                                                color: apt.patient_type === 'RETURNING' ? '#4a5568' : '#22543d'
                                            }}>
                                                {apt.patient_type === 'RETURNING' ? 'EXISTED' : 'NEW'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' };
const cardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '4px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const backButtonStyle = { backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const blueButtonStyle = { backgroundColor: '#4c51bf', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', width: '100%', marginTop: '5px' };