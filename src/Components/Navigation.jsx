import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

function Navigation() {
  return (
    <Navbar className="pb-5" expand="lg">
      <Container>
        <Navbar.Brand href="#" className="text-white">
          Yovendo-AI
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Navigation;
