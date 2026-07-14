import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Doctors() {
    const navigate = useNavigate();

    // 1. Start with an empty array for doctors and set loading to true
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Backend-aligned Form Input States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [availability, setAvailability] = useState('Available');

    // 2. Simulate fetching data from the database on page load
    useEffect(() => {
        const mockDatabaseData = [
            { doctor_id: 1, first_name: 'Alok', last_name: 'Mishra', specialization: 'Cardiologist', status: 'ACTIVE', availability: 'Available' },
            { doctor_id: 2, first_name: 'Priya', last_name: 'Sharma', specialization: 'Pediatrician', status: 'ACTIVE', availability: 'On Leave' },
            { doctor_id: 3, first_name: 'Rajesh', last_name: 'Patel', specialization: 'Neurologist', status: 'ACTIVE', availability: 'In Surgery' }
        ];

        const timer = setTimeout(() => {
            setDoctors(mockDatabaseData);
            setLoading(false); // Stop showing the loading screen
        }, 1000); // 1-second delay

        return () => clearTimeout(timer);
    }, []);

    const handleAddDoctor = (e) => {
        e.preventDefault();
        if (!firstName || !specialization) return alert('Please enter at least First Name and Specialization');

        const newDoctor = {
            doctor_id: Date.now(),
            first_name: firstName,
            last_name: lastName,
            specialization: specialization,
            status: 'ACTIVE',
            availability: availability
        };

        setDoctors([...doctors, newDoctor]);
        setFirstName('');
        setLastName('');
        setSpecialization('');
    };

    const handleDeleteDoctor = (id) => {
        setDoctors(doctors.filter(doc => doc.doctor_id !== id));
    };

    // 3. Render the loading screen if data is still processing
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7fafc', fontSize: '20px', fontWeight: 'bold', color: '#4a5568', fontFamily: 'sans-serif' }}>
                🔄 Loading Medical Staff Registry...
            </div>
        );
    }

    // 4. Render the full interactive UI once loading turns false
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar />

            <div style={{ marginLeft: '240px', flex: 1, padding: '30px', boxSizing: 'border-box' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' }}>
                    <h1 style={{ margin: 0, color: '#1a202c', fontSize: '28px', fontWeight: '700' }}>Doctor & Medical Staff Directory</h1>
                    <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Back to Dashboard
                    </button>
                </header>

                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    {/* Input Form */}
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', flex: 1, minWidth: '280px', height: 'fit-content' }}>
                        <h2 style={{ marginTop: 0, color: '#2d3748', fontSize: '20px' }}>Add New Staff</h2>
                        <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                            <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} style={inputStyle} />
                            <select value={availability} onChange={(e) => setAvailability(e.target.value)} style={inputStyle}>
                                <option value="Available">Available</option>
                                <option value="On Leave">On Leave</option>
                                <option value="In Surgery">In Surgery</option>
                            </select>
                            <button type="submit" style={buttonStyle}>Add Doctor</button>
                        </form>
                    </div>

                    {/* Doctors Directory Table */}
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', flex: 2, minWidth: '320px' }}>
                        <h2 style={{ marginTop: 0, color: '#2d3748', fontSize: '20px' }}>Active Duty Rosters</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#4a5568' }}>
                                    <th style={{ padding: '12px' }}>Doctor Name</th>
                                    <th style={{ padding: '12px' }}>Specialization</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doc => (
                                    <tr key={doc.doctor_id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>
                                            Dr. {doc.first_name} {doc.last_name}
                                        </td>
                                        <td style={{ padding: '12px', color: '#4a5568' }}>{doc.specialization}</td>
                                        <td style={{ padding: '12px' }}>
                                            <select
                                                value={doc.availability}
                                                onChange={(e) => {
                                                    const updatedStatus = e.target.value;
                                                    setDoctors(doctors.map(d => d.doctor_id === doc.doctor_id ? { ...d, availability: updatedStatus } : d));
                                                }}
                                                style={{
                                                    padding: '6px 10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #cbd5e0',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#fff',
                                                    color: doc.availability === 'Available' ? '#38a169' : doc.availability === 'On Leave' ? '#e53e3e' : '#dd6b20',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="Available" style={{ color: '#38a169' }}>Available</option>
                                                <option value="On Leave" style={{ color: '#e53e3e' }}>On Leave</option>
                                                <option value="In Surgery" style={{ color: '#dd6b20' }}>In Surgery</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button onClick={() => handleDeleteDoctor(doc.doctor_id)} style={{ backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                                                Remove
                                            </button>
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

const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' };
const buttonStyle = { backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '8px' };