import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Gear, PersonFill } from "react-bootstrap-icons";

function Home() {
  return (
    <>
      <Container>
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
