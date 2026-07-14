import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function BillingPage() {
    const navigate = useNavigate();

    // --- PHASE 6: MEDICINES INITIAL INVENTORY ---
    const [medicines] = useState([
        { medicine_id: 101, medicine_name: 'Paracetamol', medicine_code: 'MED-901', unit_price: 15.00, stock_quantity: 120 },
        { medicine_id: 102, medicine_name: 'Amoxicillin', medicine_code: 'MED-402', unit_price: 45.50, stock_quantity: 85 },
        { medicine_id: 103, medicine_name: 'Ibuprofen', medicine_code: 'MED-112', unit_price: 22.00, stock_quantity: 200 },
        { medicine_id: 104, medicine_name: 'Metformin', medicine_code: 'MED-205', unit_price: 28.00, stock_quantity: 150 },
        { medicine_id: 105, medicine_name: 'Atorvastatin', medicine_code: 'MED-309', unit_price: 62.00, stock_quantity: 90 },
        { medicine_id: 106, medicine_name: 'Omeprazole', medicine_code: 'MED-512', unit_price: 35.00, stock_quantity: 300 },
        { medicine_id: 107, medicine_name: 'Cetirizine', medicine_code: 'MED-884', unit_price: 18.00, stock_quantity: 250 },
        { medicine_id: 108, medicine_name: 'Azithromycin', medicine_code: 'MED-910', unit_price: 110.00, stock_quantity: 70 },
        { medicine_id: 109, medicine_name: 'Pantoprazole', medicine_code: 'MED-332', unit_price: 40.00, stock_quantity: 180 }
    ]);

    // --- PERSISTENT STATE LOADING VIA LOCALSTORAGE ---
    const [prescriptions, setPrescriptions] = useState(() => {
        const savedRx = localStorage.getItem('hospital_issued_prescriptions');
        return savedRx ? JSON.parse(savedRx) : [
            { prescription_id: 1, patient_name: 'John Doe', medicine_name: 'Paracetamol', dosage: '500mg', frequency: 'Thrice a day', duration: '5 Days' }
        ];
    });

    const [bills, setBills] = useState(() => {
        const savedBills = localStorage.getItem('hospital_billing_history');
        return savedBills ? JSON.parse(savedBills) : [
            {
                bill_id: 1,
                bill_number: 'BIL-2026-001',
                patient_name: 'John Doe',
                consultation_fee: 500.00,
                room_charges: 1200.00,
                medicine_charges: 75.00,
                other_charges: 150.00,
                total_amount: 1925.00,
                payment_status: 'PAID'
            }
        ];
    });

    // --- AUTOMATIC BACKUP SYNC TRIGGERS ---
    useEffect(() => {
        localStorage.setItem('hospital_issued_prescriptions', JSON.stringify(prescriptions));
    }, [prescriptions]);

    useEffect(() => {
        localStorage.setItem('hospital_billing_history', JSON.stringify(bills));
    }, [bills]);

    // Form Tracking States
    const [prescPatient, setPrescPatient] = useState('');
    const [selectedMed, setSelectedMed] = useState('101');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('');

    const [billPatient, setBillPatient] = useState('');
    const [fee, setFee] = useState('');
    const [roomFee, setRoomFee] = useState('');
    const [medFee, setMedFee] = useState('');

    // Handlers
    const handleAddPrescription = (e) => {
        e.preventDefault();

        const finalPatientName = prescPatient.trim() || 'Anonymous';
        const finalDosage = dosage.trim() || 'As directed';
        const finalFrequency = frequency.trim() || 'Once daily';
        const finalDuration = duration.trim() || 'As needed';

        const medObj = medicines.find(m => m.medicine_id === parseInt(selectedMed));

        const newPresc = {
            prescription_id: Date.now(),
            patient_name: finalPatientName,
            medicine_name: medObj ? medObj.medicine_name : 'Unknown',
            dosage: finalDosage,
            frequency: finalFrequency,
            duration: finalDuration
        };

        setPrescriptions([...prescriptions, newPresc]);
        setPrescPatient(''); setDosage(''); setFrequency(''); setDuration('');
    };

    const handleCreateBill = (e) => {
        e.preventDefault();

        const finalPatientName = billPatient.trim() || 'Anonymous';
        const cleanFee = parseFloat(fee) || 0.00;
        const cleanRoomFee = parseFloat(roomFee) || 0.00;
        const cleanMedFee = parseFloat(medFee) || 0.00;

        const total = cleanFee + cleanRoomFee + cleanMedFee;

        const newBill = {
            bill_id: Date.now(),
            bill_number: `BIL-2026-${Math.floor(100 + Math.random() * 900)}`,
            patient_name: finalPatientName,
            consultation_fee: cleanFee,
            room_charges: cleanRoomFee,
            medicine_charges: cleanMedFee,
            other_charges: 0.00,
            total_amount: total,
            payment_status: 'PENDING'
        };

        setBills([...bills, newBill]);
        setBillPatient(''); setFee(''); setRoomFee(''); setMedFee('');
    };

    const togglePaymentStatus = (id) => {
        setBills(bills.map(b => b.bill_id === id ? { ...b, payment_status: b.payment_status === 'PAID' ? 'PENDING' : 'PAID' } : b));
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />
            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box' }}>

                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' }}>
                    <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>Pharmacy & Accounts Module</h1>
                    <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Back to Dashboard
                    </button>
                </header>

                {/* MODULE TWO-COLUMN SPLIT */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>

                    {/* LEFT PANEL: PHASE 6 - PHARMACY */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div style={cardStyle}>
                            <h2 style={{ marginTop: 0, color: '#2c5282', fontSize: '18px' }}>Phase 6: Prescribe Medication</h2>
                            <form onSubmit={handleAddPrescription} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input type="text" placeholder="Patient Name" value={prescPatient} onChange={(e) => setPrescPatient(e.target.value)} style={inputStyle} />
                                <select value={selectedMed} onChange={(e) => setSelectedMed(e.target.value)} style={inputStyle}>
                                    {medicines.map(m => <option key={m.medicine_id} value={m.medicine_id}>{m.medicine_name} ({m.medicine_code}) - ₹{m.unit_price}</option>)}
                                </select>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="text" placeholder="Dosage (e.g. 500mg)" value={dosage} onChange={(e) => setDosage(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                    <input type="text" placeholder="Duration (e.g. 5 Days)" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                </div>
                                <input type="text" placeholder="Frequency (e.g. Twice daily)" value={frequency} onChange={(e) => setFrequency(e.target.value)} style={inputStyle} />
                                <button type="submit" style={{ ...buttonStyle, backgroundColor: '#2b6cb0' }}>Issue Prescription</button>
                            </form>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#4a5568' }}>Issued Prescriptions</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #edf2f7', textAlign: 'left' }}>
                                        <th style={{ padding: '8px' }}>Patient</th>
                                        <th style={{ padding: '8px' }}>Rx Medicine</th>
                                        <th style={{ padding: '8px' }}>Instructions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescriptions.map(p => (
                                        <tr key={p.prescription_id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                            <td style={{ padding: '8px', fontWeight: '500' }}>{p.patient_name}</td>
                                            <td style={{ padding: '8px', color: '#2b6cb0', fontWeight: 'bold' }}>{p.medicine_name}</td>
                                            <td style={{ padding: '8px', fontSize: '13px' }}>{p.dosage} | {p.frequency} ({p.duration})</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT PANEL: PHASE 7 - INVOICING */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div style={cardStyle}>
                            <h2 style={{ marginTop: 0, color: '#b7791f', fontSize: '18px' }}>Phase 7: Process Patient Invoice</h2>
                            <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input type="text" placeholder="Patient Name" value={billPatient} onChange={(e) => setBillPatient(e.target.value)} style={inputStyle} />
                                <input type="number" placeholder="Consultation Fee (₹)" value={fee} onChange={(e) => setFee(e.target.value)} style={inputStyle} />
                                <input type="number" placeholder="Room/Ward Charges (₹)" value={roomFee} onChange={(e) => setRoomFee(e.target.value)} style={inputStyle} />
                                <input type="number" placeholder="Medicine Charges (₹)" value={medFee} onChange={(e) => setMedFee(e.target.value)} style={inputStyle} />
                                <button type="submit" style={{ ...buttonStyle, backgroundColor: '#dd6b20' }}>Generate Invoicing Ledger</button>
                            </form>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#4a5568' }}>Billing History Statements</h3>
                            {bills.map(b => (
                                <div key={b.bill_id} style={{ padding: '12px', border: '1px solid #edf2f7', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{b.patient_name} <span style={{ color: '#a0aec0', fontWeight: 'normal' }}>({b.bill_number})</span></div>
                                        <div style={{ fontSize: '12px', color: '#718096', marginTop: '3px' }}>
                                            Consult: ₹{b.consultation_fee} | Room: ₹{b.room_charges} | Rx: ₹{b.medicine_charges}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '800', color: '#2d3748' }}>₹{b.total_amount}</div>
                                        <button
                                            onClick={() => togglePaymentStatus(b.bill_id)}
                                            style={{
                                                border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px',
                                                backgroundColor: b.payment_status === 'PAID' ? '#c6f6d5' : '#feebc8',
                                                color: b.payment_status === 'PAID' ? '#22543d' : '#744210'
                                            }}
                                        >
                                            {b.payment_status}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px', boxSizing: 'border-box' };