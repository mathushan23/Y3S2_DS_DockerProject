import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { User, Upload, CheckCircle } from "lucide-react";
import api from "../../api";

export default function ProfileModal({ show, onHide, user }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    
    // Background Fields
    height: "",
    weight: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    allergies: "",
    chronicConditions: "",
    profilePictureUrl: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (show && user?.id) {
      fetchProfile();
    } else if (!show) {
      // Reset flags on close
      setError(null);
      setSuccess(null);
      setFormErrors({});
    }
  }, [show, user]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/patients/${user.id}`);
      // Fill the fields, setting defaults if data is missing
      setFormData({
        firstName: response.firstName || user.firstName || "",
        lastName: response.lastName || user.lastName || "",
        email: response.email || user.email || "",
        phoneNumber: response.phoneNumber || "",
        dateOfBirth: response.dateOfBirth || "",
        gender: response.gender || "",
        bloodGroup: response.bloodGroup || "",
        address: response.address || "",
        
        height: response.height || "",
        weight: response.weight || "",
        emergencyContactName: response.emergencyContactName || "",
        emergencyContactNumber: response.emergencyContactNumber || "",
        allergies: response.allergies || "",
        chronicConditions: response.chronicConditions || "",
        profilePictureUrl: response.profilePictureUrl || ""
      });
    } catch (err) {
      // If 404, it might mean the layout is trying to fetch a patient config that hasn't been created yet.
      // We will fallback to user session payload.
      if (err.status !== 404) {
        setError("Could not load profile details. " + err.message);
      } else {
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || ""
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "Valid email is required";
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.bloodGroup) errors.bloodGroup = "Blood group is required";
    if (!formData.address.trim()) errors.address = "Address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;
    
    setIsSaving(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        
        // Background payload constraints
        height: formData.height || null,
        weight: formData.weight || null,
        emergencyContactName: formData.emergencyContactName || null,
        emergencyContactNumber: formData.emergencyContactNumber || null,
        allergies: formData.allergies || null,
        chronicConditions: formData.chronicConditions || null
      };

      await api.put(`/api/patients/${user.id}`, payload);
      
      setSuccess("Profile updated successfully!");
      // Optionally close after timeout
      setTimeout(() => {
        onHide();
      }, 2000);
      
    } catch (err) {
      if (err.status === 404) {
         // Create the record initially if updates are hitting 404s
         try {
           await api.post(`/api/patients`, payload);
           setSuccess("Profile created successfully!");
           setTimeout(() => { onHide(); }, 2000);
         } catch (createErr) {
           setError("Failed to create profile: " + createErr.message);
         }
      } else {
         setError("Failed to update profile: " + err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="profile-modal"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-primary">Patient Profile</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading profile...</p>
          </div>
        ) : (
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success" className="d-flex align-items-center">
                <CheckCircle size={20} className="me-2" />
                {success}
              </Alert>
            )}

            <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
              <div className="position-relative">
                <div 
                  className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '80px', height: '80px' }}
                >
                  <User size={40} />
                </div>
                <Button 
                  variant="light" 
                  size="sm" 
                  className="position-absolute bottom-0 end-0 rounded-circle p-1 shadow-sm border"
                  title="Upload picture (Optional)"
                >
                  <Upload size={14} className="text-primary" />
                </Button>
              </div>
              <div>
                <h5 className="mb-0 fw-bold">{formData.firstName} {formData.lastName}</h5>
                <p className="text-muted mb-0 small">Update your personal details below.</p>
              </div>
            </div>

            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">First Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      isInvalid={!!formErrors.firstName}
                      placeholder="Jane"
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.firstName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Last Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      isInvalid={!!formErrors.lastName}
                      placeholder="Doe"
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.lastName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Email <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!formErrors.email}
                      placeholder="jane@example.com"
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Phone Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      isInvalid={!!formErrors.phoneNumber}
                      placeholder="1234567890"
                      maxLength="14"
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.phoneNumber}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Date of Birth <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      isInvalid={!!formErrors.dateOfBirth}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.dateOfBirth}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Gender <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      isInvalid={!!formErrors.gender}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formErrors.gender}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Blood Group <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="bloodGroup" 
                      value={formData.bloodGroup} 
                      onChange={handleChange}
                      isInvalid={!!formErrors.bloodGroup}
                    >
                      <option value="">Select...</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formErrors.bloodGroup}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Address <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!formErrors.address}
                      placeholder="123 Health Ave..."
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.address}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
        <Button variant="light" onClick={onHide} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving || isLoading} className="px-4 fw-bold shadow-sm">
          {isSaving ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Saving...
            </>
          ) : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
