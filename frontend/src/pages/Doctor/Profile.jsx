import React, { useState, useEffect, useRef } from "react";
import {
    Container, Row, Col, Card, Button, Form, Badge, Alert,
    FloatingLabel, Spinner, Toast, ToastContainer, Modal,
    ProgressBar, Tabs, Tab, ListGroup, Image, Table
} from 'react-bootstrap';
import {
    User, Mail, Phone, MapPin, Calendar, Award, Briefcase,
    Hospital, DollarSign, Clock, CheckCircle, XCircle,
    Upload, Camera, Edit2, Save, Shield, FileText,
    GraduationCap, Star, Users, Activity, Heart,
    Link as LinkIcon
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Doctor profile data
    const [profile, setProfile] = useState({
        // Personal Information
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah.wilson@medical.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1978-05-15",
        gender: "Female",
        address: "123 Medical Center Blvd, Healthcare City, HC 12345",

        // Professional Information
        specialization: "Cardiology",
        qualifications: [
            { id: 1, degree: "MD - Cardiology", institution: "Harvard Medical School", year: "2005", status: "verified" },
            { id: 2, degree: "MBBS", institution: "Johns Hopkins University", year: "2000", status: "verified" },
            { id: 3, degree: "Fellowship in Interventional Cardiology", institution: "Mayo Clinic", year: "2008", status: "verified" }
        ],
        experience: 18,
        hospitalName: "City General Hospital",
        clinicName: "Wilson Heart Clinic",
        consultationFee: 150,
        emergencyFee: 250,
        languages: ["English", "Spanish", "French"],

        // License & Verification
        licenseNumber: "MD-CARD-2024-7890",
        licenseExpiry: "2026-12-31",
        verificationStatus: "verified",
        boardCertified: true,
        malpracticeInsurance: "Active",

        // Social & Online Presence
        website: "www.drsarahwilson.com",
        socialMedia: {
            facebook: "drsarahwilson",
            twitter: "@drsarahwilson",
            linkedin: "drsarahwilson"
        },

        // Clinic Hours
        workingHours: [
            { day: "Monday", start: "09:00", end: "17:00", isAvailable: true },
            { day: "Tuesday", start: "09:00", end: "17:00", isAvailable: true },
            { day: "Wednesday", start: "09:00", end: "17:00", isAvailable: true },
            { day: "Thursday", start: "09:00", end: "17:00", isAvailable: true },
            { day: "Friday", start: "09:00", end: "16:00", isAvailable: true },
            { day: "Saturday", start: "10:00", end: "14:00", isAvailable: true },
            { day: "Sunday", start: "", end: "", isAvailable: false }
        ],

        // Statistics
        stats: {
            totalPatients: 1247,
            yearsOfExperience: 18,
            successfulTreatments: 2134,
            satisfactionRate: 98,
            averageRating: 4.8,
            totalReviews: 342
        },

        // Bank Details
        bankDetails: {
            accountHolder: "Dr. Sarah Wilson",
            bankName: "Medical Federal Bank",
            accountNumber: "****1234",
            routingNumber: "****5678",
            taxId: "***-**-7890"
        },

        // Additional Info
        bio: "Dr. Sarah Wilson is a board-certified cardiologist with over 18 years of experience in treating complex cardiac conditions. She specializes in interventional cardiology and preventive cardiac care. Dr. Wilson is committed to providing personalized, compassionate care to each patient.",
        awards: [
            "Best Cardiologist Award 2023",
            "Excellence in Patient Care 2022",
            "Research Excellence Award 2021"
        ],
        memberships: [
            "American College of Cardiology",
            "American Heart Association",
            "International Society of Cardiology"
        ]
    });

    const [editFormData, setEditFormData] = useState({ ...profile });

    // Load profile data from localStorage on mount
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = () => {
        setLoading(true);
        const storedProfile = localStorage.getItem('doctorProfile');
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
            setEditFormData(JSON.parse(storedProfile));
        }
        setLoading(false);
    };

    const saveProfileData = (updatedProfile) => {
        localStorage.setItem('doctorProfile', JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
        if (updateUser) {
            updateUser({ name: `${updatedProfile.firstName} ${updatedProfile.lastName}`, ...updatedProfile });
        }
    };

    const handleProfileUpdate = () => {
        saveProfileData(editFormData);
        showNotification("Profile updated successfully!", "success");
        setShowEditModal(false);
    };

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Image size should be less than 5MB", "danger");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setProfilePhoto(file);
                // Save to localStorage or send to server
                localStorage.setItem('doctorProfilePhoto', reader.result);
                showNotification("Profile photo updated!", "success");
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        setProfilePhoto(null);
        localStorage.removeItem('doctorProfilePhoto');
        showNotification("Profile photo removed", "info");
    };

    const showNotification = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const getVerificationBadge = (status) => {
        switch(status) {
            case 'verified':
                return <Badge bg="success" className="d-flex align-items-center gap-1"><CheckCircle size={14} /> Verified</Badge>;
            case 'pending':
                return <Badge bg="warning" className="d-flex align-items-center gap-1"><Clock size={14} /> Pending</Badge>;
            case 'rejected':
                return <Badge bg="danger" className="d-flex align-items-center gap-1"><XCircle size={14} /> Rejected</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    // Load saved profile photo
    useEffect(() => {
        const savedPhoto = localStorage.getItem('doctorProfilePhoto');
        if (savedPhoto) {
            setPhotoPreview(savedPhoto);
        }
    }, []);

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastVariant === 'success' && <CheckCircle size={18} />}
                            {toastVariant === 'danger' && <XCircle size={18} />}
                        </strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading profile...</p>
                </div>
            ) : (
                <>
                    {/* Profile Header */}
                    <Row className="mb-4">
                        <Col>
                            <Card className="shadow-sm border-0 overflow-hidden">
                                <div style={{ height: '150px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                                <Card.Body className="pt-0">
                                    <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between">
                                        <div className="d-flex align-items-end mt-n5">
                                            <div className="position-relative">
                                                {photoPreview ? (
                                                    <Image
                                                        src={photoPreview}
                                                        roundedCircle
                                                        style={{
                                                            width: '120px',
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                            border: '4px solid white',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '120px',
                                                            height: '120px',
                                                            borderRadius: '50%',
                                                            background: '#c7d2fe',
                                                            border: '4px solid white',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <User size={50} className="text-primary" />
                                                    </div>
                                                )}
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    className="position-absolute bottom-0 end-0 rounded-circle p-1"
                                                    onClick={() => fileInputRef.current.click()}
                                                    style={{ border: '2px solid white' }}
                                                >
                                                    <Camera size={16} />
                                                </Button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={handlePhotoUpload}
                                                />
                                            </div>
                                            <div className="ms-3 mb-2">
                                                <h2 className="mb-0">{profile.firstName} {profile.lastName}</h2>
                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                    <Badge bg="primary">{profile.specialization}</Badge>
                                                    {getVerificationBadge(profile.verificationStatus)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 mt-md-0">
                                            <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
                                                <Edit2 size={16} className="me-2" />
                                                Edit Profile
                                            </Button>
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
                                            <h6 className="text-muted mb-1">Total Patients</h6>
                                            <h3 className="mb-0 fw-bold">{profile.stats.totalPatients}</h3>
                                        </div>
                                        <div className="bg-primary bg-opacity-10 rounded p-3">
                                            <Users size={24} className="text-primary" />
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
                                            <h6 className="text-muted mb-1">Experience</h6>
                                            <h3 className="mb-0 fw-bold">{profile.experience}+ Years</h3>
                                        </div>
                                        <div className="bg-success bg-opacity-10 rounded p-3">
                                            <Briefcase size={24} className="text-success" />
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
                                            <h6 className="text-muted mb-1">Satisfaction Rate</h6>
                                            <h3 className="mb-0 fw-bold">{profile.stats.satisfactionRate}%</h3>
                                        </div>
                                        <div className="bg-warning bg-opacity-10 rounded p-3">
                                            <Star size={24} className="text-warning" />
                                        </div>
                                    </div>
                                    <ProgressBar now={profile.stats.satisfactionRate} className="mt-2" variant="warning" />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={3} md={6} className="mb-3">
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="text-muted mb-1">Consultation Fee</h6>
                                            <h3 className="mb-0 fw-bold">${profile.consultationFee}</h3>
                                        </div>
                                        <div className="bg-info bg-opacity-10 rounded p-3">
                                            <DollarSign size={24} className="text-info" />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Main Content Tabs */}
                    <Row>
                        <Col>
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <Tabs
                                        activeKey={activeTab}
                                        onSelect={(k) => setActiveTab(k)}
                                        className="mb-4"
                                        fill
                                    >
                                        <Tab eventKey="profile" title="Profile Information">
                                            <Row className="mt-3">
                                                <Col lg={6}>
                                                    <Card className="border-0 bg-light mb-4">
                                                        <Card.Body>
                                                            <h5 className="mb-3">Personal Information</h5>
                                                            <ListGroup variant="flush">
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Full Name</span>
                                                                    <strong>{profile.firstName} {profile.lastName}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Email</span>
                                                                    <strong>{profile.email}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Phone</span>
                                                                    <strong>{profile.phone}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Date of Birth</span>
                                                                    <strong>{profile.dateOfBirth}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Gender</span>
                                                                    <strong>{profile.gender}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Address</span>
                                                                    <strong>{profile.address}</strong>
                                                                </ListGroup.Item>
                                                            </ListGroup>
                                                        </Card.Body>
                                                    </Card>

                                                    <Card className="border-0 bg-light mb-4">
                                                        <Card.Body>
                                                            <h5 className="mb-3">Professional Information</h5>
                                                            <ListGroup variant="flush">
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Specialization</span>
                                                                    <strong>{profile.specialization}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Experience</span>
                                                                    <strong>{profile.experience} years</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Hospital</span>
                                                                    <strong>{profile.hospitalName}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Clinic</span>
                                                                    <strong>{profile.clinicName}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Consultation Fee</span>
                                                                    <strong>${profile.consultationFee}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Emergency Fee</span>
                                                                    <strong>${profile.emergencyFee}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Languages</span>
                                                                    <strong>{profile.languages.join(", ")}</strong>
                                                                </ListGroup.Item>
                                                            </ListGroup>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>

                                                <Col lg={6}>
                                                    <Card className="border-0 bg-light mb-4">
                                                        <Card.Body>
                                                            <h5 className="mb-3">License & Verification</h5>
                                                            <ListGroup variant="flush">
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">License Number</span>
                                                                    <strong>{profile.licenseNumber}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">License Expiry</span>
                                                                    <strong>{profile.licenseExpiry}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Board Certified</span>
                                                                    <strong>{profile.boardCertified ? "Yes" : "No"}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Malpractice Insurance</span>
                                                                    <strong>{profile.malpracticeInsurance}</strong>
                                                                </ListGroup.Item>
                                                            </ListGroup>
                                                        </Card.Body>
                                                    </Card>

                                                    <Card className="border-0 bg-light mb-4">
                                                        <Card.Body>
                                                            <h5 className="mb-3">Bio</h5>
                                                            <p>{profile.bio}</p>
                                                        </Card.Body>
                                                    </Card>

                                                    <Card className="border-0 bg-light mb-4">
                                                        <Card.Body>
                                                            <h5 className="mb-3">Awards & Recognitions</h5>
                                                            {profile.awards.map((award, idx) => (
                                                                <div key={idx} className="mb-2">
                                                                    <Award size={16} className="text-warning me-2" />
                                                                    {award}
                                                                </div>
                                                            ))}
                                                        </Card.Body>
                                                    </Card>

                                                    <Card className="border-0 bg-light">
                                                        <Card.Body>
                                                            <h5 className="mb-3">Professional Memberships</h5>
                                                            {profile.memberships.map((membership, idx) => (
                                                                <div key={idx} className="mb-2">
                                                                    <Users size={16} className="text-primary me-2" />
                                                                    {membership}
                                                                </div>
                                                            ))}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tab>

                                        <Tab eventKey="qualifications" title="Qualifications">
                                            <Row className="mt-3">
                                                {profile.qualifications.map((qual) => (
                                                    <Col md={6} key={qual.id} className="mb-3">
                                                        <Card className="border-0 shadow-sm h-100">
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                                    <GraduationCap size={24} className="text-primary" />
                                                                    <Badge bg="success">Verified</Badge>
                                                                </div>
                                                                <h6 className="fw-bold">{qual.degree}</h6>
                                                                <p className="text-muted mb-1">{qual.institution}</p>
                                                                <p className="text-muted mb-0">Year: {qual.year}</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Tab>

                                        <Tab eventKey="schedule" title="Working Hours">
                                            <div className="table-responsive mt-3">
                                                <Table className="mb-0">
                                                    <thead className="bg-light">
                                                    <tr>
                                                        <th>Day</th>
                                                        <th>Available</th>
                                                        <th>Start Time</th>
                                                        <th>End Time</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {profile.workingHours.map((day, idx) => (
                                                        <tr key={idx}>
                                                            <td className="fw-semibold">{day.day}</td>
                                                            <td>
                                                                {day.isAvailable ?
                                                                    <Badge bg="success">Available</Badge> :
                                                                    <Badge bg="danger">Closed</Badge>
                                                                }
                                                            </td>
                                                            <td>{day.start || "-"}</td>
                                                            <td>{day.end || "-"}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Tab>

                                        <Tab eventKey="banking" title="Bank Details">
                                            <Row className="mt-3">
                                                <Col md={6}>
                                                    <Card className="border-0 bg-light">
                                                        <Card.Body>
                                                            <h5 className="mb-3">Payment Information</h5>
                                                            <ListGroup variant="flush">
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Account Holder</span>
                                                                    <strong>{profile.bankDetails.accountHolder}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Bank Name</span>
                                                                    <strong>{profile.bankDetails.bankName}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Account Number</span>
                                                                    <strong>{profile.bankDetails.accountNumber}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Routing Number</span>
                                                                    <strong>{profile.bankDetails.routingNumber}</strong>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                                    <span className="text-muted">Tax ID</span>
                                                                    <strong>{profile.bankDetails.taxId}</strong>
                                                                </ListGroup.Item>
                                                            </ListGroup>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col md={6}>
                                                    <Card className="border-0 bg-light">
                                                        <Card.Body>
                                                            <h5 className="mb-3">Payment Settings</h5>
                                                            <Alert variant="info">
                                                                <Shield size={16} className="me-2" />
                                                                Your payment information is encrypted and secure
                                                            </Alert>
                                                            <div className="mt-3">
                                                                <Button variant="outline-primary" size="sm">
                                                                    Update Payment Method
                                                                </Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <h6 className="mb-3">Personal Information</h6>
                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="First Name">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.firstName}
                                        onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Last Name">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.lastName}
                                        onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Email">
                                    <Form.Control
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Phone">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.phone}
                                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Address">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.address}
                                        onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <h6 className="mb-3 mt-4">Professional Information</h6>
                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Specialization">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.specialization}
                                        onChange={(e) => setEditFormData({...editFormData, specialization: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Years of Experience">
                                    <Form.Control
                                        type="number"
                                        value={editFormData.experience}
                                        onChange={(e) => setEditFormData({...editFormData, experience: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Hospital/Clinic Name">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.hospitalName}
                                        onChange={(e) => setEditFormData({...editFormData, hospitalName: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Consultation Fee ($)">
                                    <Form.Control
                                        type="number"
                                        value={editFormData.consultationFee}
                                        onChange={(e) => setEditFormData({...editFormData, consultationFee: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="License Number">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.licenseNumber}
                                        onChange={(e) => setEditFormData({...editFormData, licenseNumber: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Bio">
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={editFormData.bio}
                                        onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleProfileUpdate}>
                        <Save size={18} className="me-2" />
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Profile;