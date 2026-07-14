import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function RolesBlock() {
    const navigate = useNavigate();

    // --- EXACT MATCH FROM TEAM DATABASE SCHEMA IMAGE ---
    const [roles] = useState([
        { role_id: 1, role_name: 'Super Admin', description: 'Complete administrative controls and configuration overrides across system parameters.', status: 'ACTIVE' },
        { role_id: 2, role_name: 'Hospital Admin', description: 'Hospital management settings, multi-tenant branch routing, and configurations.', status: 'ACTIVE' },
        { role_id: 3, role_name: 'Doctor', description: 'Doctor clinical workspace access, diagnostic history tracking, and patient consultation.', status: 'ACTIVE' },
        { role_id: 4, role_name: 'Nurse', description: 'Nurse role access, ward bed monitoring tools, and vitals logging registries.', status: 'ACTIVE' },
        { role_id: 5, role_name: 'Receptionist', description: 'Reception workspace, frontdesk token booking, and basic patient registry access.', status: 'ACTIVE' },
        { role_id: 6, role_name: 'Lab Technician', description: 'Laboratory diagnostics tracking, report generation, and sample status logging.', status: 'ACTIVE' },
        { role_id: 7, role_name: 'Pharmacist', description: 'Pharmacy inventory handling, medicine batch issuance, and drug code lookups.', status: 'ACTIVE' },
        { role_id: 8, role_name: 'Accountant', description: 'Billing ledger auditing, invoices, itemized room calculation processing.', status: 'ACTIVE' },
        { role_id: 9, role_name: 'Patient', description: 'Patient portal view configurations, online prescription logs, and payment histories.', status: 'ACTIVE' }
    ]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />
            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box' }}>

                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>Role & Permission Matrix</h1>
                        <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>Phase 1: Base Access Group Policies — 9 Verified Table Schemes</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Back to Dashboard
                    </button>
                </header>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c5282' }}>System Authorization Levels ({roles.length} Registered Base Roles)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {roles.map(r => (
                            <div key={r.role_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #edf2f7', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ backgroundColor: '#edf2f7', color: '#4a5568', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                        {r.role_id}
                                    </span>
                                    <div>
                                        <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                                            {r.role_name}
                                        </span>
                                        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#718096' }}>{r.description}</p>
                                    </div>
                                </div>
                                <span style={{ color: '#48bb78', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}>● {r.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}