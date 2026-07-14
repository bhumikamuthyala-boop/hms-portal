import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardPage from './pages/dashboard';
import Doctors from './pages/doctors';
import BillingPage from './pages/billing';
import AdmissionsBlock from './pages/admissions';
import AppointmentBlock from './pages/appointments';
import RolesBlock from './pages/roles';
import RegistrySearchPage from './pages/registry';
import MasterLedger from './pages/MasterLedger';

export default function App() {
  // 1. Load initial patients from localStorage memory cache if they exist, otherwise use defaults
  const [globalPatients, setGlobalPatients] = useState(() => {
    const saved = localStorage.getItem('hospital_global_patients');
    return saved ? JSON.parse(saved) : [
      { id: 'PT-9821', first_name: 'John', last_name: 'Doe', mobile: '+91 94401 23456', address: 'Flat 402, Star Towers, Nellore', blood_group: 'O+', gender: 'Male', type: 'PATIENT', status: 'ACTIVE' },
      { id: 'PT-1044', first_name: 'Rahul', last_name: 'Kumar', mobile: '+91 94405 67890', address: 'Trunk Road, Nellore', blood_group: 'A+', gender: 'Male', type: 'PATIENT', status: 'ACTIVE' },
      { id: 'PT-3312', first_name: 'Sneha', last_name: 'Reddy', mobile: '+91 81234 56789', address: 'Dargamitta, Nellore', blood_group: 'B+', gender: 'Female', type: 'PATIENT', status: 'ACTIVE' }
    ];
  });

  // 2. Automatically sync to localStorage whenever the central database array context updates
  useEffect(() => {
    localStorage.setItem('hospital_global_patients', JSON.stringify(globalPatients));
  }, [globalPatients]);

  // Helper to register a newly discovered patient into the main system records
  const addGlobalPatient = (newPatient) => {
    setGlobalPatients((prev) => [newPatient, ...prev]);
  };

  return (
    <Router>
      <Routes>
        {/* 1. Portal Entrance */}
        <Route path="/" element={<Login />} />

        {/* 2. Main Portal App */}
        <Route path="/dashboard" element={<DashboardPage patients={globalPatients} />} />

        {/* 3. Doctors View */}
        <Route path="/doctors" element={<Doctors />} />

        {/* 4. Financial & Administrative Modules */}
        <Route path="/billing" element={<BillingPage patients={globalPatients} />} />
        <Route path="/admissions" element={<AdmissionsBlock patients={globalPatients} />} />

        {/* 5. OP Booking Desk */}
        <Route
          path="/appointments"
          element={<AppointmentBlock patients={globalPatients} onRegisterPatient={addGlobalPatient} />}
        />

        {/* 6. System Configurations & Master Registry Lookup */}
        <Route path="/roles" element={<RolesBlock />} />
        <Route path="/registry" element={<RegistrySearchPage patients={globalPatients} />} />

        {/* 🔥 FIX: ADDED THE MASTER LEDGER ROUTE HERE */}
        <Route path="/master-ledger" element={<MasterLedger />} />

        {/* 7. Error fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}