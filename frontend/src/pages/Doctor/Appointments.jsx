import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, Button, Modal, Form, Table, Badge,
    Alert, FloatingLabel, InputGroup, Spinner, Toast, ToastContainer,
    Tabs, Tab, Pagination, Dropdown, ButtonGroup
} from 'react-bootstrap';
import {
    Calendar, Clock, User, CheckCircle, XCircle, Clock as ClockIcon,
    Eye, Filter, Search, Download, Printer, ChevronLeft, ChevronRight,
    Calendar as CalendarIcon, Users, Activity, CheckSquare, XSquare,
    AlertCircle, FileText, Phone, Mail, MapPin, RefreshCw
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Appointments = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';
    const isPatient = user?.role === 'PATIENT';

    // State for appointments
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [activeTab, setActiveTab] = useState('requests');

    // Form data for new appointment (for patients)
    const [formData, setFormData] = useState({
        patientName: "",
        patientEmail: "",
        doctorId: "",
        doctorName: "",
        date: "",
        time: "",
        reason: "",
        symptoms: "",
        notes: "",
    });

    // Mock doctors data
    const [doctors, setDoctors] = useState([
        { id: 1, name: "Dr. Sarah Wilson", specialty: "Cardiologist", available: true },
        { id: 2, name: "Dr. Michael Chen", specialty: "Neurologist", available: true },
        { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrician", available: true },
        { id: 4, name: "Dr. James Peterson", specialty: "Dermatologist", available: false },
    ]);

    // Load appointments from localStorage on mount
    useEffect(() => {
        loadAppointments();
    }, [user]);

    useEffect(() => {
        filterAppointments();
    }, [searchTerm, statusFilter, appointments, activeTab]);

    const loadAppointments = () => {
        setLoading(true);
        // Load from localStorage
        const storedAppointments = localStorage.getItem('appointments');
        let allAppointments = storedAppointments ? JSON.parse(storedAppointments) : getMockAppointments();

        // Filter based on user role
        if (isPatient && user) {
            allAppointments = allAppointments.filter(a => a.patientEmail === user.email || a.patientId === user.id);
        } else if (isDoctor && user) {
            allAppointments = allAppointments.filter(a => a.doctorId === user.id || a.doctorName === user.name);
        }

        setAppointments(allAppointments);
        setFilteredAppointments(allAppointments);
        setLoading(false);
    };

    const getMockAppointments = () => {
        const mockAppointments = [
            {
                id: 1,
                patientId: 1,
                patientName: "John Doe",
                patientEmail: "john@example.com",
                patientPhone: "+1 234 567 8900",
                doctorId: 1,
                doctorName: "Dr. Sarah Wilson",
                doctorSpecialty: "Cardiologist",
                date: "2024-03-20",
                time: "10:00 AM",
                endTime: "10:30 AM",
                reason: "Chest pain and shortness of breath",
                symptoms: "Chest discomfort, difficulty breathing, fatigue",
                notes: "Patient has history of hypertension",
                status: "PENDING",
                type: "In-person",
                location: "Main Clinic, Room 101",
                createdAt: "2024-03-15T08:30:00",
                completedAt: null,
            },
            {
                id: 2,
                patientId: 2,
                patientName: "Jane Smith",
                patientEmail: "jane@example.com",
                patientPhone: "+1 234 567 8901",
                doctorId: 1,
                doctorName: "Dr. Sarah Wilson",
                doctorSpecialty: "Cardiologist",
                date: "2024-03-21",
                time: "02:00 PM",
                endTime: "02:30 PM",
                reason: "Follow-up on blood pressure medication",
                symptoms: "Headache, dizziness",
                notes: "Checking Lisinopril effectiveness",
                status: "CONFIRMED",
                type: "Telemedicine",
                location: "Video Call",
                createdAt: "2024-03-14T10:15:00",
                completedAt: null,
            },
            {
                id: 3,
                patientId: 3,
                patientName: "Robert Johnson",
                patientEmail: "robert@example.com",
                patientPhone: "+1 234 567 8902",
                doctorId: 2,
                doctorName: "Dr. Michael Chen",
                doctorSpecialty: "Neurologist",
                date: "2024-03-19",
                time: "11:30 AM",
                endTime: "12:00 PM",
                reason: "Migraine treatment review",
                symptoms: "Severe headaches, sensitivity to light",
                notes: "MRI results ready for discussion",
                status: "COMPLETED",
                type: "In-person",
                location: "Main Clinic, Room 205",
                createdAt: "2024-03-10T14:20:00",
                completedAt: "2024-03-19T12:05:00",
            },
            {
                id: 4,
                patientId: 4,
                patientName: "Emily Davis",
                patientEmail: "emily@example.com",
                patientPhone: "+1 234 567 8903",
                doctorId: 3,
                doctorName: "Dr. Emily Rodriguez",
                doctorSpecialty: "Pediatrician",
                date: "2024-03-18",
                time: "09:00 AM",
                endTime: "09:30 AM",
                reason: "Annual check-up for child",
                symptoms: "None - routine checkup",
                notes: "Bring vaccination records",
                status: "CANCELLED",
                type: "In-person",
                location: "Children's Clinic, Room 10",
                createdAt: "2024-03-01T09:00:00",
                completedAt: null,
            },
            {
                id: 5,
                patientId: 5,
                patientName: "Michael Brown",
                patientEmail: "michael@example.com",
                patientPhone: "+1 234 567 8904",
                doctorId: 4,
                doctorName: "Dr. James Peterson",
                doctorSpecialty: "Dermatologist",
                date: "2024-03-22",
                time: "03:00 PM",
                endTime: "03:30 PM",
                reason: "Skin rash consultation",
                symptoms: "Red itchy patches on arms",
                notes: "Possible allergic reaction",
                status: "PENDING",
                type: "In-person",
                location: "Dermatology Center, Room 8",
                createdAt: "2024-03-16T11:45:00",
                completedAt: null,
            },
        ];
        return mockAppointments;
    };

    const saveAppointmentsToLocal = (updatedAppointments) => {
        // Merge with existing appointments from localStorage
        const storedAppointments = localStorage.getItem('appointments');
        let allAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];

        // Update or add appointments
        updatedAppointments.forEach(updatedApp => {
            const index = allAppointments.findIndex(a => a.id === updatedApp.id);
            if (index !== -1) {
                allAppointments[index] = updatedApp;
            } else {
                allAppointments.push(updatedApp);
            }
        });

        localStorage.setItem('appointments', JSON.stringify(allAppointments));
        setAppointments(updatedAppointments);
    };

    const filterAppointments = () => {
        let filtered = [...appointments];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => a.status === statusFilter.toUpperCase());
        }

        // Tab filter
        if (activeTab === 'requests') {
            filtered = filtered.filter(a => a.status === 'PENDING');
        } else if (activeTab === 'upcoming') {
            filtered = filtered.filter(a => a.status === 'CONFIRMED' && new Date(a.date) >= new Date());
        } else if (activeTab === 'completed') {
            filtered = filtered.filter(a => a.status === 'COMPLETED');
        } else if (activeTab === 'cancelled') {
            filtered = filtered.filter(a => a.status === 'CANCELLED');
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(a =>
                a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.reason?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by date (upcoming first)
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

        setFilteredAppointments(filtered);
        setCurrentPage(1);
    };

    const handleAcceptAppointment = (appointment) => {
        const updatedAppointment = {
            ...appointment,
            status: "CONFIRMED",
            confirmedAt: new Date().toISOString(),
        };

        const updatedAppointments = appointments.map(a =>
            a.id === appointment.id ? updatedAppointment : a
        );

        saveAppointmentsToLocal(updatedAppointments);
        showNotification(`Appointment with ${appointment.patientName} has been accepted`, "success");
    };

    const handleRejectAppointment = (appointment) => {
        if (window.confirm(`Are you sure you want to reject this appointment with ${appointment.patientName}?`)) {
            const updatedAppointment = {
                ...appointment,
                status: "CANCELLED",
                cancelledAt: new Date().toISOString(),
                cancellationReason: "Rejected by doctor",
            };

            const updatedAppointments = appointments.map(a =>
                a.id === appointment.id ? updatedAppointment : a
            );

            saveAppointmentsToLocal(updatedAppointments);
            showNotification(`Appointment with ${appointment.patientName} has been rejected`, "warning");
        }
    };

    const handleCompleteAppointment = (appointment) => {
        if (window.confirm(`Mark appointment with ${appointment.patientName} as completed?`)) {
            const updatedAppointment = {
                ...appointment,
                status: "COMPLETED",
                completedAt: new Date().toISOString(),
            };

            const updatedAppointments = appointments.map(a =>
                a.id === appointment.id ? updatedAppointment : a
            );

            saveAppointmentsToLocal(updatedAppointments);
            showNotification(`Appointment with ${appointment.patientName} marked as completed`, "success");
        }
    };

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailsModal(true);
    };

    const handleRequestAppointment = () => {
        // For patients to request new appointment
        if (!formData.doctorId || !formData.date || !formData.time) {
            showNotification("Please fill all required fields", "danger");
            return;
        }

        const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));

        const newAppointment = {
            id: Date.now(),
            patientId: user?.id || Math.floor(Math.random() * 1000),
            patientName: formData.patientName || user?.name || "Patient",
            patientEmail: formData.patientEmail || user?.email,
            patientPhone: formData.patientPhone || "",
            doctorId: parseInt(formData.doctorId),
            doctorName: selectedDoctor?.name,
            doctorSpecialty: selectedDoctor?.specialty,
            date: formData.date,
            time: formData.time,
            endTime: addMinutesToTime(formData.time, 30),
            reason: formData.reason,
            symptoms: formData.symptoms,
            notes: formData.notes,
            status: "PENDING",
            type: "In-person",
            location: "Main Clinic",
            createdAt: new Date().toISOString(),
            completedAt: null,
        };

        const updatedAppointments = [newAppointment, ...appointments];
        saveAppointmentsToLocal(updatedAppointments);
        showNotification("Appointment request sent successfully!", "success");
        setShowModal(false);
        resetForm();
    };

    const addMinutesToTime = (time, minutes) => {
        // Convert time like "10:00 AM" to add minutes
        const [timeStr, modifier] = time.split(' ');
        let [hours, mins] = timeStr.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMins = totalMinutes % 60;
        const newModifier = newHours >= 12 ? 'PM' : 'AM';
        const displayHours = newHours % 12 || 12;

        return `${displayHours}:${newMins.toString().padStart(2, '0')} ${newModifier}`;
    };

    const resetForm = () => {
        setFormData({
            patientName: "",
            patientEmail: "",
            doctorId: "",
            doctorName: "",
            date: "",
            time: "",
            reason: "",
            symptoms: "",
            notes: "",
        });
    };

    const showNotification = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'PENDING':
                return <Badge bg="warning" className="px-3 py-2">Pending</Badge>;
            case 'CONFIRMED':
                return <Badge bg="success" className="px-3 py-2">Confirmed</Badge>;
            case 'COMPLETED':
                return <Badge bg="info" className="px-3 py-2">Completed</Badge>;
            case 'CANCELLED':
                return <Badge bg="danger" className="px-3 py-2">Cancelled</Badge>;
            default:
                return <Badge bg="secondary" className="px-3 py-2">{status}</Badge>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString;
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Statistics
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(a => a.status === 'PENDING').length;
    const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMED').length;
    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastVariant === 'success' && <CheckCircle size={18} />}
                            {toastVariant === 'danger' && <AlertCircle size={18} />}
                            {toastVariant === 'warning' && <AlertCircle size={18} />}
                        </strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div>
                                    <h2 className="mb-1 fw-bold">Appointment Management</h2>
                                    <p className="text-muted mb-0">
                                        {isDoctor ? 'Manage and track patient appointments' : 'Schedule and manage your appointments'}
                                    </p>
                                </div>
                                {isPatient && (
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowModal(true)}
                                        className="d-flex align-items-center gap-2 px-4 py-2"
                                    >
                                        <Calendar size={18} />
                                        Request Appointment
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col lg={3} md={6} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-1">Total Appointments</h6>
                                    <h3 className="mb-0 fw-bold">{totalAppointments}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 rounded p-3">
                                    <CalendarIcon size={24} className="text-primary" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-1">Pending Requests</h6>
                                    <h3 className="mb-0 fw-bold text-warning">{pendingAppointments}</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <ClockIcon size={24} className="text-warning" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-1">Confirmed</h6>
                                    <h3 className="mb-0 fw-bold text-success">{confirmedAppointments}</h3>
                                </div>
                                <div className="bg-success bg-opacity-10 rounded p-3">
                                    <CheckCircle size={24} className="text-success" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-1">Completed</h6>
                                    <h3 className="mb-0 fw-bold text-info">{completedAppointments}</h3>
                                </div>
                                <div className="bg-info bg-opacity-10 rounded p-3">
                                    <Activity size={24} className="text-info" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Row>
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            {/* Tabs */}
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-4"
                            >
                                <Tab eventKey="requests" title="Pending Requests">
                                    {isDoctor && <Badge bg="warning" className="ms-2">{pendingAppointments}</Badge>}
                                </Tab>
                                <Tab eventKey="upcoming" title="Upcoming" />
                                <Tab eventKey="completed" title="Completed" />
                                <Tab eventKey="cancelled" title="Cancelled" />
                                <Tab eventKey="all" title="All Appointments" />
                            </Tabs>

                            {/* Search and Filter */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button
                                        variant={statusFilter === 'all' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('all')}
                                        size="sm"
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'pending' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('pending')}
                                        size="sm"
                                    >
                                        Pending
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'confirmed' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('confirmed')}
                                        size="sm"
                                    >
                                        Confirmed
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'completed' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('completed')}
                                        size="sm"
                                    >
                                        Completed
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'cancelled' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('cancelled')}
                                        size="sm"
                                    >
                                        Cancelled
                                    </Button>
                                </div>

                                <InputGroup style={{ maxWidth: '300px' }}>
                                    <InputGroup.Text>
                                        <Search size={18} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search appointments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>

                            {/* Appointments Table */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3 text-muted">Loading appointments...</p>
                                </div>
                            ) : currentItems.length === 0 ? (
                                <div className="text-center py-5">
                                    <CalendarIcon size={48} className="text-muted mb-3" />
                                    <h5>No Appointments Found</h5>
                                    <p className="text-muted">
                                        {isDoctor ? 'No appointment requests at the moment' : 'No appointments scheduled'}
                                    </p>
                                    {isPatient && (
                                        <Button variant="primary" onClick={() => setShowModal(true)}>
                                            Request an Appointment
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3">Patient/Doctor</th>
                                            <th className="px-4 py-3">Date & Time</th>
                                            <th className="px-4 py-3">Reason</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentItems.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="fw-semibold">
                                                        {isDoctor ? appointment.patientName : appointment.doctorName}
                                                    </div>
                                                    <small className="text-muted">
                                                        {isDoctor ? appointment.patientEmail : appointment.doctorSpecialty}
                                                    </small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div>{formatDate(appointment.date)}</div>
                                                    <small className="text-muted">{appointment.time}</small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                                        {appointment.reason}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <Badge bg="secondary">{appointment.type}</Badge>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    {getStatusBadge(appointment.status)}
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(appointment)}
                                                            className="d-flex align-items-center gap-1"
                                                        >
                                                            <Eye size={16} />
                                                            View
                                                        </Button>

                                                        {isDoctor && appointment.status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    variant="outline-success"
                                                                    size="sm"
                                                                    onClick={() => handleAcceptAppointment(appointment)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleRejectAppointment(appointment)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <XCircle size={16} />
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}

                                                        {isDoctor && appointment.status === 'CONFIRMED' && (
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => handleCompleteAppointment(appointment)}
                                                                className="d-flex align-items-center gap-1"
                                                            >
                                                                <CheckSquare size={16} />
                                                                Complete
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredAppointments.length > itemsPerPage && (
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

            {/* Request Appointment Modal (for patients) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Request New Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Your Name *">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.patientName}
                                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Your Email *">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.patientEmail}
                                        onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Select Doctor *">
                                    <Form.Select
                                        value={formData.doctorId}
                                        onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                                    >
                                        <option value="">Choose a doctor</option>
                                        {doctors.filter(d => d.available).map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.name} - {doctor.specialty}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Appointment Type">
                                    <Form.Select>
                                        <option>In-person</option>
                                        <option>Telemedicine</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Preferred Date *">
                                    <Form.Control
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Preferred Time *">
                                    <Form.Control
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Reason for Visit *">
                                    <Form.Control
                                        type="text"
                                        placeholder="Brief reason for the appointment"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Symptoms (Optional)">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Describe your symptoms"
                                        value={formData.symptoms}
                                        onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Additional Notes (Optional)">
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Any additional information"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRequestAppointment}>
                        Submit Request
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Appointment Details Modal */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && (
                        <div>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card className="border-0 bg-light">
                                        <Card.Body>
                                            <h6 className="text-muted mb-3">Patient Information</h6>
                                            <div className="mb-2">
                                                <User size={16} className="text-muted me-2" />
                                                <strong>{selectedAppointment.patientName}</strong>
                                            </div>
                                            <div className="mb-2">
                                                <Mail size={16} className="text-muted me-2" />
                                                {selectedAppointment.patientEmail}
                                            </div>
                                            <div className="mb-2">
                                                <Phone size={16} className="text-muted me-2" />
                                                {selectedAppointment.patientPhone || "Not provided"}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 bg-light">
                                        <Card.Body>
                                            <h6 className="text-muted mb-3">Doctor Information</h6>
                                            <div className="mb-2">
                                                <User size={16} className="text-muted me-2" />
                                                <strong>{selectedAppointment.doctorName}</strong>
                                            </div>
                                            <div className="mb-2">
                                                <FileText size={16} className="text-muted me-2" />
                                                {selectedAppointment.doctorSpecialty}
                                            </div>
                                            <div className="mb-2">
                                                <MapPin size={16} className="text-muted me-2" />
                                                {selectedAppointment.location}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card className="border-0 bg-light">
                                        <Card.Body>
                                            <h6 className="text-muted mb-3">Appointment Details</h6>
                                            <div className="mb-2">
                                                <Calendar size={16} className="text-muted me-2" />
                                                {formatDate(selectedAppointment.date)}
                                            </div>
                                            <div className="mb-2">
                                                <Clock size={16} className="text-muted me-2" />
                                                {selectedAppointment.time} - {selectedAppointment.endTime}
                                            </div>
                                            <div className="mb-2">
                                                <Badge bg="secondary">{selectedAppointment.type}</Badge>
                                            </div>
                                            <div className="mb-2">
                                                Status: {getStatusBadge(selectedAppointment.status)}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 bg-light">
                                        <Card.Body>
                                            <h6 className="text-muted mb-3">Medical Information</h6>
                                            <div className="mb-2">
                                                <strong>Reason:</strong> {selectedAppointment.reason}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Symptoms:</strong> {selectedAppointment.symptoms || "None reported"}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Notes:</strong> {selectedAppointment.notes || "No additional notes"}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Card className="border-0 bg-light">
                                        <Card.Body>
                                            <h6 className="text-muted mb-3">Timeline</h6>
                                            <div className="mb-2">
                                                <strong>Requested:</strong> {formatDate(selectedAppointment.createdAt)} at {new Date(selectedAppointment.createdAt).toLocaleTimeString()}
                                            </div>
                                            {selectedAppointment.confirmedAt && (
                                                <div className="mb-2">
                                                    <strong>Confirmed:</strong> {formatDate(selectedAppointment.confirmedAt)} at {new Date(selectedAppointment.confirmedAt).toLocaleTimeString()}
                                                </div>
                                            )}
                                            {selectedAppointment.completedAt && (
                                                <div className="mb-2">
                                                    <strong>Completed:</strong> {formatDate(selectedAppointment.completedAt)} at {new Date(selectedAppointment.completedAt).toLocaleTimeString()}
                                                </div>
                                            )}
                                            {selectedAppointment.cancelledAt && (
                                                <div className="mb-2">
                                                    <strong>Cancelled:</strong> {formatDate(selectedAppointment.cancelledAt)} at {new Date(selectedAppointment.cancelledAt).toLocaleTimeString()}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Close
                    </Button>
                    {isDoctor && selectedAppointment?.status === 'PENDING' && (
                        <ButtonGroup>
                            <Button variant="success" onClick={() => {
                                handleAcceptAppointment(selectedAppointment);
                                setShowDetailsModal(false);
                            }}>
                                Accept
                            </Button>
                            <Button variant="danger" onClick={() => {
                                handleRejectAppointment(selectedAppointment);
                                setShowDetailsModal(false);
                            }}>
                                Reject
                            </Button>
                        </ButtonGroup>
                    )}
                    {isDoctor && selectedAppointment?.status === 'CONFIRMED' && (
                        <Button variant="success" onClick={() => {
                            handleCompleteAppointment(selectedAppointment);
                            setShowDetailsModal(false);
                        }}>
                            Mark as Completed
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Appointments;