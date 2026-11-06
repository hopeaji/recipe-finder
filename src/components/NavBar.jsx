import { Navbar, Nav, Container, Badge } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

// Top navigation bar. React Bootstrap gives the look (and the mobile "hamburger" menu);
// react-router's NavLink changes the screen without reloading the page.
export default function NavBar({ favoriteCount }) {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="sm" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          🍲 Recipe Finder
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Search
            </Nav.Link>
            <Nav.Link as={NavLink} to="/favorites">
              Favourites{' '}
              <Badge bg="warning" text="dark" pill>
                {favoriteCount}
              </Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
