import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, Button, Table, Badge,
    Alert, Spinner, Toast, ToastContainer, Modal,
    InputGroup, Form, Tabs, Tab, Pagination
} from 'react-bootstrap';
import {
    Video, Calendar, CheckCircle, XCircle,
    ExternalLink, Mail, Search,
    Clock, Activity, Link as LinkIcon,
    Copy, AlertCircle
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Telemedicine = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';

    const [loading, setLoading] = useState(true);
    const [telemedicineRequests, setTelemedicineRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState('pending');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Available meeting platforms
    const meetingPlatforms = [
        { id: 'google_meet', name: 'Google Meet', icon: '🎥', color: '#0F9D58' },
        { id: 'microsoft_teams', name: 'Microsoft Teams', icon: '💬', color: '#464EB8' },
        { id: 'zoom', name: 'Zoom', icon: '🔍', color: '#0E72C9' },
        { id: 'custom', name: 'Custom Link', icon: '🔗', color: '#6c757d' }
    ];

    // Load telemedicine data from localStorage
    useEffect(() => {
        loadTelemedicineData();
    }, []);

    useEffect(() => {
        filterRequests();
    }, [searchTerm, statusFilter, activeTab, telemedicineRequests]);

    const loadTelemedicineData = () => {
        setLoading(true);
        const storedRequests = localStorage.getItem('telemedicineRequests');

        if (storedRequests) {
            setTelemedicineRequests(JSON.parse(storedRequests));
        } else {
            // Mock telemedicine requests data
            const mockRequests = [
                {
                    id: 1,
                    patientId: 1,
                    patientName: "John Doe",
                    patientEmail: "john@example.com",
                    patientPhone: "+1 234 567 8900",
                    patientAge: 35,
                    patientGender: "Male",
                    reason: "Persistent cough and fever for 3 days",
                    symptoms: "Dry cough, temperature 101°F, fatigue",
                    preferredDate: "2024-03-20",
                    preferredTime: "10:00 AM",
                    status: "PENDING",
                    requestedAt: "2024-03-18T09:30:00",
                    doctorId: 1,
                    doctorName: "Dr. Sarah Wilson",
                    notes: "Patient has no prior history of respiratory issues"
                },
                {
                    id: 2,
                    patientId: 2,
                    patientName: "Jane Smith",
                    patientEmail: "jane@example.com",
                    patientPhone: "+1 234 567 8901",
                    patientAge: 28,
                    patientGender: "Female",
                    reason: "Headache and dizziness",
                    symptoms: "Severe headache, blurred vision, nausea",
                    preferredDate: "2024-03-20",
                    preferredTime: "02:00 PM",
                    status: "ACCEPTED",
                    requestedAt: "2024-03-18T11:15:00",
                    doctorId: 1,
                    doctorName: "Dr. Sarah Wilson",
                    meetingLink: "https://meet.google.com/abc-defg-hij",
                    meetingPlatform: "google_meet",
                    meetingId: "abc-defg-hij",
                    meetingPassword: "123456",
                    acceptedAt: "2024-03-18T14:20:00",
                    notes: "Migraine history reported"
                },
                {
                    id: 3,
                    patientId: 3,
                    patientName: "Robert Johnson",
                    patientEmail: "robert@example.com",
                    patientPhone: "+1 234 567 8902",
                    patientAge: 42,
                    patientGender: "Male",
                    reason: "Follow-up on blood pressure medication",
                    symptoms: "Occasional headaches, BP slightly elevated",
                    preferredDate: "2024-03-21",
                    preferredTime: "11:30 AM",
                    status: "PENDING",
                    requestedAt: "2024-03-19T08:45:00",
                    doctorId: 1,
                    doctorName: "Dr. Sarah Wilson",
                    notes: "Taking Lisinopril 10mg daily"
                },
                {
                    id: 4,
                    patientId: 4,
                    patientName: "Emily Davis",
                    patientEmail: "emily@example.com",
                    patientPhone: "+1 234 567 8903",
                    patientAge: 31,
                    patientGender: "Female",
                    reason: "Skin rash consultation",
                    symptoms: "Red itchy patches on arms and legs",
                    preferredDate: "2024-03-19",
                    preferredTime: "03:00 PM",
                    status: "COMPLETED",
                    requestedAt: "2024-03-17T13:20:00",
                    doctorId: 1,
                    doctorName: "Dr. Sarah Wilson",
                    meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123",
                    meetingPlatform: "microsoft_teams",
                    meetingId: "abc123",
                    meetingPassword: "789012",
                    acceptedAt: "2024-03-18T10:00:00",
                    completedAt: "2024-03-19T03:30:00",
                    notes: "Allergic reaction to new lotion"
                },
                {
                    id: 5,
                    patientId: 5,
                    patientName: "Michael Brown",
                    patientEmail: "michael@example.com",
                    patientPhone: "+1 234 567 8904",
                    patientAge: 55,
                    patientGender: "Male",
                    reason: "Diabetes follow-up consultation",
                    symptoms: "Increased thirst, frequent urination",
                    preferredDate: "2024-03-22",
                    preferredTime: "09:00 AM",
                    status: "PENDING",
                    requestedAt: "2024-03-19T15:30:00",
                    doctorId: 1,
                    doctorName: "Dr. Sarah Wilson",
                    notes: "Type 2 diabetes, needs medication review"
                },
                {
                    id: 6,
                    patientId: 6,
                    patientName: "Sarah Wilson",
                    patientEmail: "sarah@example.com",
                    patientPhone: "+1 234 567 8905",
                    patientAge: 45,
                    patientGender: "Female",
                    reason: "Anxiety and stress management",
                    symptoms: "Difficulty sleeping, racing thoughts",
                    preferredDate: "2024-03-20",
                    preferredTime: "04:00 PM",
                    status: "CANCELLED",
                    requestedAt: "2024-03-18T16:45:00",
                    doctorId: 1,
                    doctorName: "Dr. Sarah Wilson",
                    cancelledAt: "2024-03-19T09:00:00",
                    cancellationReason: "Patient rescheduled",
                    notes: "Previous history of anxiety"
                }
            ];
            setTelemedicineRequests(mockRequests);
            localStorage.setItem('telemedicineRequests', JSON.stringify(mockRequests));
        }
        setLoading(false);
    };

    const saveTelemedicineData = (updatedRequests) => {
        localStorage.setItem('telemedicineRequests', JSON.stringify(updatedRequests));
        setTelemedicineRequests(updatedRequests);
    };

    const filterRequests = () => {
        let filtered = [...telemedicineRequests];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(r => r.status === statusFilter.toUpperCase());
        }

        // Tab filter
        if (activeTab === 'pending') {
            filtered = filtered.filter(r => r.status === 'PENDING');
        } else if (activeTab === 'accepted') {
            filtered = filtered.filter(r => r.status === 'ACCEPTED');
        } else if (activeTab === 'completed') {
            filtered = filtered.filter(r => r.status === 'COMPLETED');
        } else if (activeTab === 'cancelled') {
            filtered = filtered.filter(r => r.status === 'CANCELLED');
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.reason.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by requested date (newest first)
        filtered.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

        setFilteredRequests(filtered);
        setCurrentPage(1);
    };

    const handleAcceptRequest = (request) => {
        setSelectedRequest(request);
        setShowAcceptModal(true);
    };

    const handleGenerateMeetingLink = (platform, meetingLink, meetingId, meetingPassword) => {
        if (!meetingLink && platform !== 'custom') {
            // Generate mock meeting link based on platform
            let generatedLink = '';
            let generatedId = '';
            let generatedPassword = '';

            switch(platform) {
                case 'google_meet':
                    const meetCode = Math.random().toString(36).substring(2, 10);
                    generatedLink = `https://meet.google.com/${meetCode}`;
                    generatedId = meetCode;
                    break;
                case 'microsoft_teams':
                    const teamCode = Math.random().toString(36).substring(2, 8);
                    generatedLink = `https://teams.microsoft.com/l/meetup-join/${teamCode}`;
                    generatedId = teamCode;
                    generatedPassword = Math.floor(100000 + Math.random() * 900000).toString();
                    break;
                case 'zoom':
                    const zoomId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
                    generatedLink = `https://zoom.us/j/${zoomId}`;
                    generatedId = zoomId;
                    generatedPassword = Math.floor(100000 + Math.random() * 900000).toString();
                    break;
                default:
                    generatedLink = '';
            }

            meetingLink = generatedLink;
            meetingId = generatedId;
            meetingPassword = generatedPassword;
        }

        const updatedRequest = {
            ...selectedRequest,
            status: "ACCEPTED",
            meetingLink: meetingLink,
            meetingPlatform: platform,
            meetingId: meetingId,
            meetingPassword: meetingPassword,
            acceptedAt: new Date().toISOString()
        };

        const updatedRequests = telemedicineRequests.map(r =>
            r.id === selectedRequest.id ? updatedRequest : r
        );

        saveTelemedicineData(updatedRequests);
        showNotification(`Telemedicine session accepted for ${selectedRequest.patientName}. Meeting link generated!`, "success");
        setShowAcceptModal(false);
        setSelectedRequest(null);
    };

    const handleCancelRequest = (request) => {
        if (window.confirm(`Are you sure you want to cancel the telemedicine request from ${request.patientName}?`)) {
            const updatedRequest = {
                ...request,
                status: "CANCELLED",
                cancelledAt: new Date().toISOString(),
                cancellationReason: "Cancelled by doctor"
            };

            const updatedRequests = telemedicineRequests.map(r =>
                r.id === request.id ? updatedRequest : r
            );

            saveTelemedicineData(updatedRequests);
            showNotification(`Telemedicine request from ${request.patientName} has been cancelled`, "warning");
        }
    };

    const handleCompleteSession = (request) => {
        if (window.confirm(`Mark telemedicine session with ${request.patientName} as completed?`)) {
            const updatedRequest = {
                ...request,
                status: "COMPLETED",
                completedAt: new Date().toISOString()
            };

            const updatedRequests = telemedicineRequests.map(r =>
                r.id === request.id ? updatedRequest : r
            );

            saveTelemedicineData(updatedRequests);
            showNotification(`Session with ${request.patientName} marked as completed`, "success");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showNotification("Meeting link copied to clipboard!", "success");
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
            case 'ACCEPTED':
                return <Badge bg="success" className="px-3 py-2">Accepted</Badge>;
            case 'COMPLETED':
                return <Badge bg="info" className="px-3 py-2">Completed</Badge>;
            case 'CANCELLED':
                return <Badge bg="danger" className="px-3 py-2">Cancelled</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
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
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    // Statistics
    const totalRequests = telemedicineRequests.length;
    const pendingRequests = telemedicineRequests.filter(r => r.status === 'PENDING').length;
    const acceptedRequests = telemedicineRequests.filter(r => r.status === 'ACCEPTED').length;
    const completedRequests = telemedicineRequests.filter(r => r.status === 'COMPLETED').length;

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
                                    <h2 className="mb-1 fw-bold">Telemedicine Sessions</h2>
                                    <p className="text-muted mb-0">
                                        Manage patient telemedicine requests and conduct virtual consultations
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Badge bg="primary" className="p-3">
                                        <Video size={18} className="me-2" />
                                        Active Sessions: {acceptedRequests}
                                    </Badge>
                                </div>
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
                                    <h6 className="text-muted mb-1">Total Requests</h6>
                                    <h3 className="mb-0 fw-bold">{totalRequests}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 rounded p-3">
                                    <Video size={24} className="text-primary" />
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
                                    <h3 className="mb-0 fw-bold text-warning">{pendingRequests}</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <Clock size={24} className="text-warning" />
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
                                    <h6 className="text-muted mb-1">Upcoming Sessions</h6>
                                    <h3 className="mb-0 fw-bold text-success">{acceptedRequests}</h3>
                                </div>
                                <div className="bg-success bg-opacity-10 rounded p-3">
                                    <Calendar size={24} className="text-success" />
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
                                    <h3 className="mb-0 fw-bold text-info">{completedRequests}</h3>
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
                                <Tab eventKey="pending" title="Pending Requests">
                                    {pendingRequests > 0 && <Badge bg="warning" className="ms-2">{pendingRequests}</Badge>}
                                </Tab>
                                <Tab eventKey="accepted" title="Accepted Sessions" />
                                <Tab eventKey="completed" title="Completed" />
                                <Tab eventKey="cancelled" title="Cancelled" />
                                <Tab eventKey="all" title="All Requests" />
                            </Tabs>

                            {/* Search and Filter */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button
                                        variant={statusFilter === 'all' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('all')}
                                        size="sm"
                                    >
                                        All Status
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'pending' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('pending')}
                                        size="sm"
                                    >
                                        Pending
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'accepted' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('accepted')}
                                        size="sm"
                                    >
                                        Accepted
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'completed' ? 'primary' : 'light'}
                                        onClick={() => setStatusFilter('completed')}
                                        size="sm"
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
                                        placeholder="Search by patient..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>

                            {/* Telemedicine Table */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">Loading telemedicine data...</p>
                                </div>
                            ) : currentItems.length === 0 ? (
                                <div className="text-center py-5">
                                    <Video size={48} className="text-muted mb-3" />
                                    <h5>No Telemedicine Requests</h5>
                                    <p className="text-muted">
                                        No telemedicine requests found for the selected criteria
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3">Patient</th>
                                            <th className="px-4 py-3">Reason</th>
                                            <th className="px-4 py-3">Preferred Date & Time</th>
                                            <th className="px-4 py-3">Requested</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Meeting Link</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentItems.map((request) => (
                                            <tr key={request.id}>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="fw-semibold">{request.patientName}</div>
                                                    <small className="text-muted">
                                                        {request.patientAge} yrs • {request.patientGender}
                                                    </small>
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            <Mail size={12} className="me-1" />
                                                            {request.patientEmail}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                                        {request.reason}
                                                    </div>
                                                    <small className="text-muted">
                                                        {request.symptoms?.substring(0, 50)}...
                                                    </small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div>{formatDate(request.preferredDate)}</div>
                                                    <small className="text-muted">{request.preferredTime}</small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div>{formatDate(request.requestedAt)}</div>
                                                    <small className="text-muted">
                                                        {new Date(request.requestedAt).toLocaleTimeString()}
                                                    </small>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    {getStatusBadge(request.status)}
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    {request.status === 'ACCEPTED' && request.meetingLink ? (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                href={request.meetingLink}
                                                                target="_blank"
                                                                className="d-flex align-items-center gap-1"
                                                            >
                                                                <ExternalLink size={14} />
                                                                Join {request.meetingPlatform === 'google_meet' ? 'Google Meet' :
                                                                request.meetingPlatform === 'microsoft_teams' ? 'Teams' :
                                                                    request.meetingPlatform === 'zoom' ? 'Zoom' : 'Meeting'}
                                                            </Button>
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => copyToClipboard(request.meetingLink)}
                                                            >
                                                                <Copy size={14} />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {request.status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => handleAcceptRequest(request)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <CheckCircle size={14} />
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => handleCancelRequest(request)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <XCircle size={14} />
                                                                    Decline
                                                                </Button>
                                                            </>
                                                        )}

                                                        {request.status === 'ACCEPTED' && (
                                                            <>
                                                                <Button
                                                                    variant="info"
                                                                    size="sm"
                                                                    onClick={() => handleCompleteSession(request)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <CheckCircle size={14} />
                                                                    Complete
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleCancelRequest(request)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <XCircle size={14} />
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        )}

                                                        {request.status === 'COMPLETED' && (
                                                            <Button
                                                                variant="outline-info"
                                                                size="sm"
                                                                className="d-flex align-items-center gap-1"
                                                                disabled
                                                            >
                                                                <CheckCircle size={14} />
                                                                Completed
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
                            {filteredRequests.length > itemsPerPage && (
                                <div className="d-flex justify-content-center py-3">
                                    <Pagination>
                                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                                        {[...Array(totalPages)].map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={index + 1 === currentPage}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}

                                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Accept Telemedicine Modal - Generate Meeting Link */}
            <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} size="lg">
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>
                        <Video size={20} className="me-2" />
                        Accept Telemedicine Request
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <>
                            <Alert variant="info">
                                <strong>Patient: {selectedRequest.patientName}</strong><br />
                                <strong>Reason:</strong> {selectedRequest.reason}<br />
                                <strong>Preferred Date & Time:</strong> {formatDate(selectedRequest.preferredDate)} at {selectedRequest.preferredTime}<br />
                                <strong>Symptoms:</strong> {selectedRequest.symptoms}
                            </Alert>

                            <h6 className="mb-3">Generate Meeting Link</h6>
                            <p className="text-muted small">Select a platform to generate a meeting link for the telemedicine session:</p>

                            <Row className="g-3">
                                {meetingPlatforms.map((platform) => (
                                    <Col md={6} key={platform.id}>
                                        <Card
                                            className="border-2 shadow-sm h-100"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleGenerateMeetingLink(platform.id, '', '', '')}
                                        >
                                            <Card.Body className="text-center">
                                                <div style={{ fontSize: '40px' }}>{platform.icon}</div>
                                                <h6 className="mt-2 mb-0">{platform.name}</h6>
                                                <small className="text-muted">Auto-generate meeting link</small>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <hr className="my-4" />

                            <h6 className="mb-3">Or Enter Custom Meeting Link</h6>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meeting Platform</Form.Label>
                                    <Form.Select id="customPlatform">
                                        <option>Google Meet</option>
                                        <option>Microsoft Teams</option>
                                        <option>Zoom</option>
                                        <option>Other</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meeting Link</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <LinkIcon size={16} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="url"
                                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                            id="customLink"
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meeting ID (Optional)</Form.Label>
                                    <Form.Control type="text" placeholder="Enter meeting ID" id="customId" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password (Optional)</Form.Label>
                                    <Form.Control type="text" placeholder="Enter meeting password" id="customPassword" />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    className="w-100"
                                    onClick={() => {
                                        const customLink = document.getElementById('customLink').value;
                                        const customPlatform = document.getElementById('customPlatform').value;
                                        const customId = document.getElementById('customId').value;
                                        const customPassword = document.getElementById('customPassword').value;

                                        if (customLink) {
                                            handleGenerateMeetingLink('custom', customLink, customId, customPassword);
                                        } else {
                                            showNotification("Please enter a valid meeting link", "danger");
                                        }
                                    }}
                                >
                                    Accept with Custom Link
                                </Button>
                            </Form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Telemedicine;