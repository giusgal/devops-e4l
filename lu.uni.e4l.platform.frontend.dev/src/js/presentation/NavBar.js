import Navbar from "react-bootstrap/Navbar";
import uni_logo from "../../public/img/uni-lu-logo.svg";
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import {connect} from "react-redux";
import {logout} from "../action/userAction";
import {Trans} from "react-i18next";
import i18n from "../i18n";
import React from "react";
import {changeWebsiteLanguage} from "../action/userAction";
import {NavDropdown} from "react-bootstrap";
import "../../css/navbar.css";
import logoimage from '../../public/img/logo-s4l-try.jpg'; // Import the cookie image
import logoINV from '../../public/img/logo_invert.png'; // Import the cookie image
import logoREG from '../../public/img/logo-reg.png'; // Import the cookie image

@connect((store) => {
    return {
        userReducer: store.userReducer,
        questionnaireReducer: store.questionnaireReducer,
        navReducer: store.navReducer,
        seminarReducer: store.seminarReducer,
    };
})
export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reloaded: 0,
        };
    }

    logout = () => {
        this.props.dispatch(logout());
    };

    getCurrentLanguage = () => {
        return this.props.userReducer.lang.toUpperCase();
    };

    componentDidMount() {
    }

      componentWillMount() {

        document.documentElement.setAttribute("data-theme", this.props.questionnaireReducer.kid ? "kid" : "adult-invert");
       }
    changeLanguage = (lang) => {
        this.props.dispatch(changeWebsiteLanguage(lang));
    };
//{document.documentElement.getAttribute("data-theme")=="adult-invert" && <img src={logo_invert} alt="Logo" style={{width: "4em"}} />}
    render() {
        let navButtonsEnabled = this.props.navReducer.isNavButtonsDisabled == "true";

        return (
            <div className="container containerE4l">
                <Navbar className="bg-white" expand="lg">
                    <Link to="/">
                        <Navbar.Brand>
                            <img src={uni_logo} style={{width: "5em"}}/>
                            {document.documentElement.getAttribute("data-theme")=="adult-invert" ? <img src={logoINV} alt="Logo" style={{width: "4em"}} /> : <img src={logoREG} alt="Logo" style={{width: "4em"}} />}
                        </Navbar.Brand>
                    </Link>
                    <Nav className="justify-content-start"
                         style={navButtonsEnabled ? {display: "none"} : null}
                    >
                        <NavDropdown style={{marginTop: "-2px"}} title={this.getCurrentLanguage()}
                                     id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => this.changeLanguage("en")}>
                                EN
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.changeLanguage("fr")}>
                                FR
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.changeLanguage("de")}>
                                DE
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.changeLanguage("lu")}>
                                LU
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Navbar.Toggle className="togglemy" aria-controls="basic-navbar-nav"
                                   style={navButtonsEnabled ? {display: "none"} : null}/>
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav className="mr-auto" className="justify-content-end"
                             style={navButtonsEnabled ? {display: "none"} : null}
                        >
                            <Nav.Link as={Link} to="/"  className="custom-nav-link ">
                                    <button className="btn liquid">
                                    <span><Trans i18nKey="home.home"/></span>
                                    </button>
                            </Nav.Link>

                            <Nav.Link className="custom-nav-link" as={Link} to="/mission">

                                    <button className="btn liquid">
                                    <span><Trans i18nKey="mission.mission"/></span>
                                    </button>
                            </Nav.Link>

                            <Nav.Link className="custom-nav-link" as={Link} to="/news">

                                    <button className="btn liquid">
                                    <span><Trans i18nKey="news.news"/></span>
                                    </button>
                            </Nav.Link>

                            <Nav.Link className="custom-nav-link" as={Link} to="/seminarHome">

                                    <button className="btn liquid">
                                    <span><Trans i18nKey="seminar.home"/></span>
                                    </button>
                            </Nav.Link>

                            <Nav.Link className="custom-nav-link" as={Link} to="/team">

                                    <button className="btn liquid">
                                    <span><Trans i18nKey="team.team"/></span>
                                    </button>
                            </Nav.Link>

                            <Nav.Link className="custom-nav-link" as={Link} to="/sponsors">

                                    <button className="btn liquid">
                                    <span><Trans i18nKey="sponsors.sponsors"/></span>
                                    </button>
                            </Nav.Link>
                            <Nav.Link className="custom-nav-link" as={Link} to="/contactus">

                                    <button className="btn liquid">
                                    <span><Trans i18nKey="contact.contact_us"/></span>
                                    </button>
                            </Nav.Link>
                            <Nav.Link  className="custom-nav-link" as={Link} to="/community">
                                    <button className="btn liquid">
                                    <span><Trans i18nKey="community.community"/></span>
                                    </button>
                            </Nav.Link>
                            {this.props.userReducer.isAuthenticate && this.props.userReducer.user
                            && (this.props.userReducer.user.roles.includes('ADMIN') || this.props.userReducer.user.roles.includes('WORKSHOP')) &&
                            <Nav.Link  className="custom-nav-link" as={Link} to="/admin">
                                    Admin
                            </Nav.Link>
                            }
                            {this.props.userReducer.isAuthenticate && this.props.userReducer.user &&
                            <NavDropdown title={this.props.userReducer.user.email} id="userinfo-dropdown">
                                <NavDropdown.Item as={Link} to="/profile"> Profile </NavDropdown.Item>
                                <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

//                            {this.props.userReducer.isAuthenticate && this.props.userReducer.user
//                            && (this.props.userReducer.user.roles.includes('ADMIN') || this.props.userReducer.user.roles.includes('WORKSHOP'))  &&
//                            <Nav.Link>
//                                <Link to="/profile">
//                                    Profile
//                                </Link>
//                            </Nav.Link>
//                            }