import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import "../index.css";


function Home(){
    return ( 
    <>

         <Container className="home">
        <Row>
            <Col xs= {3}>
          <Card className="side-bar">
            <Card.Body>
                <h1>Side bar</h1>
            </Card.Body>
          </Card>
          </Col>
            <Col md={9}>
          <Card className="contenuto-p">
            <Card.Body>
                <h1>Contenuto Prencipale</h1>
            </Card.Body>
          </Card>
          </Col>
          </Row>
            
        </Container>
    </>
    )
   
}

export default Home;