import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdmissionsBlock() {
    const navigate = useNavigate();

    // --- PHASE 5: WARDS & ROOMS MOCK DATA ---
    const [wards] = useState([
        { ward_id: 1, ward_name: 'General Ward A', ward_type: 'General', total_rooms: 5 },
        { ward_id: 2, ward_name: 'ICU Block 1', ward_type: 'ICU', total_rooms: 2 }
    ]);

    const [rooms, setRooms] = useState([
        { room_id: 101, ward_id: 1, room_number: 'G-101', room_type: 'General', room_charge: 1000.00, status: 'OCCUPIED' },
        { room_id: 102, ward_id: 1, room_number: 'G-102', room_type: 'General', room_charge: 1000.00, status: 'AVAILABLE' },
        { room_id: 201, ward_id: 2, room_number: 'ICU-201', room_type: 'ICU', room_charge: 5000.00, status: 'OCCUPIED' },
        { room_id: 202, ward_id: 2, room_number: 'ICU-202', room_type: 'ICU', room_charge: 5000.00, status: 'AVAILABLE' }
    ]);

    // Live Active Admissions List matching Phase 5 Schema structure
    const [liveAdmissions, setLiveAdmissions] = useState([
        { admission_id: 1, admission_number: 'ADM-2026-001', patient_name: 'John Doe', doctor_name: 'Dr. Alok Mishra', room_number: 'G-101', admission_date: '2026-07-01', admission_status: 'ADMITTED' },
        { admission_id: 2, admission_number: 'ADM-2026-002', patient_name: 'Jane Smith', doctor_name: 'Dr. Priya Sharma', room_number: 'ICU-201', admission_date: '2026-07-05', admission_status: 'ADMITTED' }
    ]);

    // Form Entry States
    const [patientName, setPatientName] = useState('');
    const [doctorName, setDoctorName] = useState('Dr. Alok Mishra');
    const [selectedRoomId, setSelectedRoomId] = useState('102');

    const handleNewAdmission = (e) => {
        e.preventDefault();
        if (!patientName) return alert('Please enter patient name for admission assignment.');

        const targetRoom = rooms.find(r => r.room_id === parseInt(selectedRoomId));
        if (!targetRoom || targetRoom.status === 'OCCUPIED') return alert('Selected room is no longer available.');

        const nextAdmission = {
            admission_id: Date.now(),
            admission_number: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
            patient_name: patientName,
            doctor_name: doctorName,
            room_number: targetRoom.room_number,
            admission_date: new Date().toISOString().split('T')[0],
            admission_status: 'ADMITTED'
        };

        setRooms(rooms.map(r => r.room_id === targetRoom.room_id ? { ...r, status: 'OCCUPIED' } : r));
        setLiveAdmissions([...liveAdmissions, nextAdmission]);
        setPatientName('');

        const nextAvail = rooms.find(r => r.room_id !== targetRoom.room_id && r.status === 'AVAILABLE');
        if (nextAvail) {
            setSelectedRoomId(nextAvail.room_id.toString());
        }
    };

    const handleDischarge = (admissionId, roomNum) => {
        setRooms(rooms.map(r => r.room_number === roomNum ? { ...r, status: 'AVAILABLE' } : r));
        setLiveAdmissions(liveAdmissions.filter(a => a.admission_id !== admissionId));
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />

            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>Admission Block & Ward Manager</h1>
                        <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>Phase 5 Layout: Ward Registry, Room Allocations, and Active Status Tracking</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Back to Dashboard
                    </button>
                </header>

                {/* TOP HALF: CURRENT ROOM STATUS LIST BY WARD */}
                <div style={{ ...cardStyle, marginBottom: '25px' }}>
                    <h2 style={{ marginTop: 0, fontSize: '18px', color: '#2b6cb0' }}>Live Room Availability Status</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '15px' }}>
                        {rooms.map(room => (
                            <div key={room.room_id} style={{
                                padding: '20px',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                borderTop: '1px solid #e2e8f0',
                                borderRight: '1px solid #e2e8f0',
                                borderBottom: '1px solid #e2e8f0',
                                borderLeft: room.status === 'AVAILABLE' ? '5px solid #38a169' : '5px solid #e53e3e',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '16px' }}>Room {room.room_number}</div>
                                <div style={{ fontSize: '12px', color: '#718096', margin: '6px 0 10px 0' }}>Type: {room.room_type} | Charge: ₹{room.room_charge}</div>
                                {/* Fixed single closing bracket syntax glitch here: */}
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: room.status === 'AVAILABLE' ? '#38a169' : '#e53e3e' }}>
                                    {room.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM HALF: FORMS AND ACTIVE ADMISSIONS REGISTRY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '30px', alignItems: 'start' }}>

                    {/* Allocation Form */}
                    <div style={cardStyle}>
                        <h3 style={{ marginTop: 0, fontSize: '18px', color: '#2b6cb0', marginBottom: '20px' }}>Allocate Room Allocation</h3>
                        <form onSubmit={handleNewAdmission} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Patient Full Name</label>
                                <input type="text" placeholder="Patient Full Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Assigned Consulting Physician</label>
                                <select value={doctorName} onChange={(e) => setDoctorName(e.target.value)} style={inputStyle}>
                                    <option value="Dr. Alok Mishra">Dr. Alok Mishra (Cardio)</option>
                                    <option value="Dr. Priya Sharma">Dr. Priya Sharma (Pedia)</option>
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Select Target Room</label>
                                <select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)} style={inputStyle}>
                                    {rooms.filter(r => r.status === 'AVAILABLE').map(r => (
                                        <option key={r.room_id} value={r.room_id}>{r.room_number} ({r.room_type} - ₹{r.room_charge})</option>
                                    ))}
                                    {rooms.filter(r => r.status === 'OCCUPIED').map(r => (
                                        <option key={r.room_id} value={r.room_id} disabled>{r.room_number} ({r.room_type}) - Occupied</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" style={buttonStyle}>Confirm Admission Allocation</button>
                        </form>
                    </div>

                    {/* Active Grid Table */}
                    <div style={cardStyle}>
                        <h3 style={{ marginTop: 0, fontSize: '18px', color: '#2d3748', marginBottom: '20px' }}>Active Admission Records</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#4a5568' }}>
                                    <th style={{ padding: '10px' }}>Admission No</th>
                                    <th style={{ padding: '10px' }}>Patient</th>
                                    <th style={{ padding: '10px' }}>Assigned Room</th>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {liveAdmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#a0aec0' }}>No active ward admissions logged currently.</td>
                                    </tr>
                                ) : (
                                    liveAdmissions.map(adm => (
                                        <tr key={adm.admission_id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                            <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#4a5568' }}>{adm.admission_number}</td>
                                            <td style={{ padding: '12px 10px' }}>
                                                <div style={{ fontWeight: '600', color: '#2d3748' }}>{adm.patient_name}</div>
                                                <div style={{ fontSize: '12px', color: '#a0aec0' }}>Physician: {adm.doctor_name}</div>
                                            </td>
                                            <td style={{ padding: '12px 10px', color: '#2b6cb0', fontWeight: 'bold' }}>{adm.room_number}</td>
                                            <td style={{ padding: '12px 10px', color: '#718096' }}>{adm.admission_date}</td>
                                            <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDischarge(adm.admission_id, adm.room_number)}
                                                    style={{ backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                                                >
                                                    Discharge & Free
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </div>
    );
}

const cardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#718096', marginBottom: '5px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const buttonStyle = { backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', width: '100%' };