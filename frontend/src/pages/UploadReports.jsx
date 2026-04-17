import React, { useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import { UploadCloud, File, X, CheckCircle } from "lucide-react";
import "../styles.css";

export default function UploadReports() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    setError(null);
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload only PDF, JPG, or PNG formats.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds the maximum limit of 10MB.");
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    if (!title.trim()) {
      setError("Please add a title for this report.");
      return;
    }

    setIsUploading(true);
    setError(null);

    // TODO: Wire up to Patient endpoint once the API supports multipart payload!
    // Simulating API integration delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setSelectedFile(null);
      setTitle("");
      setDescription("");

      // Clear the success message after 5 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
    }, 2000);
  };

  return (
    <Container fluid className="p-4 dashboard-container animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Upload Reports</h2>
          <p className="text-muted mb-0">Securely store your medical reports and documents here.</p>
        </div>
      </div>

      <Row>
        <Col lg={8} xl={7}>
          <Card className="shadow-sm border-0 border-radius-15">
            <Card.Body className="p-4">
              
              {error && <Alert variant="danger">{error}</Alert>}
              {uploadSuccess && (
                <Alert variant="success" className="d-flex align-items-center">
                   <CheckCircle className="me-2" size={20} />
                   Document uploaded successfully!
                </Alert>
              )}

              <Form onSubmit={handleUpload}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Report Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. Blood Test Results 2024" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Description (Optional)</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Add any extra notes about this document..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Attach File <span className="text-danger">*</span></Form.Label>
                  
                  {!selectedFile ? (
                    <div 
                      className={`upload-drop-zone ${dragActive ? "drag-active" : ""}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={inputRef}
                        type="file"
                        className="d-none"
                        accept=".pdf, image/jpeg, image/png"
                        onChange={handleChange}
                      />
                      <div className="text-center py-5">
                        <UploadCloud size={48} className="text-primary mb-3" />
                        <h5>Drag & Drop your file here</h5>
                        <p className="text-muted mb-3">or</p>
                        <Button variant="outline-primary" onClick={onButtonClick}>
                          Browse Files
                        </Button>
                        <div className="mt-3 text-muted" style={{ fontSize: "0.85rem" }}>
                          Supported formats: PDF, JPG, PNG (Max size: 10MB)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="selected-file-preview p-3 border rounded d-flex justify-content-between align-items-center bg-light">
                      <div className="d-flex align-items-center">
                        <File className="text-primary me-3" size={32} />
                        <div>
                          <h6 className="mb-0">{selectedFile.name}</h6>
                          <small className="text-muted">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</small>
                        </div>
                      </div>
                      <Button variant="link" className="text-danger p-0" onClick={handleRemoveFile}>
                        <X size={20} />
                      </Button>
                    </div>
                  )}
                </Form.Group>

                <div className="d-flex justify-content-end">
                   <Button 
                     variant="primary" 
                     className="px-4 py-2 fw-bold" 
                     type="submit"
                     disabled={isUploading || !selectedFile}
                   >
                     {isUploading ? (
                       <>
                         <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                         Uploading...
                       </>
                     ) : "Upload Report"}
                   </Button>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
