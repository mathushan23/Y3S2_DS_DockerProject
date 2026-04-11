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
    ChevronRight, XCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const PatientReport = () => {
    const { user, token } = useAuth();
    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
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
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [patientPrescriptions, setPatientPrescriptions] = useState([]);
    const [patientReports, setPatientReports] = useState([]);

    // Fetch all patients from backend
    const fetchPatients = async () => {
        try {
            // Fetch from patient service
            const response = await fetch(`${API_BASE_URL}/api/patients`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Patients loaded:", data);

                // Transform patient data to expected format
                const transformedPatients = data.map(patient => ({
                    id: patient.id,
                    name: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || "Unknown",
                    email: patient.email,
                    phone: patient.phone || patient.phoneNumber || "N/A",
                    age: patient.age || calculateAge(patient.dateOfBirth),
                    gender: patient.gender || "Not specified",
                    bloodType: patient.bloodType || "Unknown",
                    lastVisit: patient.lastVisit || patient.updatedAt?.split('T')[0] || "N/A",
                    medicalHistory: {
                        chronicConditions: patient.chronicConditions || [],
                        allergies: patient.allergies || [],
                        surgeries: patient.surgeries || [],
                        medications: patient.medications || [],
                        familyHistory: patient.familyHistory || [],
                        immunizations: patient.immunizations || [],
                        lifestyle: patient.lifestyle || {
                            smoking: "Non-smoker",
                            alcohol: "Never",
                            exercise: "Moderate",
                            diet: "Balanced"
                        }
                    },
                    reports: patient.reports || []
                }));

                setPatients(transformedPatients);
                setFilteredPatients(transformedPatients);
            } else {
                console.error("Failed to fetch patients");
                showNotification("Failed to load patients from server", "danger");
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            showNotification("Error connecting to server", "danger");
        }
    };

    // Fetch appointments for a specific patient
    const fetchPatientAppointments = async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/appointments?patientId=${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Patient appointments:", data);

                const transformedAppointments = data.map(app => ({
                    id: app.id,
                    patientId: app.patientId,
                    patientName: app.patientName,
                    doctorId: app.doctorId,
                    doctorName: app.doctorName,
                    date: app.appointmentDateTime?.split('T')[0] || "N/A",
                    time: formatTime(app.appointmentDateTime),
                    status: app.status,
                    diagnosis: app.diagnosis || "Not specified",
                    prescription: app.prescription || "None",
                    notes: app.notes || "No notes"
                }));

                setPatientAppointments(transformedAppointments);
                return transformedAppointments;
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            return [];
        }
    };

    // Fetch prescriptions for a specific patient
    const fetchPatientPrescriptions = async (patientId, patientEmail) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctors/prescriptions?email=${patientEmail}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Patient prescriptions:", data);

                const transformedPrescriptions = data.map(prescription => ({
                    id: prescription.id,
                    patientId: prescription.patientId,
                    patientName: prescription.patientName,
                    doctorName: prescription.doctorName,
                    doctorId: prescription.doctorId,
                    diagnosis: prescription.diagnosis,
                    notes: prescription.notes,
                    status: prescription.status,
                    createdAt: prescription.createdAt?.split('T')[0] || "N/A",
                    validUntil: prescription.validUntil,
                    refills: prescription.refills,
                    medicines: prescription.medicines || []
                }));

                setPatientPrescriptions(transformedPrescriptions);
                return transformedPrescriptions;
            }
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
            return [];
        }
    };

    // Helper function to calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return "N/A";
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Helper function to format time
    const formatTime = (dateTimeStr) => {
        if (!dateTimeStr) return "N/A";
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Load all data on mount
    useEffect(() => {
        if (token) {
            fetchPatients();
        }
    }, [token]);

    // Filter patients based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = patients.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.phone.includes(searchTerm)
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients(patients);
        }
    }, [searchTerm, patients]);

    // Handle patient selection
    const handleSelectPatient = async (patient) => {
        setSelectedPatient(patient);
        setLoading(true);

        try {
            // Fetch appointments for this patient
            const appointments = await fetchPatientAppointments(patient.id);

            // Fetch prescriptions for this patient
            const prescriptions = await fetchPatientPrescriptions(patient.id, patient.email);

            // Transform prescriptions into reports format
            const reports = prescriptions.map(prescription => ({
                id: prescription.id,
                title: `Prescription - ${prescription.diagnosis}`,
                type: "Prescription",
                date: prescription.createdAt,
                category: "Medication",
                fileType: "pdf",
                size: "N/A",
                doctor: prescription.doctorName,
                appointmentId: null,
                description: `Prescription for ${prescription.diagnosis}`,
                findings: prescription.diagnosis,
                recommendations: prescription.notes || "Follow prescription instructions",
                medicines: prescription.medicines
            }));

            setPatientReports(reports);
            setActiveTab('reports');
        } catch (error) {
            console.error("Error loading patient data:", error);
            showNotification("Error loading patient details", "danger");
        } finally {
            setLoading(false);
        }
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setShowReportModal(true);
    };

    const handleViewMedicalHistory = (appointment) => {
        setSelectedAppointment(appointment);
        setShowMedicalHistoryModal(true);
    };

    const handleDownloadReport = (report) => {
        showNotification(`Preparing to download ${report.title}...`, "info");
        setTimeout(() => {
            showNotification(`${report.title} would be downloaded here`, "success");
        }, 1000);
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
        return <FileText size={20} className="text-primary" />;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
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
            case 'CONFIRMED':
                return <Badge bg="primary">Confirmed</Badge>;
            case 'PENDING':
                return <Badge bg="warning">Pending</Badge>;
            case 'CANCELLED':
                return <Badge bg="danger">Cancelled</Badge>;
            case 'ACTIVE':
                return <Badge bg="success">Active</Badge>;
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
                                <div className="d-flex gap-2">
                                    <Button variant="outline-secondary" onClick={fetchPatients}>
                                        <RefreshCw size={18} className="me-2" />
                                        Refresh
                                    </Button>
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
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {patients.length === 0 && !loading ? (
                <div className="text-center py-5">
                    <Alert variant="info">
                        <AlertCircle size={48} className="mb-3" />
                        <h5>No Patients Found</h5>
                        <p>No patient data available. Please ensure the patient service is running with seeded data.</p>
                    </Alert>
                </div>
            ) : (
                <Row>
                    {/* Patients List */}
                    <Col lg={4} className="mb-4">
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-white border-0 pt-4">
                                <h5 className="mb-0">Patients ({filteredPatients.length})</h5>
                            </Card.Header>
                            <Card.Body className="p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                <ListGroup variant="flush">
                                    {filteredPatients.map((patient) => (
                                        <ListGroup.Item
                                            key={patient.id}
                                            action
                                            active={selectedPatient?.id === patient.id}
                                            onClick={() => handleSelectPatient(patient)}
                                            className="p-3"
                                            style={{ cursor: 'pointer' }}
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
                                        <Tab eventKey="prescriptions" title={`Prescriptions (${patientPrescriptions.length})`} />
                                        <Tab eventKey="medical-history" title="Medical History" />
                                    </Tabs>

                                    {/* Reports Tab */}
                                    {activeTab === 'reports' && (
                                        <>
                                            {loading ? (
                                                <div className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                    <p className="mt-3">Loading reports...</p>
                                                </div>
                                            ) : patientReports.length === 0 ? (
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
                                            {loading ? (
                                                <div className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                    <p className="mt-3">Loading appointments...</p>
                                                </div>
                                            ) : patientAppointments.length === 0 ? (
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
                                                                        View Details
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

                                    {/* Prescriptions Tab */}
                                    {activeTab === 'prescriptions' && (
                                        <>
                                            {loading ? (
                                                <div className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                    <p className="mt-3">Loading prescriptions...</p>
                                                </div>
                                            ) : patientPrescriptions.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <Pill size={48} className="text-muted mb-3" />
                                                    <h6>No Prescriptions Found</h6>
                                                    <p className="text-muted">No prescriptions for this patient</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table hover>
                                                        <thead className="bg-light">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Diagnosis</th>
                                                            <th>Doctor</th>
                                                            <th>Status</th>
                                                            <th>Refills</th>
                                                            <th>Valid Until</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {patientPrescriptions.map((prescription) => (
                                                            <tr key={prescription.id}>
                                                                <td>{formatDate(prescription.createdAt)}</td>
                                                                <td>{prescription.diagnosis}</td>
                                                                <td>{prescription.doctorName}</td>
                                                                <td>{getStatusBadge(prescription.status)}</td>
                                                                <td>{prescription.refills}</td>
                                                                <td>{prescription.validUntil || "N/A"}</td>
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
                                                        {selectedPatient.medicalHistory.chronicConditions.length > 0 ? (
                                                            selectedPatient.medicalHistory.chronicConditions.map((condition, idx) => (
                                                                <div key={idx} className="mb-2">
                                                                    <Activity size={16} className="text-danger me-2" />
                                                                    {condition}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-muted">No chronic conditions recorded</p>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Card className="border-0 bg-light h-100">
                                                    <Card.Body>
                                                        <h6 className="fw-bold mb-3">Allergies</h6>
                                                        {selectedPatient.medicalHistory.allergies.length > 0 ? (
                                                            selectedPatient.medicalHistory.allergies.map((allergy, idx) => (
                                                                <div key={idx} className="mb-2">
                                                                    <AlertCircle size={16} className="text-warning me-2" />
                                                                    {allergy}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-muted">No allergies recorded</p>
                                                        )}
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
                                                                    <strong>Smoking:</strong> {selectedPatient.medicalHistory.lifestyle?.smoking || "Not specified"}
                                                                </div>
                                                            </Col>
                                                            <Col md={3}>
                                                                <div className="mb-2">
                                                                    <strong>Alcohol:</strong> {selectedPatient.medicalHistory.lifestyle?.alcohol || "Not specified"}
                                                                </div>
                                                            </Col>
                                                            <Col md={3}>
                                                                <div className="mb-2">
                                                                    <strong>Exercise:</strong> {selectedPatient.medicalHistory.lifestyle?.exercise || "Not specified"}
                                                                </div>
                                                            </Col>
                                                            <Col md={3}>
                                                                <div className="mb-2">
                                                                    <strong>Diet:</strong> {selectedPatient.medicalHistory.lifestyle?.diet || "Not specified"}
                                                                </div>
                                                            </Col>
                                                        </Row>
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
                    <Modal.Title>{selectedReport?.title}</Modal.Title>
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
                            {selectedReport.medicines && selectedReport.medicines.length > 0 && (
                                <>
                                    <h6>Medicines Prescribed</h6>
                                    <Table size="sm">
                                        <thead>
                                        <tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr>
                                        </thead>
                                        <tbody>
                                        {selectedReport.medicines.map((med, idx) => (
                                            <tr key={idx}>
                                                <td>{med.name}</td>
                                                <td>{med.dosage}</td>
                                                <td>{med.frequency}</td>
                                                <td>{med.duration}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReportModal(false)}>Close</Button>
                    <Button variant="primary" onClick={() => handleDownloadReport(selectedReport)}>
                        <Download size={16} className="me-2" /> Download
                    </Button>
                    <Button variant="info" onClick={handlePrintReport}>
                        <Printer size={16} className="me-2" /> Print
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Medical History Modal */}
            <Modal show={showMedicalHistoryModal} onHide={() => setShowMedicalHistoryModal(false)} size="lg">
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>Appointment Details - {selectedAppointment?.patientName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && selectedPatient && (
                        <>
                            <Alert variant="info">
                                <strong>Appointment Details:</strong> {formatDate(selectedAppointment.date)} at {selectedAppointment.time}<br />
                                <strong>Diagnosis:</strong> {selectedAppointment.diagnosis}<br />
                                <strong>Doctor's Notes:</strong> {selectedAppointment.notes}
                            </Alert>
                            <h6 className="mt-3 mb-3">Medical History</h6>
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
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMedicalHistoryModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PatientReport;
