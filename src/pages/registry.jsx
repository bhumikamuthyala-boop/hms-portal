import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function RegistrySearchPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    // --- COMPLETE UNIFIED REGISTRY DATA (PHASES 1, 3, & 4 SCHEMA COLUMNS) ---
    const [masterRegistry] = useState([
        {
            id: 'DOC-101',
            type: 'DOCTOR',
            first_name: 'Alok',
            last_name: 'Mishra',
            email: 'alok.mishra@hospital.com',
            mobile: '+91 98765 43210',
            gender: 'Male',
            status: 'ACTIVE',
            // Doctor specific columns
            doctor_code: 'DOC-MISHRA-01',
            qualification: 'MD, DM (Cardiology)',
            specialization: 'Interventional Cardiology',
            experience_years: 14,
            consultation_fee: '₹500.00',
            joining_date: '2022-04-12',
            department: 'Cardiology'
        },
        {
            id: 'DOC-102',
            type: 'DOCTOR',
            first_name: 'Priya',
            last_name: 'Sharma',
            email: 'priya.sharma@hospital.com',
            mobile: '+91 98765 43211',
            gender: 'Female',
            status: 'ACTIVE',
            doctor_code: 'DOC-SHARMA-02',
            qualification: 'MBBS, DCH (Pediatrics)',
            specialization: 'Neonatology',
            experience_years: 8,
            consultation_fee: '₹400.00',
            joining_date: '2024-01-15',
            department: 'Pediatrics'
        },
        {
            id: 'PT-9821',
            type: 'PATIENT',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@gmail.com',
            mobile: '+91 94401 23456',
            gender: 'Male',
            status: 'ACTIVE',
            // Patient specific columns
            patient_number: 'PT-9821',
            date_of_birth: '1992-05-14',
            blood_group: 'O+0',
            address: 'Flat 402, Star Towers, Main Road, Nellore',
            emergency_contact_name: 'Jane Doe (Wife)',
            emergency_contact_mobile: '+91 94401 23457'
        },
        {
            id: 'REC-301',
            type: 'RECEPTIONIST',
            first_name: 'Kiran',
            last_name: 'Kumar',
            email: 'kiran.k@hospital.com',
            mobile: '+91 81234 56789',
            gender: 'Male',
            status: 'ACTIVE',
            // User/Staff specific
            username: 'kiran_frontdesk',
            assigned_shift: 'General Day Shift',
            desk_extension: 'EXT-104'
        }
    ]);

    // Search Logic (Filters by ID, First Name, or Last Name)
    const filteredRecords = masterRegistry.filter(record => {
        const query = searchQuery.toLowerCase();
        return (
            record.id.toLowerCase().includes(query) ||
            record.first_name.toLowerCase().includes(query) ||
            record.last_name.toLowerCase().includes(query)
        );
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />
            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box' }}>

                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>Master Registry Search</h1>
                        <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>Search and view deep details for Patients, Doctors, and Staff by Name or ID</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Back to Dashboard
                    </button>
                </header>

                {/* SEARCH INPUT BAR */}
                <div style={{ marginBottom: '25px' }}>
                    <input
                        type="text"
                        placeholder="🔍 Type Name, Doctor Code, or Patient ID (e.g., 'John', 'PT-9821', 'Alok')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '15px 20px', borderRadius: '8px', border: '2px solid #cbd5e0', fontSize: '16px', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>

                    {/* LEFT PANEL: FILTERED RESULTS LIST */}
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#4a5568' }}>Matching System Directory Profiles ({filteredRecords.length})</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredRecords.map(record => (
                                <div
                                    key={record.id}
                                    onClick={() => setSelectedRecord(record)}
                                    style={{ padding: '15px', border: '1px solid #edf2f7', borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedRecord?.id === record.id ? '#ebf8ff' : '#fafafa', borderLeft: selectedRecord?.id === record.id ? '5px solid #3182ce' : '1px solid #edf2f7', transition: 'all 0.2s' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', backgroundColor: record.type === 'DOCTOR' ? '#e2e8f0' : record.type === 'PATIENT' ? '#feebc8' : '#e2fbf0', color: record.type === 'DOCTOR' ? '#4a5568' : record.type === 'PATIENT' ? '#c05621' : '#22543d' }}>
                                            {record.type}
                                        </span>
                                        <span style={{ fontSize: '13px', color: '#718096', fontWeight: 'bold' }}>{record.id}</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '8px', color: '#2d3748' }}>
                                        {record.first_name} {record.last_name}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>✉ {record.email} | 📱 {record.mobile}</div>
                                </div>
                            ))}
                            {filteredRecords.length === 0 && (
                                <div style={{ color: '#a0aec0', textAlign: 'center', padding: '20px' }}>No direct system files found matching that profile reference query.</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: FULL DATABASE DETAIL SHEET VIEWER */}
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', minHeight: '300px' }}>
                        {selectedRecord ? (
                            <div>
                                <div style={{ borderBottom: '2px solid #edf2f7', paddingBottom: '15px', marginBottom: '20px' }}>
                                    <h2 style={{ margin: 0, color: '#1a202c' }}>{selectedRecord.first_name} {selectedRecord.last_name}</h2>
                                    <p style={{ margin: '5px 0 0 0', color: '#718096', fontWeight: '600' }}>System Reference ID Mapping: <span style={{ color: '#3182ce' }}>{selectedRecord.id}</span></p>
                                </div>

                                <h4 style={{ color: '#4a5568', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Core Schema Demographics</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '14px' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096', width: '40%' }}>Account Group Profile:</td><td style={{ fontWeight: 'bold' }}>{selectedRecord.type}</td></tr>
                                        <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Mobile Registry Link:</td><td>{selectedRecord.mobile}</td></tr>
                                        <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Email Endpoint Address:</td><td>{selectedRecord.email}</td></tr>
                                        <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Gender Status:</td><td>{selectedRecord.gender}</td></tr>
                                        <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Status Flag:</td><td style={{ color: '#48bb78', fontWeight: 'bold' }}>● {selectedRecord.status}</td></tr>
                                    </tbody>
                                </table>

                                {/* CONDITIONALLY DISPLAY SPECIFIC EXTRACTS DEPENDING ON PHASE MODEL */}
                                {selectedRecord.type === 'DOCTOR' && (
                                    <>
                                        <h4 style={{ color: '#2b6cb0', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>Phase 3 Clinical Registry Specifications</h4>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096', width: '40%' }}>Unique Doctor Code:</td><td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedRecord.doctor_code}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Assigned Department:</td><td>{selectedRecord.department}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Qualifications:</td><td style={{ fontWeight: '500' }}>{selectedRecord.qualification}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Specialization Area:</td><td>{selectedRecord.specialization}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Tenure Experience:</td><td>{selectedRecord.experience_years} Years Active</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Standard Outpatient Fee:</td><td style={{ fontWeight: 'bold', color: '#2b6cb0' }}>{selectedRecord.consultation_fee}</td></tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {selectedRecord.type === 'PATIENT' && (
                                    <>
                                        <h4 style={{ color: '#c05621', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>Phase 4 Medical Case File Records</h4>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096', width: '40%' }}>Patient Number:</td><td style={{ fontWeight: 'bold' }}>{selectedRecord.patient_number}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Date of Birth:</td><td>{selectedRecord.date_of_birth}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Blood Group Identity:</td><td style={{ color: '#e53e3e', fontWeight: 'bold' }}>{selectedRecord.blood_group}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Residential Address:</td><td>{selectedRecord.address}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Emergency Point Person:</td><td>{selectedRecord.emergency_contact_name}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Emergency Contact Mobile:</td><td>{selectedRecord.emergency_contact_mobile}</td></tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {selectedRecord.type === 'RECEPTIONIST' && (
                                    <>
                                        <h4 style={{ color: '#22543d', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>Phase 1 Core Access System Profile</h4>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096', width: '40%' }}>Database Username:</td><td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedRecord.username}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Roster Shift Segment:</td><td>{selectedRecord.assigned_shift}</td></tr>
                                                <tr style={{ borderBottom: '1px solid #f7fafc' }}><td style={{ padding: '8px 0', color: '#718096' }}>Intercom Extension:</td><td>{selectedRecord.desk_extension}</td></tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#a0aec0', minHeight: '260px' }}>
                                <span style={{ fontSize: '40px', marginBottom: '10px' }}>📄</span>
                                <p style={{ margin: 0 }}>Select a profile entry from the directory column to display full itemized ledger information details.</p>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}