// src/constants/mockData.js

export const MOCK_DOCTORS = [
    {
        doctor_id: 1,
        first_name: 'Alok',
        last_name: 'Mishra',
        specialization: 'Cardiologist',
        status: 'ACTIVE',
        availability: 'Available' // keeping your UI state toggle compatibility
    },
    {
        doctor_id: 2,
        first_name: 'Priya',
        last_name: 'Sharma',
        specialization: 'Pediatrician',
        status: 'ACTIVE',
        availability: 'On Leave'
    }
];

export const MOCK_PATIENTS = [
    {
        patient_id: 1,
        patient_number: 'PT-1001',
        first_name: 'John',
        last_name: 'Doe',
        disease: 'Fever', // maps to your dashboard layout UI
        room_number: '102',
        status: 'ACTIVE'
    }
];