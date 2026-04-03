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
    const { user, token } = useAuth();
    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';
    const isPatient = user?.role === 'PATIENT';
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    // State for appointments
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
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

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return { date: "", time: "" };
        const date = new Date(dateTimeStr);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return { date: formattedDate, time: formattedTime };
    };

    const loadDoctors = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctors`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
                console.log("Doctors loaded:", data.length);
            } else {
                console.error("Failed to load doctors:", response.status);
            }
        } catch (error) {
            console.error("Error loading doctors:", error);
        }
    };

    const loadAppointments = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/appointments`;
            const params = new URLSearchParams();

            if (isPatient && user?.id) {
                params.append('patientId', user.id);
            } else if (isDoctor && user?.id) {
                params.append('doctorId', user.id);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log("Fetching appointments from:", url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Appointments received:", data.length);

                // Map API data to frontend format
                const mappedData = data.map(app => {
                    const { date, time } = formatDateTime(app.appointmentDateTime);
                    return {
                        id: app.id,
                        patientId: app.patientId,
                        doctorId: app.doctorId,
                        patientName: app.patientName || "Unknown Patient",
                        doctorName: app.doctorName || "Unknown Doctor",
                        patientEmail: app.patientEmail || "",
                        patientPhone: app.patientPhone || "",
                        specialty: app.specialty || "",
                        date: date,
                        time: time,
                        appointmentDateTime: app.appointmentDateTime,
                        reason: app.notes || "No reason provided",
                        notes: app.notes || "",
                        status: app.status,
                        type: app.location?.toLowerCase().includes('tele') ? "Telemedicine" : "In-person",
                        location: app.location || "Main Clinic",
                        fee: app.fee || 0,
                        billingStatus: app.billingStatus || "PENDING"
                    };
                });
                setAppointments(mappedData);
                setFilteredAppointments(mappedData);
                showNotification(`Loaded ${mappedData.length} appointments`, "success");
            } else {
                const errorText = await response.text();
                console.error("API Error:", response.status, errorText);
                showNotification(`Failed to load appointments: ${response.status}`, "danger");
            }
        } catch (error) {
            console.error("Error loading appointments:", error);
            showNotification("Failed to connect to server. Please check if backend is running.", "danger");
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = () => {
        let filtered = [...appointments];

        // Tab filter
        if (activeTab === 'requests') {
            filtered = filtered.filter(a => a.status === 'PENDING');
        } else if (activeTab === 'upcoming') {
            filtered = filtered.filter(a => a.status === 'CONFIRMED');
        } else if (activeTab === 'completed') {
            filtered = filtered.filter(a => a.status === 'COMPLETED');
        } else if (activeTab === 'cancelled') {
            filtered = filtered.filter(a => a.status === 'CANCELLED');
        }

        // Additional status filter (if not using tabs)
        if (activeTab === 'all' && statusFilter !== 'all') {
            filtered = filtered.filter(a => a.status === statusFilter.toUpperCase());
        }

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(a =>
                (a.patientName?.toLowerCase() || '').includes(term) ||
                (a.doctorName?.toLowerCase() || '').includes(term) ||
                (a.reason?.toLowerCase() || '').includes(term) ||
                (a.specialty?.toLowerCase() || '').includes(term)
            );
        }

        // Sort by date
        filtered.sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime));

        setFilteredAppointments(filtered);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (user && token) {
            loadAppointments();
            if (isPatient) {
                loadDoctors();
            }
        }
    }, [user, token]);

    useEffect(() => {
        filterAppointments();
    }, [searchTerm, statusFilter, appointments, activeTab]);

    const [formData, setFormData] = useState({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        notes: "",
    });

    const handleAcceptAppointment = (appointment) => {
        updateAppointmentStatus(appointment.id, "CONFIRMED");
    };

    const handleRejectAppointment = (appointment) => {
        if (window.confirm(`Are you sure you want to reject this appointment with ${appointment.patientName}?`)) {
            updateAppointmentStatus(appointment.id, "CANCELLED");
        }
    };

    const handleCompleteAppointment = (appointment) => {
        if (window.confirm(`Mark appointment with ${appointment.patientName} as completed?`)) {
            updateAppointmentStatus(appointment.id, "COMPLETED");
        }
    };

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailsModal(true);
    };

    const handleRequestAppointment = async () => {
        if (!formData.doctorId || !formData.date || !formData.time) {
            showNotification("Please fill all required fields", "danger");
            return;
        }

        try {
            const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));

            const appointmentDateTime = `${formData.date}T${formData.time}:00`;

            const newAppointment = {
                patientId: user.id,
                doctorId: parseInt(formData.doctorId),
                patientName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Patient",
                doctorName: selectedDoctor ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}` : "Doctor",
                specialty: selectedDoctor?.specialty || "General",
                appointmentDateTime: appointmentDateTime,
                status: "PENDING",
                patientEmail: user.email || "",
                patientPhone: user.phone || "",
                location: "Main Clinic",
                notes: formData.reason || formData.notes,
                billingStatus: "PENDING",
                fee: 100.0
            };

            console.log("Creating appointment:", newAppointment);

            const response = await fetch(`${API_BASE_URL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAppointment)
            });

            if (response.ok) {
                const createdAppointment = await response.json();
                console.log("Appointment created:", createdAppointment);
                showNotification("Appointment request sent successfully!", "success");
                setShowModal(false);
                resetForm();
                loadAppointments();
            } else {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                showNotification(errorData.message || errorData.error || "Failed to create appointment", "danger");
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            showNotification("Failed to create appointment: " + error.message, "danger");
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        setLoading(true);
        try {
            const appointment = appointments.find(a => a.id === id);
            if (!appointment) {
                showNotification("Appointment not found", "danger");
                return;
            }

            const updateData = {
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                patientName: appointment.patientName,
                doctorName: appointment.doctorName,
                specialty: appointment.specialty,
                appointmentDateTime: appointment.appointmentDateTime,
                status: status,
                patientEmail: appointment.patientEmail,
                patientPhone: appointment.patientPhone,
                location: appointment.location,
                notes: appointment.notes,
                billingStatus: appointment.billingStatus,
                fee: appointment.fee
            };

            const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                showNotification(`Appointment marked as ${status.toLowerCase()}`, "success");
                loadAppointments();
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || "Failed to update status", "danger");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            showNotification("Failed to update status: " + error.message, "danger");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            doctorId: "",
            date: "",
            time: "",
            reason: "",
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
                                <Button
                                    variant="outline-secondary"
                                    onClick={loadAppointments}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <RefreshCw size={18} />
                                    Refresh
                                </Button>
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
                            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                                <Tab eventKey="requests" title="Pending Requests" />
                                <Tab eventKey="upcoming" title="Upcoming" />
                                <Tab eventKey="completed" title="Completed" />
                                <Tab eventKey="cancelled" title="Cancelled" />
                                <Tab eventKey="all" title="All Appointments" />
                            </Tabs>

                            {/* Search and Filter */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button variant={statusFilter === 'all' ? 'primary' : 'light'} onClick={() => setStatusFilter('all')} size="sm">All Status</Button>
                                    <Button variant={statusFilter === 'pending' ? 'primary' : 'light'} onClick={() => setStatusFilter('pending')} size="sm">Pending</Button>
                                    <Button variant={statusFilter === 'confirmed' ? 'primary' : 'light'} onClick={() => setStatusFilter('confirmed')} size="sm">Confirmed</Button>
                                    <Button variant={statusFilter === 'completed' ? 'primary' : 'light'} onClick={() => setStatusFilter('completed')} size="sm">Completed</Button>
                                    <Button variant={statusFilter === 'cancelled' ? 'primary' : 'light'} onClick={() => setStatusFilter('cancelled')} size="sm">Cancelled</Button>
                                </div>
                                <InputGroup style={{ maxWidth: '300px' }}>
                                    <InputGroup.Text><Search size={18} /></InputGroup.Text>
                                    <Form.Control type="text" placeholder="Search appointments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                                    <p className="text-muted">{isDoctor ? 'No appointment requests at the moment' : 'No appointments scheduled'}</p>
                                    {isPatient && (<Button variant="primary" onClick={() => setShowModal(true)}>Request an Appointment</Button>)}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3">{isDoctor ? "Patient" : "Doctor"}</th>
                                            <th className="px-4 py-3">Date & Time</th>
                                            <th className="px-4 py-3">Reason/Specialty</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentItems.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="fw-semibold">{isDoctor ? appointment.patientName : appointment.doctorName}</div>
                                                    <small className="text-muted">{isDoctor ? appointment.patientEmail : appointment.specialty}</small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div>{appointment.date}</div>
                                                    <small className="text-muted">{appointment.time}</small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="text-truncate" style={{ maxWidth: '200px' }}>{appointment.reason || appointment.specialty}</div>
                                                </td>
                                                <td className="px-4 py-3 align-middle"><Badge bg="secondary">{appointment.type}</Badge></td>
                                                <td className="px-4 py-3 align-middle">{getStatusBadge(appointment.status)}</td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="d-flex gap-2">
                                                        <Button variant="outline-info" size="sm" onClick={() => handleViewDetails(appointment)} className="d-flex align-items-center gap-1"><Eye size={16} /> View</Button>
                                                        {isDoctor && appointment.status === 'PENDING' && (
                                                            <>
                                                                <Button variant="outline-success" size="sm" onClick={() => handleAcceptAppointment(appointment)} className="d-flex align-items-center gap-1"><CheckCircle size={16} /> Accept</Button>
                                                                <Button variant="outline-danger" size="sm" onClick={() => handleRejectAppointment(appointment)} className="d-flex align-items-center gap-1"><XCircle size={16} /> Reject</Button>
                                                            </>
                                                        )}
                                                        {isDoctor && appointment.status === 'CONFIRMED' && (
                                                            <Button variant="outline-success" size="sm" onClick={() => handleCompleteAppointment(appointment)} className="d-flex align-items-center gap-1"><CheckSquare size={16} /> Complete</Button>
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
                                        {[...Array(totalPages)].map((_, index) => (<Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>{index + 1}</Pagination.Item>))}
                                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Request Appointment Modal - keep same as before */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Request New Appointment</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Select Doctor *">
                                    <Form.Select value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: e.target.value})}>
                                        <option value="">Choose a doctor</option>
                                        {doctors.map(doctor => (<option key={doctor.id} value={doctor.id}>Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}</option>))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}><FloatingLabel label="Preferred Date *"><Form.Control type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} /></FloatingLabel></Col>
                            <Col md={6}><FloatingLabel label="Preferred Time *"><Form.Control type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} /></FloatingLabel></Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={12}><FloatingLabel label="Reason for Visit *"><Form.Control type="text" placeholder="Brief reason for the appointment" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} /></FloatingLabel></Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={12}><FloatingLabel label="Additional Notes (Optional)"><Form.Control as="textarea" rows={3} placeholder="Any additional information" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} /></FloatingLabel></Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleRequestAppointment}>Submit Request</Button>
                </Modal.Footer>
            </Modal>

            {/* View Appointment Details Modal - keep same as before */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
                <Modal.Header closeButton className="bg-info text-white"><Modal.Title>Appointment Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedAppointment && (
                        <div>
                            <Row className="mb-4">
                                <Col md={6}><Card className="border-0 bg-light"><Card.Body><h6 className="text-muted mb-3">Patient Information</h6><div className="mb-2"><User size={16} className="text-muted me-2" /><strong>{selectedAppointment.patientName}</strong></div><div className="mb-2"><Mail size={16} className="text-muted me-2" />{selectedAppointment.patientEmail || "Not provided"}</div><div className="mb-2"><Phone size={16} className="text-muted me-2" />{selectedAppointment.patientPhone || "Not provided"}</div></Card.Body></Card></Col>
                                <Col md={6}><Card className="border-0 bg-light"><Card.Body><h6 className="text-muted mb-3">Doctor Information</h6><div className="mb-2"><User size={16} className="text-muted me-2" /><strong>{selectedAppointment.doctorName}</strong></div><div className="mb-2"><FileText size={16} className="text-muted me-2" />{selectedAppointment.specialty || "General"}</div><div className="mb-2"><MapPin size={16} className="text-muted me-2" />{selectedAppointment.location || "Main Clinic"}</div></Card.Body></Card></Col>
                            </Row>
                            <Row className="mb-4">
                                <Col md={6}><Card className="border-0 bg-light"><Card.Body><h6 className="text-muted mb-3">Appointment Details</h6><div className="mb-2"><Calendar size={16} className="text-muted me-2" />{selectedAppointment.date}</div><div className="mb-2"><Clock size={16} className="text-muted me-2" />{selectedAppointment.time}</div><div className="mb-2"><Badge bg="secondary">{selectedAppointment.type}</Badge></div><div className="mb-2">Status: {getStatusBadge(selectedAppointment.status)}</div></Card.Body></Card></Col>
                                <Col md={6}><Card className="border-0 bg-light"><Card.Body><h6 className="text-muted mb-3">Medical Information</h6><div className="mb-2"><strong>Reason:</strong> {selectedAppointment.reason}</div><div className="mb-2"><strong>Notes:</strong> {selectedAppointment.notes || "No additional notes"}</div><div className="mb-2"><strong>Fee:</strong> ${selectedAppointment.fee || 0}</div><div className="mb-2"><strong>Billing Status:</strong> {selectedAppointment.billingStatus}</div></Card.Body></Card></Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
                    {isDoctor && selectedAppointment?.status === 'PENDING' && (<ButtonGroup><Button variant="success" onClick={() => { handleAcceptAppointment(selectedAppointment); setShowDetailsModal(false); }}>Accept</Button><Button variant="danger" onClick={() => { handleRejectAppointment(selectedAppointment); setShowDetailsModal(false); }}>Reject</Button></ButtonGroup>)}
                    {isDoctor && selectedAppointment?.status === 'CONFIRMED' && (<Button variant="success" onClick={() => { handleCompleteAppointment(selectedAppointment); setShowDetailsModal(false); }}>Mark as Completed</Button>)}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Appointments;