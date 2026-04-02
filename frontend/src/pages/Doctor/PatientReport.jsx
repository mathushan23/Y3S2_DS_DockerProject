import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, Button, Modal, Table, Badge,
    Alert, Spinner, Toast, ToastContainer, Form, InputGroup,
    Tabs, Tab, ListGroup, Image, ProgressBar
} from 'react-bootstrap';
import {
    FileText, Download, Eye, Calendar, User, Search,
    Clock, CheckCircle, AlertCircle,
    Activity, Heart, Droplet, Thermometer, Ruler,
    Weight, Stethoscope, Pill,
    Printer, MessageCircle, Phone, Mail,
    ChevronRight, XCircle
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const PatientReport = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';

    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [activeTab, setActiveTab] = useState('reports');
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportPreview, setReportPreview] = useState(null);

    // Mock patients data
    const [patients, setPatients] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 234 567 8900",
            age: 35,
            gender: "Male",
            bloodType: "O+",
            lastVisit: "2024-03-15",
            medicalHistory: {
                chronicConditions: ["Hypertension", "Type 2 Diabetes"],
                allergies: ["Penicillin", "Peanuts"],
                surgeries: ["Appendectomy (2015)"],
                medications: ["Lisinopril 10mg", "Metformin 500mg"],
                familyHistory: ["Father: Heart Disease", "Mother: Diabetes"],
                immunizations: ["COVID-19 Vaccinated", "Flu Shot 2024"],
                lifestyle: {
                    smoking: "Non-smoker",
                    alcohol: "Occasional",
                    exercise: "Moderate",
                    diet: "Balanced"
                }
            },
            reports: [
                {
                    id: 1,
                    title: "Blood Test Results",
                    type: "Lab Report",
                    date: "2024-03-10",
                    category: "Laboratory",
                    fileType: "pdf",
                    size: "2.4 MB",
                    doctor: "Dr. Sarah Wilson",
                    appointmentId: 1,
                    description: "Complete blood count and metabolic panel",
                    findings: "Elevated cholesterol levels, normal blood sugar",
                    recommendations: "Diet modification and exercise"
                },
                {
                    id: 2,
                    title: "Chest X-Ray",
                    type: "Imaging",
                    date: "2024-03-05",
                    category: "Radiology",
                    fileType: "jpg",
                    size: "5.1 MB",
                    doctor: "Dr. Sarah Wilson",
                    appointmentId: 1,
                    description: "Chest X-ray for persistent cough",
                    findings: "Mild bronchial inflammation",
                    recommendations: "Follow-up in 2 weeks"
                },
                {
                    id: 3,
                    title: "ECG Report",
                    type: "Cardiology",
                    date: "2024-02-28",
                    category: "Cardiac",
                    fileType: "pdf",
                    size: "1.8 MB",
                    doctor: "Dr. Sarah Wilson",
                    appointmentId: 2,
                    description: "Resting ECG",
                    findings: "Normal sinus rhythm",
                    recommendations: "Regular monitoring"
                }
            ]
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+1 234 567 8901",
            age: 28,
            gender: "Female",
            bloodType: "A+",
            lastVisit: "2024-03-12",
            medicalHistory: {
                chronicConditions: ["Asthma"],
                allergies: ["Dust", "Pollen"],
                surgeries: [],
                medications: ["Albuterol Inhaler PRN"],
                familyHistory: ["Mother: Asthma"],
                immunizations: ["COVID-19 Vaccinated", "Flu Shot 2024", "HPV Vaccine"],
                lifestyle: {
                    smoking: "Non-smoker",
                    alcohol: "Never",
                    exercise: "Active",
                    diet: "Vegetarian"
                }
            },
            reports: [
                {
                    id: 4,
                    title: "Pulmonary Function Test",
                    type: "Respiratory",
                    date: "2024-03-08",
                    category: "Pulmonary",
                    fileType: "pdf",
                    size: "3.2 MB",
                    doctor: "Dr. Sarah Wilson",
                    appointmentId: 3,
                    description: "Lung function assessment",
                    findings: "Mild obstructive pattern",
                    recommendations: "Inhaler technique review"
                }
            ]
        },
        {
            id: 3,
            name: "Robert Johnson",
            email: "robert@example.com",
            phone: "+1 234 567 8902",
            age: 42,
            gender: "Male",
            bloodType: "B+",
            lastVisit: "2024-03-10",
            medicalHistory: {
                chronicConditions: ["High Cholesterol"],
                allergies: ["Sulfa drugs"],
                surgeries: ["Knee Arthroscopy (2020)"],
                medications: ["Atorvastatin 20mg"],
                familyHistory: ["Father: Heart Attack at 55"],
                immunizations: ["COVID-19 Vaccinated", "Flu Shot 2024", "Pneumonia Vaccine"],
                lifestyle: {
                    smoking: "Former smoker",
                    alcohol: "Moderate",
                    exercise: "Sedentary",
                    diet: "Regular"
                }
            },
            reports: [
                {
                    id: 5,
                    title: "Lipid Profile",
                    type: "Lab Report",
                    date: "2024-03-05",
                    category: "Laboratory",
                    fileType: "pdf",
                    size: "1.5 MB",
                    doctor: "Dr. Sarah Wilson",
                    appointmentId: 4,
                    description: "Cholesterol and triglyceride levels",
                    findings: "Elevated LDL cholesterol",
                    recommendations: "Statins and lifestyle changes"
                }
            ]
        }
    ]);

    // Mock appointments data
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patientId: 1,
            patientName: "John Doe",
            doctorId: 1,
            doctorName: "Dr. Sarah Wilson",
            date: "2024-03-15",
            time: "10:00 AM",
            status: "COMPLETED",
            diagnosis: "Hypertension",
            prescription: "Lisinopril 10mg daily",
            notes: "Blood pressure elevated. Follow up in 1 month."
        },
        {
            id: 2,
            patientId: 1,
            patientName: "John Doe",
            doctorId: 1,
            doctorName: "Dr. Sarah Wilson",
            date: "2024-02-28",
            time: "02:00 PM",
            status: "COMPLETED",
            diagnosis: "Diabetes Type 2",
            prescription: "Metformin 500mg twice daily",
            notes: "Blood sugar levels improving"
        },
        {
            id: 3,
            patientId: 2,
            patientName: "Jane Smith",
            doctorId: 1,
            doctorName: "Dr. Sarah Wilson",
            date: "2024-03-12",
            time: "11:30 AM",
            status: "COMPLETED",
            diagnosis: "Asthma",
            prescription: "Albuterol inhaler as needed",
            notes: "Asthma controlled with current medication"
        },
        {
            id: 4,
            patientId: 3,
            patientName: "Robert Johnson",
            doctorId: 1,
            doctorName: "Dr. Sarah Wilson",
            date: "2024-03-10",
            time: "03:00 PM",
            status: "COMPLETED",
            diagnosis: "Hyperlipidemia",
            prescription: "Atorvastatin 20mg daily",
            notes: "Dietary counseling recommended"
        }
    ]);

    const [filteredPatients, setFilteredPatients] = useState([]);
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [patientReports, setPatientReports] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterPatients();
    }, [searchTerm, patients]);

    const loadData = () => {
        setLoading(true);
        // Load from localStorage if available
        const storedPatients = localStorage.getItem('patients');
        const storedAppointments = localStorage.getItem('appointments');

        if (storedPatients) {
            setPatients(JSON.parse(storedPatients));
        }
        if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
        }

        setFilteredPatients(patients);
        setLoading(false);
    };

    const filterPatients = () => {
        let filtered = [...patients];
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.phone.includes(searchTerm)
            );
        }
        setFilteredPatients(filtered);
    };

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        // Get patient's appointments
        const patientApps = appointments.filter(a => a.patientId === patient.id);
        setPatientAppointments(patientApps);
        // Get patient's reports
        const patientReps = patient.reports || [];
        setPatientReports(patientReps);
        setActiveTab('reports');
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setReportPreview(report.fileType === 'jpg' ? 'https://via.placeholder.com/800x600?text=Medical+Report+Preview' : null);
        setShowReportModal(true);
    };

    const handleViewMedicalHistory = (appointment) => {
        setSelectedAppointment(appointment);
        setShowMedicalHistoryModal(true);
    };

    const handleDownloadReport = (report) => {
        showNotification(`Downloading ${report.title}...`, "info");
        setTimeout(() => {
            showNotification(`${report.title} downloaded successfully!`, "success");
        }, 1500);
    };

    const handlePrintReport = () => {
        window.print();
    };

    const showNotification = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const getFileIcon = (fileType) => {
        switch(fileType) {
            case 'pdf':
                return <FileText size={20} className="text-danger" />;
            case 'jpg':
            case 'png':
            case 'jpeg':
                return <FileText size={20} className="text-primary" />;
            default:
                return <FileText size={20} className="text-secondary" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'COMPLETED':
                return <Badge bg="success">Completed</Badge>;
            case 'PENDING':
                return <Badge bg="warning">Pending</Badge>;
            case 'CANCELLED':
                return <Badge bg="danger">Cancelled</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastVariant === 'success' && <CheckCircle size={18} />}
                            {toastVariant === 'danger' && <AlertCircle size={18} />}
                        </strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div>
                                    <h2 className="mb-1 fw-bold">Patient Reports & Medical History</h2>
                                    <p className="text-muted mb-0">
                                        View patient reports, medical records, and appointment history
                                    </p>
                                </div>
                                <InputGroup style={{ maxWidth: '300px' }}>
                                    <InputGroup.Text>
                                        <Search size={18} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search patients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading patient data...</p>
                </div>
            ) : (
                <Row>
                    {/* Patients List */}
                    <Col lg={4} className="mb-4">
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-white border-0 pt-4">
                                <h5 className="mb-0">Patients ({filteredPatients.length})</h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <ListGroup variant="flush">
                                    {filteredPatients.map((patient) => (
                                        <ListGroup.Item
                                            key={patient.id}
                                            action
                                            active={selectedPatient?.id === patient.id}
                                            onClick={() => handleSelectPatient(patient)}
                                            className="p-3"
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div className="fw-semibold">{patient.name}</div>
                                                    <small className="text-muted">
                                                        {patient.age} yrs • {patient.gender} • {patient.bloodType}
                                                    </small>
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            Last Visit: {formatDate(patient.lastVisit)}
                                                        </small>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} className="text-muted" />
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Patient Details */}
                    <Col lg={8}>
                        {selectedPatient ? (
                            <Card className="shadow-sm border-0">
                                <Card.Header className="bg-white border-0 pt-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h4 className="mb-1">{selectedPatient.name}</h4>
                                            <div className="d-flex gap-3 flex-wrap">
                                                <small className="text-muted">
                                                    <User size={14} className="me-1" />
                                                    {selectedPatient.age} years, {selectedPatient.gender}
                                                </small>
                                                <small className="text-muted">
                                                    <Droplet size={14} className="me-1" />
                                                    Blood Type: {selectedPatient.bloodType}
                                                </small>
                                                <small className="text-muted">
                                                    <Mail size={14} className="me-1" />
                                                    {selectedPatient.email}
                                                </small>
                                                <small className="text-muted">
                                                    <Phone size={14} className="me-1" />
                                                    {selectedPatient.phone}
                                                </small>
                                            </div>
                                        </div>
                                        <Button variant="outline-primary" size="sm">
                                            <MessageCircle size={16} className="me-1" />
                                            Contact
                                        </Button>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Tabs
                                        activeKey={activeTab}
                                        onSelect={(k) => setActiveTab(k)}
                                        className="mb-3"
                                    >
                                        <Tab eventKey="reports" title={`Reports (${patientReports.length})`} />
                                        <Tab eventKey="appointments" title={`Appointments (${patientAppointments.length})`} />
                                        <Tab eventKey="medical-history" title="Medical History" />
                                        <Tab eventKey="vitals" title="Vitals & Metrics" />
                                    </Tabs>

                                    {/* Reports Tab */}
                                    {activeTab === 'reports' && (
                                        <>
                                            {patientReports.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <FileText size={48} className="text-muted mb-3" />
                                                    <h6>No Reports Available</h6>
                                                    <p className="text-muted">No medical reports found for this patient</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table hover>
                                                        <thead className="bg-light">
                                                        <tr>
                                                            <th>Title</th>
                                                            <th>Type</th>
                                                            <th>Date</th>
                                                            <th>Doctor</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {patientReports.map((report) => (
                                                            <tr key={report.id}>
                                                                <td>
                                                                    <div className="fw-semibold">{report.title}</div>
                                                                    <small className="text-muted">{report.description}</small>
                                                                </td>
                                                                <td>
                                                                    <Badge bg="info">{report.type}</Badge>
                                                                </td>
                                                                <td>{formatDate(report.date)}</td>
                                                                <td>{report.doctor}</td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <Button
                                                                            variant="outline-primary"
                                                                            size="sm"
                                                                            onClick={() => handleViewReport(report)}
                                                                        >
                                                                            <Eye size={16} />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline-success"
                                                                            size="sm"
                                                                            onClick={() => handleDownloadReport(report)}
                                                                        >
                                                                            <Download size={16} />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Appointments Tab */}
                                    {activeTab === 'appointments' && (
                                        <>
                                            {patientAppointments.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <Calendar size={48} className="text-muted mb-3" />
                                                    <h6>No Appointments Found</h6>
                                                    <p className="text-muted">No appointment history for this patient</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table hover>
                                                        <thead className="bg-light">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Time</th>
                                                            <th>Doctor</th>
                                                            <th>Diagnosis</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {patientAppointments.map((appointment) => (
                                                            <tr key={appointment.id}>
                                                                <td>{formatDate(appointment.date)}</td>
                                                                <td>{appointment.time}</td>
                                                                <td>{appointment.doctorName}</td>
                                                                <td>{appointment.diagnosis}</td>
                                                                <td>{getStatusBadge(appointment.status)}</td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-info"
                                                                        size="sm"
                                                                        onClick={() => handleViewMedicalHistory(appointment)}
                                                                    >
                                                                        View History
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Medical History Tab */}
                                    {activeTab === 'medical-history' && (
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Card className="border-0 bg-light h-100">
                                                    <Card.Body>
                                                        <h6 className="fw-bold mb-3">Chronic Conditions</h6>
                                                        {selectedPatient.medicalHistory.chronicConditions.map((condition, idx) => (
                                                            <div key={idx} className="mb-2">
                                                                <Activity size={16} className="text-danger me-2" />
                                                                {condition}
                                                            </div>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Card className="border-0 bg-light h-100">
                                                    <Card.Body>
                                                        <h6 className="fw-bold mb-3">Allergies</h6>
                                                        {selectedPatient.medicalHistory.allergies.map((allergy, idx) => (
                                                            <div key={idx} className="mb-2">
                                                                <AlertCircle size={16} className="text-warning me-2" />
                                                                {allergy}
                                                            </div>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Card className="border-0 bg-light h-100">
                                                    <Card.Body>
                                                        <h6 className="fw-bold mb-3">Current Medications</h6>
                                                        {selectedPatient.medicalHistory.medications.map((med, idx) => (
                                                            <div key={idx} className="mb-2">
                                                                <Pill size={16} className="text-primary me-2" />
                                                                {med}
                                                            </div>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Card className="border-0 bg-light h-100">
                                                    <Card.Body>
                                                        <h6 className="fw-bold mb-3">Surgical History</h6>
                                                        {selectedPatient.medicalHistory.surgeries.map((surgery, idx) => (
                                                            <div key={idx} className="mb-2">
                                                                <Stethoscope size={16} className="text-info me-2" />
                                                                {surgery}
                                                            </div>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={12} className="mb-3">
                                                <Card className="border-0 bg-light">
                                                    <Card.Body>
                                                        <h6 className="fw-bold mb-3">Family History</h6>
                                                        {selectedPatient.medicalHistory.familyHistory.map((history, idx) => (
                                                            <div key={idx} className="mb-2">
                                                                <Heart size={16} className="text-danger me-2" />
                                                                {history}
                                                            </div>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={12}>
                                                <Card className="border-0 bg-light">
                                                    <Card.Body>
                                                        <h6 className="fw-bold mb-3">Lifestyle</h6>
                                                        <Row>
                                                            <Col md={3}>
                                                                <div className="mb-2">
                                                                    <strong>Smoking:</strong> {selectedPatient.medicalHistory.lifestyle.smoking}
                                                                </div>
                                                            </Col>
                                                            <Col md={3}>
                                                                <div className="mb-2">
                                                                    <strong>Alcohol:</strong> {selectedPatient.medicalHistory.lifestyle.alcohol}
                                                                </div>
                                                            </Col>
                                                            <Col md={3}>
                                                                <div className="mb-2">
                                                                    <strong>Exercise:</strong> {selectedPatient.medicalHistory.lifestyle.exercise}
                                                                </div>
                                                            </Col>
                                                            <Col md={3}>
                                                                <div className="mb-2">
                                                                    <strong>Diet:</strong> {selectedPatient.medicalHistory.lifestyle.diet}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    {/* Vitals Tab */}
                                    {activeTab === 'vitals' && (
                                        <Row>
                                            <Col md={4} className="mb-3">
                                                <Card className="border-0 bg-light text-center">
                                                    <Card.Body>
                                                        <Heart size={32} className="text-danger mb-2" />
                                                        <h3>120/80</h3>
                                                        <p className="text-muted mb-0">Blood Pressure</p>
                                                        <small>Last check: Mar 15, 2024</small>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4} className="mb-3">
                                                <Card className="border-0 bg-light text-center">
                                                    <Card.Body>
                                                        <Thermometer size={32} className="text-warning mb-2" />
                                                        <h3>98.6°F</h3>
                                                        <p className="text-muted mb-0">Temperature</p>
                                                        <small>Last check: Mar 15, 2024</small>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4} className="mb-3">
                                                <Card className="border-0 bg-light text-center">
                                                    <Card.Body>
                                                        <Activity size={32} className="text-success mb-2" />
                                                        <h3>72 bpm</h3>
                                                        <p className="text-muted mb-0">Heart Rate</p>
                                                        <small>Last check: Mar 15, 2024</small>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4} className="mb-3">
                                                <Card className="border-0 bg-light text-center">
                                                    <Card.Body>
                                                        <Ruler size={32} className="text-info mb-2" />
                                                        <h3>5'9" (175 cm)</h3>
                                                        <p className="text-muted mb-0">Height</p>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4} className="mb-3">
                                                <Card className="border-0 bg-light text-center">
                                                    <Card.Body>
                                                        <Weight size={32} className="text-primary mb-2" />
                                                        <h3>165 lbs (75 kg)</h3>
                                                        <p className="text-muted mb-0">Weight</p>
                                                        <small>BMI: 24.5</small>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4} className="mb-3">
                                                <Card className="border-0 bg-light text-center">
                                                    <Card.Body>
                                                        <Droplet size={32} className="text-danger mb-2" />
                                                        <h3>95 mg/dL</h3>
                                                        <p className="text-muted mb-0">Blood Sugar</p>
                                                        <small>Fasting</small>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        ) : (
                            <Card className="shadow-sm border-0">
                                <Card.Body className="text-center py-5">
                                    <User size={64} className="text-muted mb-3" />
                                    <h5>Select a Patient</h5>
                                    <p className="text-muted">
                                        Choose a patient from the list to view their reports and medical history
                                    </p>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            )}

            {/* Report View Modal */}
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {selectedReport?.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport && (
                        <>
                            <div className="mb-3">
                                <Row>
                                    <Col md={6}>
                                        <small className="text-muted">Report Type</small>
                                        <div>{selectedReport.type}</div>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Date</small>
                                        <div>{formatDate(selectedReport.date)}</div>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Doctor</small>
                                        <div>{selectedReport.doctor}</div>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">File Size</small>
                                        <div>{selectedReport.size}</div>
                                    </Col>
                                </Row>
                            </div>
                            <hr />
                            <div className="mb-3">
                                <h6>Description</h6>
                                <p>{selectedReport.description}</p>
                            </div>
                            <div className="mb-3">
                                <h6>Findings</h6>
                                <p>{selectedReport.findings}</p>
                            </div>
                            <div className="mb-3">
                                <h6>Recommendations</h6>
                                <p>{selectedReport.recommendations}</p>
                            </div>
                            {reportPreview && (
                                <div className="text-center mt-3">
                                    <Image src={reportPreview} fluid />
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReportModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDownloadReport(selectedReport)}>
                        <Download size={16} className="me-2" />
                        Download
                    </Button>
                    <Button variant="info" onClick={handlePrintReport}>
                        <Printer size={16} className="me-2" />
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Medical History Modal */}
            <Modal show={showMedicalHistoryModal} onHide={() => setShowMedicalHistoryModal(false)} size="lg">
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>
                        Medical History - {selectedAppointment?.patientName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && selectedPatient && (
                        <>
                            <Alert variant="info">
                                <strong>Appointment Details:</strong> {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                                <br />
                                <strong>Diagnosis:</strong> {selectedAppointment.diagnosis}
                                <br />
                                <strong>Prescription:</strong> {selectedAppointment.prescription}
                                <br />
                                <strong>Doctor's Notes:</strong> {selectedAppointment.notes}
                            </Alert>

                            <h6 className="mt-3 mb-3">Complete Medical History</h6>
                            <Row>
                                <Col md={6}>
                                    <Card className="border-0 bg-light mb-3">
                                        <Card.Body>
                                            <h6 className="fw-bold">Chronic Conditions</h6>
                                            {selectedPatient.medicalHistory.chronicConditions.map((condition, idx) => (
                                                <div key={idx}>• {condition}</div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 bg-light mb-3">
                                        <Card.Body>
                                            <h6 className="fw-bold">Allergies</h6>
                                            {selectedPatient.medicalHistory.allergies.map((allergy, idx) => (
                                                <div key={idx}>• {allergy}</div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 bg-light mb-3">
                                        <Card.Body>
                                            <h6 className="fw-bold">Current Medications</h6>
                                            {selectedPatient.medicalHistory.medications.map((med, idx) => (
                                                <div key={idx}>• {med}</div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 bg-light mb-3">
                                        <Card.Body>
                                            <h6 className="fw-bold">Past Surgeries</h6>
                                            {selectedPatient.medicalHistory.surgeries.map((surgery, idx) => (
                                                <div key={idx}>• {surgery}</div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Card className="border-0 bg-light">
                                <Card.Body>
                                    <h6 className="fw-bold">Recent Reports from this Appointment</h6>
                                    {patientReports.filter(r => r.appointmentId === selectedAppointment.id).map((report, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                {getFileIcon(report.fileType)}
                                                <span className="ms-2">{report.title}</span>
                                            </div>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => {
                                                    setShowMedicalHistoryModal(false);
                                                    handleViewReport(report);
                                                }}
                                            >
                                                View Report
                                            </Button>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMedicalHistoryModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PatientReport;