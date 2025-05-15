import React from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Gear, PersonFill } from "react-bootstrap-icons";

function Home() {
  const messages = [{ message: "ciao" }, { message: "come va?" }];

  return (
    <>
      <Container>
        {messages.map((msg, index) => (
          <Row className="d-flex flex-row-reverse justify-content-center mb-1">
            <Col key={index} sm={2}>
              <Card className="mt-5 bg-secondary">
                <Card.Body>
                  <Card.Text>{msg.message}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}

        <Row>
          <Col sm={2}>
            <Row>
              <Col sm={1}>
                <Button variant="outline-secondary">
                  <Gear color="white"></Gear>
                  Impostazioni
                </Button>
                <Button variant="outline-secondary" className="mt-3">
                  <PersonFill color="white"></PersonFill>
                  Accedi
                </Button>
              </Col>
            </Row>
          </Col>
          <Col>
            <Form.Label htmlFor="chat" className="text-white fs-1">
              {" "}
              Benvenuto
            </Form.Label>
            <Form.Control type="text" id="chat" placeholder="Fai una domanda" />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
