import React, { useRef, useEffect } from "react";
import { Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import { FaChartLine, FaPhoneAlt, FaTrophy, FaFileAlt, FaComments, FaWhatsapp, FaCheck } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from "react-chartjs-2";

// Registra i componenti necessari di Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DashboardSection = ({ statistics, conversations, documents, changeSection }) => {
  // Refs per i grafici
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  // Cleanup dei grafici quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (barChartRef.current && barChartRef.current.chartInstance) {
        barChartRef.current.chartInstance.destroy();
      }
      if (lineChartRef.current && lineChartRef.current.chartInstance) {
        lineChartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  // Dati per i grafici
  const performanceData = {
    labels: ["Ascolto", "Empatia", "Chiarezza", "Negoz.", "Chiusura"],
    datasets: [
      {
        label: "Performance",
        data: [75, 65, 80, 60, 70],
        backgroundColor: "#67A1CE",
        borderColor: "#2779bd",
        borderWidth: 1,
      },
    ],
  };

  const conversationTrendData = {
    labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    datasets: [
      {
        label: "Conversazioni",
        data: [3, 5, 2, 8, 6, 0, 1],
        borderColor: "#67A1CE",
        backgroundColor: "rgba(103, 161, 206, 0.2)",
        tension: 0.4,
        fill: true
      },
      {
        label: "Messaggi",
        data: [12, 19, 8, 22, 15, 0, 4],
        borderColor: "#68d391",
        backgroundColor: "rgba(104, 211, 145, 0.2)",
        tension: 0.4,
        fill: true
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Funzione per gestire la selezione della conversazione
  const handleSelectConversation = (conversation) => {
    // Implementa la logica per gestire la selezione della conversazione
    console.log("Conversazione selezionata:", conversation);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 main-title">Dashboard</h2>
      </div>

      {/* Welcome Card */}
      <Card className="welcome-card mb-4">
        <Card.Body className="p-3 p-md-4">
          <Row className="align-items-center">
            <Col lg={9} md={8} sm={12}>
              <h2 className="welcome-title mb-2">
                Benvenuto nel tuo Direttore Vendite AI
              </h2>
              <p className="welcome-text mb-0">
                Monitora le tue performance di vendita, analizza le
                chiamate e migliora le tue capacità con l'assistenza AI.
              </p>
            </Col>
            <Col lg={3} md={4} sm={12} className="mt-3 mt-md-0 text-center text-md-end">
              <Button className="tour-button rounded-pill">
                <FaChartLine className="me-2" /> Tour Guidato
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col lg={4} md={6} sm={12}>
          <Card className="stat-card h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">Totale Chiamate Analizzate</p>
                  <h3 className="stat-value">{statistics.totalCalls || 0}</h3>
                </div>
                <div className="stat-icon phone-icon">
                  <FaPhoneAlt />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card className="stat-card h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">Tasso di Successo Medio</p>
                  <h3 className="stat-value">{(statistics.successRate || 0).toFixed(2)}%</h3>
                </div>
                <div className="stat-icon success-icon">
                  <FaChartLine />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={12} sm={12}>
          <Card className="stat-card h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">Venditore Top</p>
                  <h3 className="stat-value top-seller">{statistics.topSeller || "N/A"}</h3>
                </div>
                <div className="stat-icon trophy-icon">
                  <FaTrophy />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Row Stats */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6} sm={12}>
          <Card className="stat-card h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">Totale Conversazioni</p>
                  <h3 className="stat-value">{statistics.conversationCount || 0}</h3>
                </div>
                <div className="stat-icon phone-icon">
                  <FaComments />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={12}>
          <Card className="stat-card h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">Messaggi Scambiati</p>
                  <h3 className="stat-value">{statistics.messageCount || 0}</h3>
                </div>
                <div className="stat-icon success-icon">
                  <FaWhatsapp />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={12}>
          <Card className="stat-card h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">Documenti Caricati</p>
                  <h3 className="stat-value">{statistics.documentCount || 0}</h3>
                </div>
                <div className="stat-icon trophy-icon">
                  <FaFileAlt />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={12}>
          <Card className="stat-card h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">Documenti Elaborati</p>
                  <h3 className="stat-value">{statistics.processedDocuments || 0}</h3>
                </div>
                <div className="stat-icon success-icon">
                  <FaCheck />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={6} md={12}>
          <Card className="h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex align-items-center mb-3">
                <FaChartLine className="me-2 text-primary" />
                <h4 className="mb-0">Analisi Performance</h4>
              </div>
              <div style={{ height: "300px" }}>
                <Bar 
                  data={performanceData} 
                  options={chartOptions} 
                  id="performance-chart"
                  key="performance-chart"
                  ref={barChartRef}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={12} className="mt-4 mt-lg-0">
          <Card className="h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex align-items-center mb-3">
                <FaChartLine className="me-2 text-primary" />
                <h4 className="mb-0">Trend Conversazioni</h4>
              </div>
              <div style={{ height: "300px" }}>
                <Line 
                  data={conversationTrendData} 
                  options={lineChartOptions} 
                  id="trend-chart"
                  key="trend-chart"
                  ref={lineChartRef}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row>
        <Col lg={6} md={12}>
          <Card className="mb-4">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Conversazioni Recenti</h5>
                <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => changeSection("conversations")}>
                  Vedi tutte
                </Button>
              </div>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Stato</th>
                      <th>Ultimo messaggio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversations && conversations.length > 0 ? (
                      conversations.slice(0, 3).map((conv) => (
                        <tr key={conv.id} onClick={() => handleSelectConversation(conv)} style={{ cursor: "pointer" }}>
                          <td>{conv.telefonoCliente}</td>
                          <td>
                            <Badge bg={conv.stato === "attiva" ? "success" : "secondary"}>
                              {conv.stato === "attiva" ? "Attiva" : "Chiusa"}
                            </Badge>
                          </td>
                          <td className="text-truncate" style={{ maxWidth: "200px" }}>
                            {conv.ultimoMessaggioTesto}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">Nessuna conversazione disponibile</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card>
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Documenti Recenti</h5>
                <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => changeSection("documents")}>
                  Vedi tutti
                </Button>
              </div>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Titolo</th>
                      <th>Tipo</th>
                      <th>Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents && documents.length > 0 ? (
                      documents.slice(0, 3).map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.titolo}</td>
                          <td>
                            {doc.tipoContenuto && doc.tipoContenuto.includes("pdf") ? "PDF" : 
                             doc.tipoContenuto && doc.tipoContenuto.includes("word") ? "Word" : 
                             doc.tipoContenuto && doc.tipoContenuto.includes("plain") ? "Testo" : "Documento"}
                          </td>
                          <td>
                            <Badge bg={doc.elaborato ? "success" : "warning"}>
                              {doc.elaborato ? "Elaborato" : "In attesa"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">Nessun documento disponibile</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Improvement Areas */}
      <Card className="mt-4">
        <Card.Body className="p-3 p-md-4">
          <h5 className="mb-3">Aree di Miglioramento Chiave:</h5>
          <Row className="g-3">
            <Col md={6} sm={12}>
              <div className="improvement-area">
                <h6>Negoziazione</h6>
                <p>
                  Prova a migliorare le tue tecniche di negoziazione per
                  aumentare il tasso di conversione.
                </p>
              </div>
            </Col>
            <Col md={6} sm={12}>
              <div className="improvement-area">
                <h6>Empatia</h6>
                <p>
                  Cerca di comprendere meglio le esigenze del cliente per
                  creare un rapporto più solido.
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default DashboardSection;