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
    GraduationCap, Star, Users as UsersIcon, Activity, Heart,
    Link as LinkIcon
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    // Empty profile structure
    const [profile, setProfile] = useState({
        id: null,
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        specialty: "",
        experience: 0,
        hospitalName: "",
        clinicName: "",
        consultationFee: 0,
        emergencyFee: 0,
        bio: "",
        licenseNumber: "",
        licenseExpiry: "",
        verificationStatus: "pending",
        boardCertified: false,
        profilePhotoUrl: "",
        languages: ["English"],
        qualifications: [],
        workingHours: [],
        awards: [],
        memberships: [],
        stats: {
            totalPatients: 0,
            successfulTreatments: 0,
            satisfactionRate: 0,
            averageRating: 0,
            totalReviews: 0
        },
        bankDetails: {
            accountHolder: "",
            bankName: "",
            accountNumber: "",
            routingNumber: "",
            taxId: ""
        }
    });

    const [editFormData, setEditFormData] = useState({ ...profile });

    // Load profile data from API on mount
    useEffect(() => {
        if (user?.id && token) {
            loadProfileData();
        }
    }, [user?.id, token]);

    const loadProfileData = async () => {
        setLoading(true);
        try {
            console.log("Fetching doctor profile for ID:", user.id);

            const response = await fetch(`${API_BASE_URL}/api/doctors/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Doctor profile data received:", data);

                // Map backend data to frontend structure
                const mappedProfile = {
                    id: data.id,
                    fullName: data.fullName || "",
                    email: data.email || user.email || "",
                    phone: data.phone || "",
                    dateOfBirth: data.dateOfBirth || "",
                    gender: data.gender || "",
                    address: data.address || "",
                    specialty: data.specialty || "",
                    experience: data.experience || 0,
                    hospitalName: data.hospitalName || "",
                    clinicName: data.clinicName || "",
                    consultationFee: data.consultationFee || 0,
                    emergencyFee: data.emergencyFee || 0,
                    bio: data.bio || "",
                    licenseNumber: data.licenseNumber || "",
                    licenseExpiry: data.licenseExpiry || "",
                    verificationStatus: data.verificationStatus || "pending",
                    boardCertified: data.boardCertified || false,
                    profilePhotoUrl: data.profilePhotoUrl || "",
                    languages: data.languages || ["English"],
                    qualifications: data.qualifications || [],
                    workingHours: data.workingHours || [
                        { day: "Monday", start: "09:00", end: "17:00", isAvailable: true },
                        { day: "Tuesday", start: "09:00", end: "17:00", isAvailable: true },
                        { day: "Wednesday", start: "09:00", end: "17:00", isAvailable: true },
                        { day: "Thursday", start: "09:00", end: "17:00", isAvailable: true },
                        { day: "Friday", start: "09:00", end: "16:00", isAvailable: true },
                        { day: "Saturday", start: "10:00", end: "14:00", isAvailable: true },
                        { day: "Sunday", start: "", end: "", isAvailable: false }
                    ],
                    awards: data.awards || [
                        "Excellence in Patient Care",
                        "Community Service Award"
                    ],
                    memberships: data.memberships || [
                        "Sri Lanka Medical Association",
                        "International College of Physicians"
                    ],
                    stats: {
                        totalPatients: data.totalPatients || 0,
                        successfulTreatments: data.successfulTreatments || 0,
                        satisfactionRate: data.satisfactionRate || 0,
                        averageRating: data.averageRating || 0,
                        totalReviews: data.totalReviews || 0
                    },
                    bankDetails: {
                        accountHolder: data.fullName || "",
                        bankName: "Default Bank",
                        accountNumber: "****1234",
                        routingNumber: "****5678",
                        taxId: "***-**-7890"
                    }
                };

                setProfile(mappedProfile);
                setEditFormData(mappedProfile);

                // Load saved photo from localStorage if exists
                const savedPhoto = localStorage.getItem(`doctor_photo_${user.id}`);
                if (savedPhoto) {
                    setPhotoPreview(savedPhoto);
                }
            } else if (response.status === 404) {
                console.log("Doctor profile not found, will create on first save");
                // Initialize with user data from auth
                const initialProfile = {
                    ...profile,
                    id: user.id,
                    fullName: user.fullName || "",
                    email: user.email || "",
                };
                setProfile(initialProfile);
                setEditFormData(initialProfile);
                showNotification("Please complete your profile information", "info");
            } else {
                console.error("Failed to load profile:", response.status);
                showNotification("Failed to load profile data", "danger");
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            showNotification("Failed to connect to server", "danger");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        setSaving(true);
        try {
            // Prepare data for backend
            const updatePayload = {
                id: user.id,
                fullName: editFormData.fullName,
                email: editFormData.email,
                phone: editFormData.phone,
                specialty: editFormData.specialty,
                address: editFormData.address,
                dateOfBirth: editFormData.dateOfBirth,
                gender: editFormData.gender,
                experience: editFormData.experience,
                hospitalName: editFormData.hospitalName,
                clinicName: editFormData.clinicName,
                consultationFee: editFormData.consultationFee,
                emergencyFee: editFormData.emergencyFee,
                bio: editFormData.bio,
                licenseNumber: editFormData.licenseNumber,
                licenseExpiry: editFormData.licenseExpiry,
                verificationStatus: editFormData.verificationStatus,
                boardCertified: editFormData.boardCertified,
                profilePhotoUrl: editFormData.profilePhotoUrl,
                workingHours: editFormData.workingHours,
                qualifications: editFormData.qualifications,
                totalPatients: editFormData.stats?.totalPatients || 0,
                successfulTreatments: editFormData.stats?.successfulTreatments || 0,
                satisfactionRate: editFormData.stats?.satisfactionRate || 0,
                averageRating: editFormData.stats?.averageRating || 0,
                totalReviews: editFormData.stats?.totalReviews || 0
            };

            let response;

            // Check if profile exists (has ID and was fetched)
            if (profile.id && profile.fullName) {
                // Update existing profile
                response = await fetch(`${API_BASE_URL}/api/doctors/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatePayload)
                });
            } else {
                // Create new profile
                response = await fetch(`${API_BASE_URL}/api/doctors`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatePayload)
                });
            }

            if (response.ok) {
                const updatedData = await response.json();
                console.log("Profile saved successfully:", updatedData);

                // Update local state
                setProfile({
                    ...editFormData,
                    id: updatedData.id || user.id
                });

                showNotification("Profile updated successfully!", "success");
                setShowEditModal(false);
                loadProfileData(); // Reload fresh data
            } else {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                showNotification(errorData.message || "Failed to update profile", "danger");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showNotification("Failed to update profile: " + error.message, "danger");
        } finally {
            setSaving(false);
        }
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
                // Save to localStorage
                localStorage.setItem(`doctor_photo_${user.id}`, reader.result);
                showNotification("Profile photo updated!", "success");
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        setProfilePhoto(null);
        localStorage.removeItem(`doctor_photo_${user.id}`);
        showNotification("Profile photo removed", "info");
    };

    const showNotification = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const getVerificationBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'verified':
                return <Badge bg="success" className="d-flex align-items-center gap-1"><CheckCircle size={14} /> Verified</Badge>;
            case 'pending':
                return <Badge bg="warning" className="d-flex align-items-center gap-1"><Clock size={14} /> Pending</Badge>;
            case 'rejected':
                return <Badge bg="danger" className="d-flex align-items-center gap-1"><XCircle size={14} /> Rejected</Badge>;
            default:
                return <Badge bg="secondary">{status || "Pending"}</Badge>;
        }
    };

    if (loading) {
        return (
            <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading profile...</p>
                </div>
            </Container>
        );
    }

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
                            <h2 className="mb-0">{profile.fullName}</h2>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <Badge bg="primary">{profile.specialty || "General Physician"}</Badge>
                                            {getVerificationBadge(profile.verificationStatus)}
                                        </div>
                                        <div className="mt-1">
                                            <small className="text-muted">{profile.email}</small>
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
                                    <h3 className="mb-0 fw-bold">{profile.stats?.totalPatients || 0}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 rounded p-3">
                                    <UsersIcon size={24} className="text-primary" />
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
                                    <h3 className="mb-0 fw-bold">{profile.experience || 0}+ Years</h3>
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
                                    <h3 className="mb-0 fw-bold">{profile.stats?.satisfactionRate || 0}%</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <Star size={24} className="text-warning" />
                                </div>
                            </div>
                            <ProgressBar now={profile.stats?.satisfactionRate || 0} className="mt-2" variant="warning" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-1">Consultation Fee</h6>
                                    <h3 className="mb-0 fw-bold">${profile.consultationFee || 0}</h3>
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
                                                            <strong>{profile.fullName}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Email</span>
                                                            <strong>{profile.email}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Phone</span>
                                                            <strong>{profile.phone || "Not provided"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Date of Birth</span>
                                                            <strong>{profile.dateOfBirth || "Not provided"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Gender</span>
                                                            <strong>{profile.gender || "Not provided"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Address</span>
                                                            <strong>{profile.address || "Not provided"}</strong>
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
                                                            <strong>{profile.specialty || "General"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Experience</span>
                                                            <strong>{profile.experience} years</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Hospital</span>
                                                            <strong>{profile.hospitalName || "Not specified"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Clinic</span>
                                                            <strong>{profile.clinicName || "Not specified"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Consultation Fee</span>
                                                            <strong>${profile.consultationFee}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Emergency Fee</span>
                                                            <strong>${profile.emergencyFee}</strong>
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
                                                            <strong>{profile.licenseNumber || "Not provided"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">License Expiry</span>
                                                            <strong>{profile.licenseExpiry || "Not provided"}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="bg-light d-flex justify-content-between">
                                                            <span className="text-muted">Board Certified</span>
                                                            <strong>{profile.boardCertified ? "Yes" : "No"}</strong>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>

                                            <Card className="border-0 bg-light mb-4">
                                                <Card.Body>
                                                    <h5 className="mb-3">Bio</h5>
                                                    <p>{profile.bio || "No bio provided yet."}</p>
                                                </Card.Body>
                                            </Card>

                                            {profile.qualifications && profile.qualifications.length > 0 && (
                                                <Card className="border-0 bg-light mb-4">
                                                    <Card.Body>
                                                        <h5 className="mb-3">Qualifications</h5>
                                                        {profile.qualifications.map((qual, idx) => (
                                                            <div key={idx} className="mb-2">
                                                                <GraduationCap size={16} className="text-primary me-2" />
                                                                <strong>{qual.degree}</strong> - {qual.institution} ({qual.year})
                                                            </div>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            )}
                                        </Col>
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
                                            {profile.workingHours && profile.workingHours.map((day, idx) => (
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
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <h6 className="mb-3">Personal Information</h6>
                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Full Name">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.fullName || ""}
                                        onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Email">
                                    <Form.Control
                                        type="email"
                                        value={editFormData.email || ""}
                                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Phone">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.phone || ""}
                                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Date of Birth">
                                    <Form.Control
                                        type="date"
                                        value={editFormData.dateOfBirth || ""}
                                        onChange={(e) => setEditFormData({...editFormData, dateOfBirth: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Gender">
                                    <Form.Select
                                        value={editFormData.gender || ""}
                                        onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <FloatingLabel label="Address">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.address || ""}
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
                                        value={editFormData.specialty || ""}
                                        onChange={(e) => setEditFormData({...editFormData, specialty: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Years of Experience">
                                    <Form.Control
                                        type="number"
                                        value={editFormData.experience || 0}
                                        onChange={(e) => setEditFormData({...editFormData, experience: parseInt(e.target.value) || 0})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Hospital/Clinic Name">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.hospitalName || ""}
                                        onChange={(e) => setEditFormData({...editFormData, hospitalName: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Consultation Fee ($)">
                                    <Form.Control
                                        type="number"
                                        value={editFormData.consultationFee || 0}
                                        onChange={(e) => setEditFormData({...editFormData, consultationFee: parseFloat(e.target.value) || 0})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Emergency Fee ($)">
                                    <Form.Control
                                        type="number"
                                        value={editFormData.emergencyFee || 0}
                                        onChange={(e) => setEditFormData({...editFormData, emergencyFee: parseFloat(e.target.value) || 0})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="License Number">
                                    <Form.Control
                                        type="text"
                                        value={editFormData.licenseNumber || ""}
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
                                        value={editFormData.bio || ""}
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
                    <Button variant="primary" onClick={handleProfileUpdate} disabled={saving}>
                        {saving ? <Spinner size="sm" className="me-2" /> : <Save size={18} className="me-2" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Profile;
