import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Table, Badge,
  Alert, Spinner, ProgressBar, Tabs, Tab,
  ListGroup, Dropdown, ButtonGroup
} from 'react-bootstrap';
import {
  Calendar, Clock, Users, Video, FileText, CheckCircle,
  XCircle, Activity, Heart, DollarSign, TrendingUp,
  UserCheck, UserX, Phone, Mail, MapPin, Award,
  Briefcase, Star, MessageCircle, Bell, Settings,
  ChevronRight, Download, Printer, RefreshCw
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingRequests: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    satisfactionRate: 98,
    upcomingTelemedicine: 0,
    pendingPrescriptions: 0
  });

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);

    // Load data from localStorage or use mock data
    const storedAppointments = localStorage.getItem('appointments');
    const storedPatients = localStorage.getItem('patients');
    const storedPrescriptions = localStorage.getItem('prescriptions');
    const storedTelemedicine = localStorage.getItem('telemedicineRequests');

    // Mock dashboard data
    const mockStats = {
      totalPatients: 1247,
      todayAppointments: 8,
      pendingRequests: 3,
      completedAppointments: 1247,
      totalRevenue: 18750,
      satisfactionRate: 98,
      upcomingTelemedicine: 4,
      pendingPrescriptions: 12
    };

    const mockTodayAppointments = [
      {
        id: 1,
        patientName: "John Doe",
        time: "09:00 AM",
        type: "In-person",
        status: "confirmed",
        avatar: "JD"
      },
      {
        id: 2,
        patientName: "Jane Smith",
        time: "10:30 AM",
        type: "Telemedicine",
        status: "confirmed",
        avatar: "JS"
      },
      {
        id: 3,
        patientName: "Robert Johnson",
        time: "01:00 PM",
        type: "In-person",
        status: "pending",
        avatar: "RJ"
      },
      {
        id: 4,
        patientName: "Emily Davis",
        time: "02:30 PM",
        type: "Follow-up",
        status: "confirmed",
        avatar: "ED"
      },
      {
        id: 5,
        patientName: "Michael Brown",
        time: "04:00 PM",
        type: "Telemedicine",
        status: "confirmed",
        avatar: "MB"
      }
    ];

    const mockRecentPatients = [
      {
        id: 1,
        name: "John Doe",
        lastVisit: "2024-03-15",
        condition: "Hypertension",
        nextAppointment: "2024-04-15",
        status: "active"
      },
      {
        id: 2,
        name: "Jane Smith",
        lastVisit: "2024-03-14",
        condition: "Asthma",
        nextAppointment: "2024-04-14",
        status: "active"
      },
      {
        id: 3,
        name: "Robert Johnson",
        lastVisit: "2024-03-12",
        condition: "Diabetes",
        nextAppointment: "2024-04-12",
        status: "follow-up"
      },
      {
        id: 4,
        name: "Emily Davis",
        lastVisit: "2024-03-10",
        condition: "Migraine",
        nextAppointment: "2024-04-10",
        status: "active"
      }
    ];

    const mockPendingRequests = [
      {
        id: 1,
        patientName: "Sarah Wilson",
        type: "Telemedicine",
        requestedDate: "2024-03-20",
        requestedTime: "11:00 AM",
        reason: "Headache and dizziness"
      },
      {
        id: 2,
        patientName: "David Lee",
        type: "In-person",
        requestedDate: "2024-03-20",
        requestedTime: "02:00 PM",
        reason: "Chest pain"
      },
      {
        id: 3,
        patientName: "Maria Garcia",
        type: "Telemedicine",
        requestedDate: "2024-03-21",
        requestedTime: "09:30 AM",
        reason: "Follow-up consultation"
      }
    ];

    const mockUpcomingSchedule = [
      {
        id: 1,
        date: "2024-03-20",
        day: "Tomorrow",
        appointments: 6,
        telemedicine: 2
      },
      {
        id: 2,
        date: "2024-03-21",
        day: "Wednesday",
        appointments: 8,
        telemedicine: 3
      },
      {
        id: 3,
        date: "2024-03-22",
        day: "Thursday",
        appointments: 5,
        telemedicine: 1
      }
    ];

    const mockRecentActivities = [
      {
        id: 1,
        action: "Prescription issued",
        patient: "John Doe",
        time: "10 minutes ago",
        type: "prescription"
      },
      {
        id: 2,
        action: "Appointment completed",
        patient: "Jane Smith",
        time: "1 hour ago",
        type: "appointment"
      },
      {
        id: 3,
        action: "Lab report reviewed",
        patient: "Robert Johnson",
        time: "3 hours ago",
        type: "report"
      },
      {
        id: 4,
        action: "Telemedicine session",
        patient: "Emily Davis",
        time: "5 hours ago",
        type: "telemedicine"
      }
    ];

    const mockTopMedicines = [
      { name: "Lisinopril", count: 45, percentage: 28 },
      { name: "Metformin", count: 38, percentage: 24 },
      { name: "Atorvastatin", count: 32, percentage: 20 },
      { name: "Amoxicillin", count: 25, percentage: 16 },
      { name: "Albuterol", count: 20, percentage: 12 }
    ];

    setStats(mockStats);
    setTodayAppointments(mockTodayAppointments);
    setRecentPatients(mockRecentPatients);
    setPendingRequests(mockPendingRequests);
    setUpcomingSchedule(mockUpcomingSchedule);
    setRecentActivities(mockRecentActivities);
    setTopMedicines(mockTopMedicines);

    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'completed':
        return <Badge bg="info">Completed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const QuickActionCard = ({ icon, title, count, color, link }) => (
      <Col lg={3} md={6} className="mb-3">
        <Card
            className="shadow-sm border-0 h-100 cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(link)}
        >
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted mb-1">{title}</h6>
                <h3 className="mb-0 fw-bold">{count}</h3>
              </div>
              <div className={`bg-${color} bg-opacity-10 rounded p-3`}>
                {icon}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
  );

  if (loading) {
    return (
        <Container fluid className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard...</p>
        </Container>
    );
  }

  return (
      <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-0 bg-primary text-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h2 className="mb-1 fw-bold">Welcome back, Dr. {user?.name || 'Sarah Wilson'}! 👋</h2>
                    <p className="mb-0 opacity-75">
                      Here's your practice overview for today. You have {stats.todayAppointments} appointments scheduled.
                    </p>
                  </div>
                  <Button variant="light" onClick={() => navigate('/appointments')}>
                    <Calendar size={18} className="me-2" />
                    View Schedule
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <QuickActionCard
              icon={<Users size={24} className="text-primary" />}
              title="Total Patients"
              count={stats.totalPatients}
              color="primary"
              link="/patient-report"
          />
          <QuickActionCard
              icon={<Calendar size={24} className="text-success" />}
              title="Today's Appointments"
              count={stats.todayAppointments}
              color="success"
              link="/appointments"
          />
          <QuickActionCard
              icon={<Video size={24} className="text-info" />}
              title="Telemedicine"
              count={stats.upcomingTelemedicine}
              color="info"
              link="/telemedicine"
          />
          <QuickActionCard
              icon={<FileText size={24} className="text-warning" />}
              title="Pending Prescriptions"
              count={stats.pendingPrescriptions}
              color="warning"
              link="/prescriptions"
          />
        </Row>

        <Row className="mb-4">
          <Col lg={8}>
            {/* Today's Appointments */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 pt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 fw-bold">Today's Appointments</h5>
                    <p className="text-muted small mb-0">You have {stats.todayAppointments} appointments today</p>
                  </div>
                  <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate('/appointments')}
                  >
                    View All <ChevronRight size={16} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {todayAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-4 py-3 align-middle">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                  style={{ width: '32px', height: '32px', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                {appointment.avatar}
                              </div>
                              <div>
                                <div className="fw-semibold">{appointment.patientName}</div>
                                <small className="text-muted">ID: #{appointment.id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="fw-semibold">{appointment.time}</div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <Badge bg={appointment.type === 'Telemedicine' ? 'info' : 'secondary'}>
                              {appointment.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            {getStatusBadge(appointment.status)}
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <ButtonGroup size="sm">
                              <Button
                                  variant="outline-primary"
                                  onClick={() => {
                                    if (appointment.type === 'Telemedicine') {
                                      navigate('/telemedicine');
                                    } else {
                                      navigate('/appointments');
                                    }
                                  }}
                              >
                                {appointment.type === 'Telemedicine' ? 'Join' : 'View'}
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            {/* Recent Patients */}
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 pt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 fw-bold">Recent Patients</h5>
                    <p className="text-muted small mb-0">Patients you've recently treated</p>
                  </div>
                  <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate('/patient-report')}
                  >
                    View All <ChevronRight size={16} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Last Visit</th>
                      <th className="px-4 py-3">Condition</th>
                      <th className="px-4 py-3">Next Appointment</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentPatients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-4 py-3 align-middle">
                            <div className="fw-semibold">{patient.name}</div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            {formatDate(patient.lastVisit)}
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <Badge bg="info">{patient.condition}</Badge>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            {formatDate(patient.nextAppointment)}
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate('/patient-report')}
                            >
                              View Records
                            </Button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Pending Requests */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 pt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 fw-bold">Pending Requests</h5>
                    <p className="text-muted small mb-0">Awaiting your response</p>
                  </div>
                  <Badge bg="warning">{stats.pendingRequests}</Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {pendingRequests.map((request) => (
                      <ListGroup.Item key={request.id} className="p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-semibold">{request.patientName}</div>
                            <small className="text-muted">
                              {request.type} • {request.requestedDate} at {request.requestedTime}
                            </small>
                            <div className="mt-1">
                              <small className="text-muted">{request.reason}</small>
                            </div>
                          </div>
                          <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                if (request.type === 'Telemedicine') {
                                  navigate('/telemedicine');
                                } else {
                                  navigate('/appointments');
                                }
                              }}
                          >
                            Review
                          </Button>
                        </div>
                      </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

            {/* Upcoming Schedule */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 pt-4">
                <h5 className="mb-0 fw-bold">Upcoming Schedule</h5>
              </Card.Header>
              <Card.Body>
                {upcomingSchedule.map((day) => (
                    <div key={day.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <span className="fw-semibold">{day.day}</span>
                          <small className="text-muted ms-2">{day.date}</small>
                        </div>
                        <Badge bg="primary">{day.appointments} appointments</Badge>
                      </div>
                      <ProgressBar
                          now={(day.appointments / 10) * 100}
                          variant="success"
                          className="mb-2"
                      />
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">
                          <Video size={12} className="me-1" />
                          {day.telemedicine} Telemedicine
                        </small>
                        <small className="text-muted">
                          <Users size={12} className="me-1" />
                          {day.appointments - day.telemedicine} In-person
                        </small>
                      </div>
                    </div>
                ))}
              </Card.Body>
            </Card>

            {/* Recent Activities */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 pt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Recent Activities</h5>
                  <RefreshCw size={16} className="text-muted cursor-pointer" />
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {recentActivities.map((activity) => (
                      <ListGroup.Item key={activity.id} className="p-3">
                        <div className="d-flex gap-3">
                          <div>
                            {activity.type === 'prescription' && <FileText size={20} className="text-primary" />}
                            {activity.type === 'appointment' && <CheckCircle size={20} className="text-success" />}
                            {activity.type === 'report' && <Activity size={20} className="text-info" />}
                            {activity.type === 'telemedicine' && <Video size={20} className="text-warning" />}
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-semibold">{activity.action}</div>
                            <small className="text-muted">
                              Patient: {activity.patient} • {activity.time}
                            </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

            {/* Top Prescribed Medicines */}
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 pt-4">
                <h5 className="mb-0 fw-bold">Top Prescribed Medicines</h5>
              </Card.Header>
              <Card.Body>
                {topMedicines.map((medicine, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-semibold">{medicine.name}</span>
                        <span className="text-muted">{medicine.count} prescriptions</span>
                      </div>
                      <ProgressBar
                          now={medicine.percentage}
                          variant="primary"
                          className="mb-2"
                      />
                    </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions Footer */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0 bg-primary text-white">
              <Card.Body className="p-4">
                <div className="text-center">
                  <h5 className="mb-3">Quick Actions</h5>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Button
                        variant="light"
                        onClick={() => navigate('/prescriptions')}
                        className="d-flex align-items-center gap-2"
                    >
                      <FileText size={18} />
                      New Prescription
                    </Button>
                    <Button
                        variant="outline-light"
                        onClick={() => navigate('/availability')}
                        className="d-flex align-items-center gap-2"
                    >
                      <Calendar size={18} />
                      Manage Schedule
                    </Button>
                    <Button
                        variant="outline-light"
                        onClick={() => navigate('/telemedicine')}
                        className="d-flex align-items-center gap-2"
                    >
                      <Video size={18} />
                      Start Telemedicine
                    </Button>
                    <Button
                        variant="outline-light"
                        onClick={() => navigate('/patient-report')}
                        className="d-flex align-items-center gap-2"
                    >
                      <Users size={18} />
                      View Patients
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .cursor-pointer:hover {
          transform: translateY(-5px);
        }
      `}</style>
      </Container>
  );
};

export default DoctorDashboard;