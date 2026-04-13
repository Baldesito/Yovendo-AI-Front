import React, { useRef, useEffect, useState } from "react";
import { Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import { FaChartLine, FaPhoneAlt, FaTrophy, FaFileAlt, FaComments, FaWhatsapp, FaCheck } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const DashboardSection = ({ statistics, conversations, documents, changeSection }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => { setIsBrowser(true); }, []);

  useEffect(() => {
    return () => {
      //eslint-disable-next-line
      if (barChartRef.current) { const chart = ChartJS.getChart(barChartRef.current); if (chart) chart.destroy(); } //eslint-disable-next-line
      if (lineChartRef.current) { const chart = ChartJS.getChart(lineChartRef.current); if (chart) chart.destroy(); }
    };
  }, []);

  const performanceData = {
    labels: ["Ascolto", "Empatia", "Chiarezza", "Negoz.", "Chiusura"],
    datasets: [{
      label: "Performance",
      data: [75, 65, 80, 60, 70],
      backgroundColor: "rgba(103, 161, 206, 0.6)",
      borderColor: "#67A1CE",
      borderWidth: 1,
    }],
  };

  const conversationTrendData = {
    labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    datasets: [
      { label: "Conversazioni", data: [3, 5, 2, 8, 6, 0, 1], borderColor: "#67A1CE", backgroundColor: "rgba(103, 161, 206, 0.2)", tension: 0.4, fill: true },
      { label: "Messaggi", data: [12, 19, 8, 22, 15, 0, 4], borderColor: "#68d391", backgroundColor: "rgba(104, 211, 145, 0.2)", tension: 0.4, fill: true }
    ],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    color: 'rgba(255,255,255,0.7)',
    scales: { 
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)', callback: function (value) { return value + "%"; } } },
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)' } }
    },
    plugins: { legend: { display: false } },
  };

  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false, color: 'rgba(255,255,255,0.7)',
    scales: { 
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)' } },
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)' } }
    },
    plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)' } } }
  };

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h2 className="mb-0 fw-bold">Dashboard</h2>
      </div>

      <Card className="glass-card mb-4 border-0">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col lg={9} md={8} sm={12}>
              <h2 className="mb-2 fw-bold">Benvenuto nel tuo Direttore Vendite AI</h2>
              <p className="mb-0 opacity-75">Monitora le tue performance di vendita, analizza le chiamate e migliora le tue capacità con l'assistenza AI.</p>
            </Col>
            <Col lg={3} md={4} sm={12} className="mt-3 mt-md-0 text-center text-md-end">
              <Button variant="outline-light" className="rounded-pill px-4 py-2 hover-primary">
                <FaChartLine className="me-2" /> Tour Guidato
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Prima Riga */}
      <Row className="mb-4 g-3">
        {[
          { label: "Chiamate Analizzate", value: statistics.totalCalls || 0, icon: <FaPhoneAlt />, iconClass: "phone-icon" },
          { label: "Tasso di Successo", value: `${(statistics.successRate || 0).toFixed(2)}%`, icon: <FaChartLine />, iconClass: "success-icon" },
          { label: "Venditore Top", value: statistics.topSeller || "N/A", icon: <FaTrophy />, iconClass: "trophy-icon" }
        ].map((stat, idx) => (
          <Col lg={4} md={6} sm={12} key={idx}>
            <Card className="glass-card h-100 border-0">
              <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                <div>
                  <p className="opacity-75 small text-uppercase mb-1">{stat.label}</p>
                  <h3 className="fw-bold mb-0 text-white">{stat.value}</h3>
                </div>
                <div className={`stat-icon ${stat.iconClass}`}>{stat.icon}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Stats Seconda Riga */}
      <Row className="mb-4 g-3">
        {[
          { label: "Totale Conversazioni", value: statistics.conversationCount || 0, icon: <FaComments />, iconClass: "phone-icon" },
          { label: "Messaggi Scambiati", value: statistics.messageCount || 0, icon: <FaWhatsapp />, iconClass: "success-icon" },
          { label: "Documenti Caricati", value: statistics.documentCount || 0, icon: <FaFileAlt />, iconClass: "trophy-icon" },
          { label: "Documenti Elaborati", value: statistics.processedDocuments || 0, icon: <FaCheck />, iconClass: "success-icon" }
        ].map((stat, idx) => (
          <Col lg={3} md={6} sm={12} key={idx}>
            <Card className="glass-card h-100 border-0">
              <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                <div>
                  <p className="opacity-75 small text-uppercase mb-1" style={{fontSize: '0.75rem'}}>{stat.label}</p>
                  <h3 className="fw-bold mb-0 text-white fs-4">{stat.value}</h3>
                </div>
                <div className={`stat-icon ${stat.iconClass}`} style={{minWidth: '40px', minHeight: '40px', fontSize: '1.2rem'}}>{stat.icon}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row className="mb-4 g-4">
        <Col lg={6} md={12}>
          <Card className="glass-card h-100 border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FaChartLine className="me-3 text-primary fs-4" />
                <h5 className="mb-0 fw-bold">Analisi Performance</h5>
              </div>
              <div style={{ height: "300px" }}>
                {isBrowser && <Bar data={performanceData} options={chartOptions} ref={barChartRef} />}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card className="glass-card h-100 border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FaChartLine className="me-3 text-primary fs-4" />
                <h5 className="mb-0 fw-bold">Trend Conversazioni</h5>
              </div>
              <div style={{ height: "300px" }}>
                {isBrowser && <Line data={conversationTrendData} options={lineChartOptions} ref={lineChartRef} />}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabelle */}
      <Row className="g-4 mb-4">
        <Col lg={6} md={12}>
          <Card className="glass-card h-100 border-0">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold text-secondary">Conversazioni Recenti</h5>
                <Button variant="outline-light" size="sm" className="rounded-pill opacity-75 hover-primary" onClick={() => changeSection("conversations")}>
                  Vedi tutte
                </Button>
              </div>
              <div className="table-responsive">
                <Table hover className="glass-table mb-0">
                  <thead><tr><th>Cliente</th><th>Stato</th><th>Ultimo messaggio</th></tr></thead>
                  <tbody>
                    {conversations && conversations.length > 0 ? (
                      conversations.slice(0, 3).map((conv) => (
                        <tr key={conv.id} style={{ cursor: "pointer" }}>
                          <td>{conv.telefonoCliente}</td>
                          <td><Badge bg={conv.stato === "attiva" ? "success" : "secondary"}>{conv.stato === "attiva" ? "Attiva" : "Chiusa"}</Badge></td>
                          <td className="text-truncate opacity-75" style={{ maxWidth: "150px" }}>{conv.ultimoMessaggioTesto}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" className="text-center opacity-50 py-3">Nessuna conversazione</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={12}>
          <Card className="glass-card h-100 border-0">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold text-secondary">Documenti Recenti</h5>
                <Button variant="outline-light" size="sm" className="rounded-pill opacity-75 hover-primary" onClick={() => changeSection("documents")}>
                  Vedi tutti
                </Button>
              </div>
              <div className="table-responsive">
                <Table hover className="glass-table mb-0">
                  <thead><tr><th>Titolo</th><th>Tipo</th><th>Stato</th></tr></thead>
                  <tbody>
                    {documents && documents.length > 0 ? (
                      documents.slice(0, 3).map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.titolo}</td>
                          <td className="opacity-75">{doc.tipoContenuto?.includes("pdf") ? "PDF" : doc.tipoContenuto?.includes("word") ? "Word" : "Testo"}</td>
                          <td><Badge bg={doc.elaborato ? "success" : "warning"} className="text-dark">{doc.elaborato ? "Elaborato" : "In attesa"}</Badge></td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" className="text-center opacity-50 py-3">Nessun documento</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

{/* Aree Miglioramento Recuperate e ILLUMINATE */}
      <Card className="glass-card border-0 mb-4">
        <Card.Body className="p-4">
          <h5 className="mb-4 fw-bold text-white">Aree di Miglioramento Chiave:</h5>
          <Row className="g-4">
            <Col md={6} sm={12}>
              {/* Sfondo più scuro per far risaltare il bianco */}
              <div className="p-4 rounded-4 shadow-sm" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <h6 className="text-warning fw-bold mb-2 fs-5">Negoziazione</h6>
                <p className="mb-0 text-white" style={{ fontSize: '0.95rem', lineHeight: '1.5', letterSpacing: '0.3px' }}>
                  Prova a migliorare le tue tecniche di negoziazione per aumentare il tasso di conversione.
                </p>
              </div>
            </Col>
            <Col md={6} sm={12}>
              <div className="p-4 rounded-4 shadow-sm" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <h6 className="text-info fw-bold mb-2 fs-5">Empatia</h6>
                <p className="mb-0 text-white" style={{ fontSize: '0.95rem', lineHeight: '1.5', letterSpacing: '0.3px' }}>
                  Cerca di comprendere meglio le esigenze del cliente per creare un rapporto più solido.
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardSection;