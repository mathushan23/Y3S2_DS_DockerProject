import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, Button, Modal, Form, Table,
    Badge, Alert, Tabs, Tab, InputGroup, FloatingLabel,
    Dropdown, Pagination, Spinner, Toast, ToastContainer
} from 'react-bootstrap';
import {
    Plus, Edit, Eye, Trash2, Download, Printer,
    Search, Filter, Calendar, User, FileText,
    Pill, AlertCircle, CheckCircle, Clock, Save,
    X, ChevronLeft, ChevronRight, FileSignature
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Prescriptions = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';
    const isPatient = user?.role === 'PATIENT';

    // State for prescriptions
    const [prescriptions, setPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    // Mock patients data (in real app, fetch from API)
    const [patients, setPatients] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", age: 35, gender: "Male" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", age: 28, gender: "Female" },
        { id: 3, name: "Robert Johnson", email: "robert@example.com", age: 42, gender: "Male" },
        { id: 4, name: "Emily Davis", email: "emily@example.com", age: 31, gender: "Female" },
        { id: 5, name: "Michael Brown", email: "michael@example.com", age: 55, gender: "Male" },
    ]);

    // Form data for prescription
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        diagnosis: "",
        notes: "",
        status: "ACTIVE",
        medicines: [],
        validUntil: "",
    });

    // Medicine form
    const [currentMedicine, setCurrentMedicine] = useState({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
    });

    // Load prescriptions from localStorage on mount
    useEffect(() => {
        loadPrescriptions();
    }, [user]);

    useEffect(() => {
        filterPrescriptions();
    }, [searchTerm, prescriptions, activeTab]);

    const loadPrescriptions = () => {
        setLoading(true);
        // Load from localStorage
        const storedPrescriptions = localStorage.getItem('prescriptions');
        let allPrescriptions = storedPrescriptions ? JSON.parse(storedPrescriptions) : getMockPrescriptions();

        // Filter based on user role
        if (isPatient && user) {
            allPrescriptions = allPrescriptions.filter(p => p.patientId === user.id || p.patientEmail === user.email);
        }

        setPrescriptions(allPrescriptions);
        setFilteredPrescriptions(allPrescriptions);
        setLoading(false);
    };

    const getMockPrescriptions = () => {
        const mockPrescriptions = [
            {
                id: 1,
                patientId: 1,
                patientName: "John Doe",
                patientEmail: "john@example.com",
                doctorName: "Dr. Sarah Wilson",
                doctorId: 1,
                diagnosis: "Acute Upper Respiratory Infection",
                notes: "Patient presented with cough, fever, and sore throat. Prescribed antibiotics and advised rest.",
                medicines: [
                    { id: 1, name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days", instructions: "Take with food" },
                    { id: 2, name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "5 days", instructions: "Take for fever or pain" }
                ],
                status: "ACTIVE",
                createdAt: "2024-03-15T10:30:00",
                validUntil: "2024-04-15",
                refills: 0,
            },
            {
                id: 2,
                patientId: 2,
                patientName: "Jane Smith",
                patientEmail: "jane@example.com",
                doctorName: "Dr. Sarah Wilson",
                doctorId: 1,
                diagnosis: "Hypertension",
                notes: "Blood pressure consistently high. Started on ACE inhibitor.",
                medicines: [
                    { id: 3, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", instructions: "Take in the morning" }
                ],
                status: "ACTIVE",
                createdAt: "2024-03-10T14:20:00",
                validUntil: "2024-04-10",
                refills: 2,
            },
            {
                id: 3,
                patientId: 3,
                patientName: "Robert Johnson",
                patientEmail: "robert@example.com",
                doctorName: "Dr. Sarah Wilson",
                doctorId: 1,
                diagnosis: "Type 2 Diabetes",
                notes: "Follow-up after blood work. A1C elevated.",
                medicines: [
                    { id: 4, name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "90 days", instructions: "Take with meals" }
                ],
                status: "EXPIRED",
                createdAt: "2024-01-05T09:15:00",
                validUntil: "2024-02-05",
                refills: 0,
            }
        ];
        return mockPrescriptions;
    };

    const savePrescriptionsToLocal = (updatedPrescriptions) => {
        localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
        setPrescriptions(updatedPrescriptions);
    };

    const filterPrescriptions = () => {
        let filtered = [...prescriptions];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.medicines.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Status filter
        if (activeTab !== 'all') {
            filtered = filtered.filter(p => p.status === activeTab.toUpperCase());
        }

        setFilteredPrescriptions(filtered);
        setCurrentPage(1);
    };

    const handleOpenModal = (prescription = null) => {
        if (prescription) {
            setEditingId(prescription.id);
            setFormData({
                patientId: prescription.patientId,
                patientName: prescription.patientName,
                diagnosis: prescription.diagnosis,
                notes: prescription.notes,
                status: prescription.status,
                medicines: [...prescription.medicines],
                validUntil: prescription.validUntil,
            });
        } else {
            setEditingId(null);
            setFormData({
                patientId: "",
                patientName: "",
                diagnosis: "",
                notes: "",
                status: "ACTIVE",
                medicines: [],
                validUntil: "",
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setCurrentMedicine({
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
        });
    };

    const handlePatientChange = (e) => {
        const patientId = parseInt(e.target.value);
        const patient = patients.find(p => p.id === patientId);
        setFormData({
            ...formData,
            patientId: patientId,
            patientName: patient ? patient.name : "",
        });
    };

    const handleAddMedicine = () => {
        if (!currentMedicine.name) {
            showNotification("Please enter medicine name", "warning");
            return;
        }

        setFormData({
            ...formData,
            medicines: [...formData.medicines, { ...currentMedicine, id: Date.now() }]
        });

        setCurrentMedicine({
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
        });
    };

    const handleRemoveMedicine = (medicineId) => {
        setFormData({
            ...formData,
            medicines: formData.medicines.filter(m => m.id !== medicineId)
        });
    };

    const handleSavePrescription = () => {
        if (!formData.patientId || !formData.diagnosis || formData.medicines.length === 0) {
            showNotification("Please fill all required fields and add at least one medicine", "danger");
            return;
        }

        const prescriptionData = {
            id: editingId || Date.now(),
            patientId: formData.patientId,
            patientName: formData.patientName,
            patientEmail: patients.find(p => p.id === formData.patientId)?.email,
            doctorName: user?.name || "Dr. Sarah Wilson",
            doctorId: user?.id || 1,
            diagnosis: formData.diagnosis,
            notes: formData.notes,
            medicines: formData.medicines,
            status: formData.status,
            createdAt: editingId ?
                prescriptions.find(p => p.id === editingId)?.createdAt :
                new Date().toISOString(),
            validUntil: formData.validUntil || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            refills: editingId ?
                prescriptions.find(p => p.id === editingId)?.refills || 0 :
                0,
        };

        let updatedPrescriptions;
        if (editingId) {
            updatedPrescriptions = prescriptions.map(p =>
                p.id === editingId ? prescriptionData : p
            );
            showNotification("Prescription updated successfully!", "success");
        } else {
            updatedPrescriptions = [prescriptionData, ...prescriptions];
            showNotification("Prescription created successfully!", "success");
        }

        savePrescriptionsToLocal(updatedPrescriptions);
        handleCloseModal();
    };

    const handleDeletePrescription = (id) => {
        if (window.confirm("Are you sure you want to delete this prescription?")) {
            const updatedPrescriptions = prescriptions.filter(p => p.id !== id);
            savePrescriptionsToLocal(updatedPrescriptions);
            showNotification("Prescription deleted successfully!", "success");
        }
    };

    const handleViewPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setShowViewModal(true);
    };

    const handleDownloadPDF = (prescription) => {
        // In a real app, you would generate a PDF here
        showNotification("PDF download started...", "info");
        // Simulate PDF generation
        setTimeout(() => {
            showNotification("Prescription downloaded successfully!", "success");
        }, 1500);
    };

    const handlePrint = (prescription) => {
        window.print();
    };

    const showNotification = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'ACTIVE':
                return <Badge bg="success" className="px-3 py-2">Active</Badge>;
            case 'EXPIRED':
                return <Badge bg="secondary" className="px-3 py-2">Expired</Badge>;
            case 'COMPLETED':
                return <Badge bg="info" className="px-3 py-2">Completed</Badge>;
            default:
                return <Badge bg="warning" className="px-3 py-2">{status}</Badge>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPrescriptions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastVariant === 'success' && <CheckCircle size={18} />}
                            {toastVariant === 'danger' && <AlertCircle size={18} />}
                            {toastVariant === 'warning' && <AlertCircle size={18} />}
                            {toastVariant === 'info' && <FileSignature size={18} />}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div>
                                    <h2 className="mb-1 fw-bold">Prescription Management</h2>
                                    <p className="text-muted mb-0">
                                        {isDoctor ? 'Create and manage patient prescriptions' : 'View your prescriptions and medication history'}
                                    </p>
                                </div>
                                {isDoctor && (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleOpenModal()}
                                        className="d-flex align-items-center gap-2 px-4 py-2"
                                    >
                                        <Plus size={20} />
                                        New Prescription
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button
                                        variant={activeTab === 'all' ? 'primary' : 'light'}
                                        onClick={() => setActiveTab('all')}
                                        className="px-4"
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={activeTab === 'active' ? 'primary' : 'light'}
                                        onClick={() => setActiveTab('active')}
                                        className="px-4"
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        variant={activeTab === 'expired' ? 'primary' : 'light'}
                                        onClick={() => setActiveTab('expired')}
                                        className="px-4"
                                    >
                                        Expired
                                    </Button>
                                    <Button
                                        variant={activeTab === 'completed' ? 'primary' : 'light'}
                                        onClick={() => setActiveTab('completed')}
                                        className="px-4"
                                    >
                                        Completed
                                    </Button>
                                </div>

                                <InputGroup style={{ maxWidth: '300px' }}>
                                    <InputGroup.Text>
                                        <Search size={18} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search prescriptions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3 text-muted">Loading prescriptions...</p>
                                </div>
                            ) : currentItems.length === 0 ? (
                                <div className="text-center py-5">
                                    <FileText size={48} className="text-muted mb-3" />
                                    <h5>No Prescriptions Found</h5>
                                    <p className="text-muted">
                                        {isDoctor ? 'Create your first prescription by clicking the "New Prescription" button' : 'No prescriptions available'}
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Patient</th>
                                            <th className="px-4 py-3">Diagnosis</th>
                                            <th className="px-4 py-3">Medicines</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentItems.map((prescription) => (
                                            <tr key={prescription.id}>
                                                <td className="px-4 py-3 align-middle">
                                                    <code>#RX{prescription.id}</code>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="fw-semibold">{prescription.patientName}</div>
                                                    <small className="text-muted">{prescription.doctorName}</small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">{prescription.diagnosis}</td>
                                                <td className="px-4 py-3 align-middle">
                                                    <Badge bg="info" pill>
                                                        {prescription.medicines.length} Medicine(s)
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 align-middle">{formatDate(prescription.createdAt)}</td>
                                                <td className="px-4 py-3 align-middle">{getStatusBadge(prescription.status)}</td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleViewPrescription(prescription)}
                                                            className="d-flex align-items-center gap-1"
                                                        >
                                                            <Eye size={16} />
                                                            View
                                                        </Button>
                                                        {isDoctor && (
                                                            <>
                                                                <Button
                                                                    variant="outline-secondary"
                                                                    size="sm"
                                                                    onClick={() => handleOpenModal(prescription)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <Edit size={16} />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeletePrescription(prescription.id)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <Trash2 size={16} />
                                                                    Delete
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={() => handleDownloadPDF(prescription)}
                                                            className="d-flex align-items-center gap-1"
                                                        >
                                                            <Download size={16} />
                                                            PDF
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}

                            {filteredPrescriptions.length > itemsPerPage && (
                                <div className="d-flex justify-content-center py-3">
                                    <Pagination>
                                        <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

                                        {[...Array(totalPages)].map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={index + 1 === currentPage}
                                                onClick={() => paginate(index + 1)}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}

                                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add/Edit Prescription Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {editingId ? 'Edit Prescription' : 'Create New Prescription'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Select Patient *">
                                    <Form.Select
                                        value={formData.patientId}
                                        onChange={handlePatientChange}
                                        className="mb-2"
                                        required
                                    >
                                        <option value="">Select a patient</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name} - {patient.age} yrs, {patient.gender}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Status">
                                    <Form.Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="EXPIRED">Expired</option>
                                        <option value="COMPLETED">Completed</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Diagnosis *">
                                    <Form.Control
                                        type="text"
                                        value={formData.diagnosis}
                                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                                        placeholder="Enter diagnosis"
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Doctor's Notes">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        placeholder="Add any additional notes or instructions"
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Valid Until">
                                    <Form.Control
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0 fw-bold">Medications</h6>
                                <Badge bg="primary" pill>{formData.medicines.length} Medicine(s)</Badge>
                            </div>

                            {/* Medicine List */}
                            {formData.medicines.length > 0 && (
                                <div className="mb-3">
                                    {formData.medicines.map((medicine, idx) => (
                                        <Card key={medicine.id} className="mb-2 bg-light">
                                            <Card.Body className="p-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <div className="fw-bold">{medicine.name}</div>
                                                        <div className="small text-muted">
                                                            {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                                        </div>
                                                        {medicine.instructions && (
                                                            <div className="small mt-1">
                                                                <span className="text-muted">Instructions:</span> {medicine.instructions}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="text-danger"
                                                        onClick={() => handleRemoveMedicine(medicine.id)}
                                                    >
                                                        <X size={18} />
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Add Medicine Form */}
                            <Card className="border-primary">
                                <Card.Header className="bg-primary bg-opacity-10">
                                    <strong>Add Medicine</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="g-2">
                                        <Col md={4}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Medicine name *"
                                                value={currentMedicine.name}
                                                onChange={(e) => setCurrentMedicine({...currentMedicine, name: e.target.value})}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Dosage"
                                                value={currentMedicine.dosage}
                                                onChange={(e) => setCurrentMedicine({...currentMedicine, dosage: e.target.value})}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Frequency"
                                                value={currentMedicine.frequency}
                                                onChange={(e) => setCurrentMedicine({...currentMedicine, frequency: e.target.value})}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Duration"
                                                value={currentMedicine.duration}
                                                onChange={(e) => setCurrentMedicine({...currentMedicine, duration: e.target.value})}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Button
                                                variant="primary"
                                                onClick={handleAddMedicine}
                                                className="w-100"
                                            >
                                                <Plus size={18} /> Add
                                            </Button>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Special instructions (optional)"
                                                value={currentMedicine.instructions}
                                                onChange={(e) => setCurrentMedicine({...currentMedicine, instructions: e.target.value})}
                                            />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSavePrescription}>
                        <Save size={18} className="me-2" />
                        {editingId ? 'Update Prescription' : 'Save Prescription'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Prescription Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>
                        <FileText size={24} className="me-2" />
                        Prescription Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedPrescription && (
                        <div>
                            <div className="text-center mb-4">
                                <h4>Medical Prescription</h4>
                                <p className="text-muted">#RX{selectedPrescription.id}</p>
                                <hr />
                            </div>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <div className="border rounded p-3">
                                        <h6 className="text-muted mb-2">Patient Information</h6>
                                        <p className="mb-1"><strong>Name:</strong> {selectedPrescription.patientName}</p>
                                        <p className="mb-1"><strong>Email:</strong> {selectedPrescription.patientEmail}</p>
                                        <p className="mb-0"><strong>Prescribed By:</strong> {selectedPrescription.doctorName}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="border rounded p-3">
                                        <h6 className="text-muted mb-2">Prescription Details</h6>
                                        <p className="mb-1"><strong>Date:</strong> {formatDate(selectedPrescription.createdAt)}</p>
                                        <p className="mb-1"><strong>Valid Until:</strong> {formatDate(selectedPrescription.validUntil)}</p>
                                        <p className="mb-0"><strong>Status:</strong> {getStatusBadge(selectedPrescription.status)}</p>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">Diagnosis</h6>
                                <div className="border rounded p-3 bg-light">
                                    {selectedPrescription.diagnosis}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">Medications</h6>
                                <Table striped bordered hover>
                                    <thead className="bg-light">
                                    <tr>
                                        <th>Medicine</th>
                                        <th>Dosage</th>
                                        <th>Frequency</th>
                                        <th>Duration</th>
                                        <th>Instructions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedPrescription.medicines.map((medicine, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold">{medicine.name}</td>
                                            <td>{medicine.dosage}</td>
                                            <td>{medicine.frequency}</td>
                                            <td>{medicine.duration}</td>
                                            <td>{medicine.instructions || '-'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>

                            {selectedPrescription.notes && (
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Doctor's Notes</h6>
                                    <div className="border rounded p-3 bg-light">
                                        {selectedPrescription.notes}
                                    </div>
                                </div>
                            )}

                            <div className="text-muted small mt-4 pt-3 border-top text-center">
                                This is a digitally generated prescription. Please carry this document when visiting the pharmacy.
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handlePrint(selectedPrescription)}>
                        <Printer size={18} className="me-2" />
                        Print
                    </Button>
                    <Button variant="success" onClick={() => handleDownloadPDF(selectedPrescription)}>
                        <Download size={18} className="me-2" />
                        Download PDF
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Prescriptions;