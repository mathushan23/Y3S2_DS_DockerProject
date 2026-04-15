import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, Button, Modal, Form, Table, Badge,
    Alert, FloatingLabel, InputGroup, Spinner, Toast, ToastContainer,
    Tabs, Tab, ListGroup, ProgressBar
} from 'react-bootstrap';
import {
    Plus, Edit, Trash2, Calendar, Clock, CheckCircle, XCircle,
    AlertCircle, ChevronLeft, ChevronRight, Save, X, Users,
    UserCheck, UserX, Ban, Clock as ClockIcon, Calendar as CalendarIcon,
    Settings, RefreshCw, Filter, Download, Printer
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Availability = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';

    // State for availability data
    const [availability, setAvailability] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showUnavailableModal, setShowUnavailableModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [activeTab, setActiveTab] = useState('weekly');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");

    // Form data for availability
    const [formData, setFormData] = useState({
        dayOfWeek: "Monday",
        startTime: "09:00",
        endTime: "17:00",
        breakStart: "13:00",
        breakEnd: "14:00",
        slotDuration: 30,
        maxPatientsPerSlot: 1,
        isRecurring: true,
        validFrom: "",
        validTo: "",
        location: "Main Clinic",
        notes: "",
    });

    // Form data for unavailable dates
    const [unavailableData, setUnavailableData] = useState({
        date: "",
        reason: "",
        isFullDay: true,
        startTime: "",
        endTime: "",
    });

    // Days of week
    const daysOfWeek = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    // Time slots generation
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            timeSlots.push(`${hour}:${minute}`);
        }
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const { token } = useAuth();

    // Load data from API on mount
    useEffect(() => {
        if (user?.id) {
            loadAvailabilityData();
        }
    }, [user?.id]);

    const loadAvailabilityData = async () => {
        setLoading(true);
        try {
            // In a real app, you would fetch these from separate endpoints
            // For now, these are part of the doctor profile or separate tables
            const response = await fetch(`${API_BASE_URL}/api/doctors/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const doctorData = await response.json();
                if (doctorData.workingHours) setAvailability(doctorData.workingHours);
                // if (doctorData.unavailableDates) setUnavailableDates(doctorData.unavailableDates);
            }
            
            // Also fetch booked slots from appointment service
            const appointmentsResponse = await fetch(`${API_BASE_URL}/api/appointments?doctorId=${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (appointmentsResponse.ok) {
                const appointments = await appointmentsResponse.json();
                setBookedSlots(appointments.map(app => {
                    // Extract time to calculate an estimated end time (30 mins later)
                    const [date, time] = app.appointmentDateTime.split('T');
                    const [hours, mins] = time.split(':').map(Number);
                    const totalMins = hours * 60 + mins + 30;
                    const endHours = Math.floor(totalMins / 60).toString().padStart(2, '0');
                    const endMins = (totalMins % 60).toString().padStart(2, '0');
                    
                    return {
                        ...app,
                        date: date,
                        startTime: time.substring(0, 5),
                        endTime: `${endHours}:${endMins}`,
                    };
                }));
            }
        } catch (error) {
            console.error("Error loading availability:", error);
            showNotification("Failed to load availability data", "danger");
        } finally {
            setLoading(false);
        }
    };

    const saveAvailabilityData = async (updatedAvailability) => {
        setLoading(true);
        try {
            // Update the doctor profile with new working hours
            const response = await fetch(`${API_BASE_URL}/api/doctors/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ workingHours: updatedAvailability })
            });
            if (response.ok) {
                setAvailability(updatedAvailability);
                showNotification("Schedule updated!", "success");
            }
        } catch (error) {
            console.error("Error saving availability:", error);
            showNotification("Failed to save schedule", "danger");
        } finally {
            setLoading(false);
        }
    };

    const saveUnavailableDates = async (updatedUnavailableDates) => {
        // Implementation for saving unavailable dates
        setUnavailableDates(updatedUnavailableDates);
        showNotification("Unavailable dates updated!", "success");
    };

    const handleOpenModal = (availabilityItem = null) => {
        if (availabilityItem) {
            setEditingId(availabilityItem.id);
            setFormData({
                dayOfWeek: availabilityItem.dayOfWeek,
                startTime: availabilityItem.startTime,
                endTime: availabilityItem.endTime,
                breakStart: availabilityItem.breakStart,
                breakEnd: availabilityItem.breakEnd,
                slotDuration: availabilityItem.slotDuration,
                maxPatientsPerSlot: availabilityItem.maxPatientsPerSlot,
                isRecurring: availabilityItem.isRecurring,
                validFrom: availabilityItem.validFrom || "",
                validTo: availabilityItem.validTo || "",
                location: availabilityItem.location,
                notes: availabilityItem.notes || "",
            });
        } else {
            setEditingId(null);
            setFormData({
                dayOfWeek: "Monday",
                startTime: "09:00",
                endTime: "17:00",
                breakStart: "13:00",
                breakEnd: "14:00",
                slotDuration: 30,
                maxPatientsPerSlot: 1,
                isRecurring: true,
                validFrom: "",
                validTo: "",
                location: "Main Clinic",
                notes: "",
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    const handleSaveAvailability = () => {
        if (!formData.dayOfWeek || !formData.startTime || !formData.endTime) {
            showNotification("Please fill all required fields", "danger");
            return;
        }

        const availabilityData = {
            id: editingId || Date.now(),
            dayOfWeek: formData.dayOfWeek,
            startTime: formData.startTime,
            endTime: formData.endTime,
            breakStart: formData.breakStart,
            breakEnd: formData.breakEnd,
            slotDuration: formData.slotDuration,
            maxPatientsPerSlot: formData.maxPatientsPerSlot,
            isRecurring: formData.isRecurring,
            validFrom: formData.validFrom,
            validTo: formData.validTo,
            location: formData.location,
            notes: formData.notes,
        };

        let updatedAvailability;
        if (editingId) {
            updatedAvailability = availability.map(a =>
                a.id === editingId ? availabilityData : a
            );
            showNotification("Availability updated successfully!", "success");
        } else {
            updatedAvailability = [...availability, availabilityData];
            showNotification("Availability added successfully!", "success");
        }

        saveAvailabilityData(updatedAvailability);
        handleCloseModal();
    };

    const handleDeleteAvailability = (id) => {
        if (window.confirm("Are you sure you want to delete this availability schedule?")) {
            const updatedAvailability = availability.filter(a => a.id !== id);
            saveAvailabilityData(updatedAvailability);
            showNotification("Availability deleted successfully!", "success");
        }
    };

    const handleOpenUnavailableModal = () => {
        setUnavailableData({
            date: "",
            reason: "",
            isFullDay: true,
            startTime: "",
            endTime: "",
        });
        setShowUnavailableModal(true);
    };

    const handleSaveUnavailableDate = () => {
        if (!unavailableData.date) {
            showNotification("Please select a date", "danger");
            return;
        }

        const newUnavailableDate = {
            id: Date.now(),
            ...unavailableData,
        };

        const updatedUnavailableDates = [...unavailableDates, newUnavailableDate];
        saveUnavailableDates(updatedUnavailableDates);
        showNotification("Unavailable date marked successfully!", "success");
        setShowUnavailableModal(false);
    };

    const handleRemoveUnavailableDate = (id) => {
        if (window.confirm("Remove this unavailable date?")) {
            const updatedUnavailableDates = unavailableDates.filter(d => d.id !== id);
            saveUnavailableDates(updatedUnavailableDates);
            showNotification("Unavailable date removed", "success");
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const appointment = bookedSlots.find(a => a.id === appointmentId);
            if (!appointment) return;

            // Prepare the full request body as required by the backend's PUT endpoint
            const updateRequest = {
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                patientName: appointment.patientName,
                doctorName: appointment.doctorName,
                specialty: appointment.specialty,
                appointmentDateTime: appointment.appointmentDateTime,
                status: newStatus.toUpperCase(),
                patientEmail: appointment.patientEmail,
                patientPhone: appointment.patientPhone,
                location: appointment.location,
                notes: appointment.notes,
                billingStatus: appointment.billingStatus,
                fee: appointment.fee,
                reason: appointment.reason,
                symptoms: appointment.symptoms
            };

            const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateRequest)
            });

            if (response.ok) {
                showNotification(`Appointment ${newStatus} successfully!`, "success");
                loadAvailabilityData(); // Refresh the data
            } else {
                showNotification("Failed to update appointment status", "danger");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            showNotification("Connection error while updating status", "danger");
        }
    };

    const generateTimeSlotsForDay = (availabilityItem, date) => {
        const slots = [];
        let currentTime = availabilityItem.startTime;
        const endTime = availabilityItem.endTime;
        const breakStart = availabilityItem.breakStart;
        const breakEnd = availabilityItem.breakEnd;

        while (currentTime < endTime) {
            // Skip break time
            if (currentTime >= breakStart && currentTime < breakEnd) {
                currentTime = breakEnd;
                continue;
            }

            const slotEnd = addMinutes(currentTime, availabilityItem.slotDuration);
            if (slotEnd > endTime) break;

            // Check if slot is booked
            const isBooked = bookedSlots.some(slot =>
                slot.date === date &&
                slot.startTime === currentTime &&
                slot.doctorId === user?.id
            );

            // Check if date is unavailable
            const isUnavailable = unavailableDates.some(ud =>
                ud.date === date && (ud.isFullDay ||
                    (ud.startTime <= currentTime && ud.endTime >= slotEnd))
            );

            slots.push({
                startTime: currentTime,
                endTime: slotEnd,
                isBooked,
                isUnavailable,
            });

            currentTime = slotEnd;
        }

        return slots;
    };

    const addMinutes = (time, minutes) => {
        const [hours, mins] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    };

    const getWeekDates = (date) => {
        const weekDates = [];
        const current = new Date(date);
        const day = current.getDay();
        const diff = current.getDate() - day + (day === 0 ? -6 : 1);

        for (let i = 0; i < 7; i++) {
            const dateObj = new Date(current.setDate(diff + i));
            weekDates.push({
                date: dateObj.toISOString().split('T')[0],
                dayName: daysOfWeek[i],
                fullDate: dateObj,
            });
        }
        return weekDates;
    };

    const changeWeek = (direction) => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentWeek(newDate);
    };

    const weekDates = getWeekDates(currentWeek);

    const showNotification = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const getDayAvailability = (dayName) => {
        return availability.find(a => a.dayOfWeek === dayName);
    };

    const getBookedSlotsCount = (date) => {
        return bookedSlots.filter(slot => slot.date === date).length;
    };

    const getTotalSlotsForDay = (date, dayName) => {
        const availabilityItem = getDayAvailability(dayName);
        if (!availabilityItem) return 0;
        const slots = generateTimeSlotsForDay(availabilityItem, date);
        return slots.length;
    };

    // Stats calculation
    const totalWeeklySlots = weekDates.reduce((total, day) => {
        const availabilityItem = getDayAvailability(day.dayName);
        if (availabilityItem) {
            const slots = generateTimeSlotsForDay(availabilityItem, day.date);
            return total + slots.length;
        }
        return total;
    }, 0);

    const totalBookedThisWeek = weekDates.reduce((total, day) => {
        return total + getBookedSlotsCount(day.date);
    }, 0);

    const availabilityPercentage = totalWeeklySlots > 0
        ? ((totalWeeklySlots - totalBookedThisWeek) / totalWeeklySlots) * 100
        : 0;

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
                                    <h2 className="mb-1 fw-bold">Availability Management</h2>
                                    <p className="text-muted mb-0">
                                        Manage your working hours, time slots, and appointments
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-danger"
                                        onClick={handleOpenUnavailableModal}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <Ban size={18} />
                                        Mark Unavailable
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleOpenModal()}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Add Schedule
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
                                    <h6 className="text-muted mb-1">Weekly Available Slots</h6>
                                    <h3 className="mb-0 fw-bold">{totalWeeklySlots}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 rounded p-3">
                                    <ClockIcon size={24} className="text-primary" />
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
                                    <h6 className="text-muted mb-1">Booked Appointments</h6>
                                    <h3 className="mb-0 fw-bold">{totalBookedThisWeek}</h3>
                                </div>
                                <div className="bg-success bg-opacity-10 rounded p-3">
                                    <UserCheck size={24} className="text-success" />
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
                                    <h6 className="text-muted mb-1">Available Slots Left</h6>
                                    <h3 className="mb-0 fw-bold">{totalWeeklySlots - totalBookedThisWeek}</h3>
                                </div>
                                <div className="bg-info bg-opacity-10 rounded p-3">
                                    <CalendarIcon size={24} className="text-info" />
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
                                    <h6 className="text-muted mb-1">Utilization Rate</h6>
                                    <h3 className="mb-0 fw-bold">{Math.round(availabilityPercentage)}%</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <Users size={24} className="text-warning" />
                                </div>
                            </div>
                            <ProgressBar
                                now={availabilityPercentage}
                                className="mt-3"
                                variant={availabilityPercentage > 70 ? 'danger' : 'success'}
                            />
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
                                <Tab eventKey="weekly" title="Weekly Schedule">
                                    {/* Week Navigation */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <Button variant="outline-secondary" onClick={() => changeWeek(-1)}>
                                            <ChevronLeft size={18} /> Previous Week
                                        </Button>
                                        <h5 className="mb-0">
                                            Week of {weekDates[0]?.fullDate?.toLocaleDateString()} -
                                            {weekDates[6]?.fullDate?.toLocaleDateString()}
                                        </h5>
                                        <Button variant="outline-secondary" onClick={() => changeWeek(1)}>
                                            Next Week <ChevronRight size={18} />
                                        </Button>
                                    </div>

                                    {/* Weekly Schedule Grid */}
                                    <div className="table-responsive">
                                        <Table bordered className="text-center">
                                            <thead className="bg-light">
                                            <tr>
                                                <th style={{ width: '100px' }}>Time</th>
                                                {weekDates.map((day, idx) => (
                                                    <th key={idx}>
                                                        {day.dayName}<br />
                                                        <small className="text-muted">{day.date}</small>
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {timeSlots.map((timeSlot, idx) => {
                                                const hasAnySlot = weekDates.some(day => {
                                                    const availabilityItem = getDayAvailability(day.dayName);
                                                    return availabilityItem &&
                                                        timeSlot >= availabilityItem.startTime &&
                                                        timeSlot < availabilityItem.endTime &&
                                                        (timeSlot < availabilityItem.breakStart || timeSlot >= availabilityItem.breakEnd);
                                                });

                                                if (!hasAnySlot) return null;

                                                return (
                                                    <tr key={idx}>
                                                        <td className="bg-light fw-semibold">{timeSlot}</td>
                                                        {weekDates.map((day, dayIdx) => {
                                                            const availabilityItem = getDayAvailability(day.dayName);
                                                            const isAvailable = availabilityItem &&
                                                                timeSlot >= availabilityItem.startTime &&
                                                                timeSlot < availabilityItem.endTime &&
                                                                (timeSlot < availabilityItem.breakStart || timeSlot >= availabilityItem.breakEnd);

                                                            const isBooked = bookedSlots.some(slot =>
                                                                slot.date === day.date &&
                                                                slot.startTime === timeSlot
                                                            );

                                                            const isUnavailable = unavailableDates.some(ud =>
                                                                ud.date === day.date &&
                                                                (ud.isFullDay ||
                                                                    (ud.startTime <= timeSlot && ud.endTime >= addMinutes(timeSlot, 30)))
                                                            );

                                                            let status = 'available';
                                                            let bgColor = '#d4edda';
                                                            let statusText = 'Available';

                                                            if (isUnavailable) {
                                                                status = 'unavailable';
                                                                bgColor = '#f8d7da';
                                                                statusText = 'Unavailable';
                                                            } else if (isBooked) {
                                                                status = 'booked';
                                                                bgColor = '#fff3cd';
                                                                statusText = 'Booked';
                                                            } else if (!isAvailable) {
                                                                status = 'off';
                                                                bgColor = '#e9ecef';
                                                                statusText = 'Off Hours';
                                                            }

                                                            return (
                                                                <td
                                                                    key={dayIdx}
                                                                    style={{
                                                                        backgroundColor: bgColor,
                                                                        cursor: status === 'available' ? 'pointer' : 'default'
                                                                    }}
                                                                    onClick={() => {
                                                                        if (status === 'available') {
                                                                            showNotification(`Slot available for booking at ${timeSlot}`, 'info');
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="small">
                                                                        {status === 'available' && <CheckCircle size={14} className="text-success" />}
                                                                        {status === 'booked' && <UserCheck size={14} className="text-warning" />}
                                                                        {status === 'unavailable' && <XCircle size={14} className="text-danger" />}
                                                                        <div className="mt-1">{statusText}</div>
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>

                                <Tab eventKey="schedules" title="Schedules">
                                    <div className="table-responsive">
                                        <Table hover className="mb-0">
                                            <thead className="bg-light">
                                            <tr>
                                                <th>Day</th>
                                                <th>Working Hours</th>
                                                <th>Break Time</th>
                                                <th>Slot Duration</th>
                                                <th>Max Patients/Slot</th>
                                                <th>Location</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {availability.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="fw-semibold">{item.dayOfWeek}</td>
                                                    <td>{item.startTime} - {item.endTime}</td>
                                                    <td>{item.breakStart} - {item.breakEnd}</td>
                                                    <td>{item.slotDuration} min</td>
                                                    <td>{item.maxPatientsPerSlot}</td>
                                                    <td>{item.location}</td>
                                                    <td>
                                                        <Badge bg="success">Active</Badge>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => handleOpenModal(item)}
                                                            >
                                                                <Edit size={16} />
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteAvailability(item.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>

                                <Tab eventKey="unavailable" title="Unavailable Dates">
                                    <div className="mb-3">
                                        <Button variant="danger" onClick={handleOpenUnavailableModal}>
                                            <Ban size={18} className="me-2" />
                                            Mark Date as Unavailable
                                        </Button>
                                    </div>
                                    <div className="table-responsive">
                                        <Table hover>
                                            <thead className="bg-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Time Range</th>
                                                <th>Reason</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {unavailableDates.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.date}</td>
                                                    <td>
                                                        {item.isFullDay ?
                                                            <Badge bg="danger">Full Day</Badge> :
                                                            <Badge bg="warning">Partial Day</Badge>
                                                        }
                                                    </td>
                                                    <td>
                                                        {item.isFullDay ?
                                                            "All Day" :
                                                            `${item.startTime} - ${item.endTime}`
                                                        }
                                                    </td>
                                                    <td>{item.reason || "No reason provided"}</td>
                                                    <td>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleRemoveUnavailableDate(item.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>

                                <Tab eventKey="booked" title="Booked Appointments">
                                    <div className="table-responsive">
                                        <Table hover>
                                            <thead className="bg-light">
                                            <tr>
                                                <th>Patient</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {bookedSlots.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        <div className="text-muted">
                                                            <CalendarIcon size={48} className="mb-3" />
                                                            <p>No booked appointments yet</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                bookedSlots.map((slot) => (
                                                    <tr key={slot.id}>
                                                        <td>
                                                            <div className="fw-semibold">{slot.patientName}</div>
                                                            <small className="text-muted">{slot.patientEmail}</small>
                                                        </td>
                                                        <td>{slot.date}</td>
                                                        <td>{slot.startTime} - {slot.endTime}</td>
                                                        <td>{slot.appointmentType || "Regular"}</td>
                                                        <td>
                                                            <Badge bg={
                                                                slot.status === 'CONFIRMED' ? 'success' : 
                                                                slot.status === 'REJECTED' ? 'danger' : 
                                                                'warning'
                                                            }>
                                                                {slot.status || "PENDING"}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                {slot.status === 'PENDING' && (
                                                                    <>
                                                                        <Button 
                                                                            variant="outline-success" 
                                                                            size="sm" 
                                                                            className="d-flex align-items-center gap-1"
                                                                            onClick={() => handleUpdateAppointmentStatus(slot.id, 'confirmed')}
                                                                        >
                                                                            <UserCheck size={14} /> Accept
                                                                        </Button>
                                                                        <Button 
                                                                            variant="outline-danger" 
                                                                            size="sm" 
                                                                            className="d-flex align-items-center gap-1"
                                                                            onClick={() => handleUpdateAppointmentStatus(slot.id, 'rejected')}
                                                                        >
                                                                            <UserX size={14} /> Reject
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                <Button variant="outline-info" size="sm" className="d-flex align-items-center gap-1">
                                                                    <Settings size={14} /> Details
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add/Edit Availability Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {editingId ? 'Edit Schedule' : 'Add New Schedule'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Day of Week *">
                                    <Form.Select
                                        value={formData.dayOfWeek}
                                        onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                                    >
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Location">
                                    <Form.Control
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        placeholder="Enter location"
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Start Time *">
                                    <Form.Control
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="End Time *">
                                    <Form.Control
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Break Start">
                                    <Form.Control
                                        type="time"
                                        value={formData.breakStart}
                                        onChange={(e) => setFormData({...formData, breakStart: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Break End">
                                    <Form.Control
                                        type="time"
                                        value={formData.breakEnd}
                                        onChange={(e) => setFormData({...formData, breakEnd: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FloatingLabel label="Slot Duration (minutes)">
                                    <Form.Control
                                        type="number"
                                        value={formData.slotDuration}
                                        onChange={(e) => setFormData({...formData, slotDuration: parseInt(e.target.value)})}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6}>
                                <FloatingLabel label="Max Patients per Slot">
                                    <Form.Control
                                        type="number"
                                        value={formData.maxPatientsPerSlot}
                                        onChange={(e) => setFormData({...formData, maxPatientsPerSlot: parseInt(e.target.value)})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    label="Recurring Weekly"
                                    checked={formData.isRecurring}
                                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                                />
                            </Col>
                        </Row>

                        {!formData.isRecurring && (
                            <Row className="mb-3">
                                <Col md={6}>
                                    <FloatingLabel label="Valid From">
                                        <Form.Control
                                            type="date"
                                            value={formData.validFrom}
                                            onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={6}>
                                    <FloatingLabel label="Valid To">
                                        <Form.Control
                                            type="date"
                                            value={formData.validTo}
                                            onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        )}

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Additional Notes">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    placeholder="Add any additional notes"
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveAvailability}>
                        <Save size={18} className="me-2" />
                        {editingId ? 'Update Schedule' : 'Save Schedule'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Mark Unavailable Modal */}
            <Modal show={showUnavailableModal} onHide={() => setShowUnavailableModal(false)}>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Mark Date as Unavailable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Date *">
                                <Form.Control
                                    type="date"
                                    value={unavailableData.date}
                                    onChange={(e) => setUnavailableData({...unavailableData, date: e.target.value})}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Full Day Unavailable"
                                checked={unavailableData.isFullDay}
                                onChange={(e) => setUnavailableData({...unavailableData, isFullDay: e.target.checked})}
                            />
                        </Form.Group>

                        {!unavailableData.isFullDay && (
                            <Row className="mb-3">
                                <Col md={6}>
                                    <FloatingLabel label="Start Time">
                                        <Form.Control
                                            type="time"
                                            value={unavailableData.startTime}
                                            onChange={(e) => setUnavailableData({...unavailableData, startTime: e.target.value})}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={6}>
                                    <FloatingLabel label="End Time">
                                        <Form.Control
                                            type="time"
                                            value={unavailableData.endTime}
                                            onChange={(e) => setUnavailableData({...unavailableData, endTime: e.target.value})}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        )}

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Reason (Optional)">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={unavailableData.reason}
                                    onChange={(e) => setUnavailableData({...unavailableData, reason: e.target.value})}
                                    placeholder="e.g., Vacation, Conference, Sick Leave"
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUnavailableModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSaveUnavailableDate}>
                        <Ban size={18} className="me-2" />
                        Mark as Unavailable
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Availability;