import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Card, NavItem, Navbar, NavbarBrand, Collapse, NavbarToggler, NavLink } from 'reactstrap';

import React from "react";
import ReactDOM from 'react-dom';

import { Reservations } from './reservation';
import { Admin } from './admin';

import backgroundImage from "./pics/background_2.webp"


class App extends React.Component {

    constructor(props){
        super(props)
        this.state = { 
            page: "home",
            navbarOpen: false
        }
        
        this.pages = { 
            "home": <Home/>,
            "reservation": <Reservations/>,
            "admin": <Admin/>
        }

        this.style = { 
            backgroundColor: "#7BB076",
            minHeight: "100vh",
            fontFamily: "Bradley Hand"
        }
    }

    changePage(newPage){
        this.setState({
            page: newPage,
            navbarOpen: false
        })
    }

    getCurrentPage(){ 
        const currPage = this.state.page
        return this.pages[currPage]
    }

    render() {
        return(
            <div style={this.style}>
                <Navbar 
                color='faded'
                light
                style={{
                    backgroundColor: "#EECDFF",
                }}
                >
                    <NavbarBrand onClick={() => {this.setState({page: "home", navbarOpen: false})}}>
                        <h1 style={{ color: "#A81313" }}>
                            The Krusty Krab 
                        </h1>
                    </NavbarBrand>
                    <NavbarToggler 
                        className='me-2'
                        onClick={ () => {this.setState({navbarOpen: !this.state.navbarOpen})} }
                    />
                    <Collapse navbar isOpen={this.state.navbarOpen}>
                        <Nav navbar>
                            <NavItem>
                                <NavLink onClick={() => this.changePage("reservation")}>Reservation</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => this.changePage("admin")}>Admin</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
                {this.getCurrentPage()}
            </div>
        );
    }
}

class Home extends React.Component { 

    render () { 
        return (
            <div
                style={{
                    paddingTop: "10px",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    height: "100vh"
                }}
            >
                
                <Card
                body
                className='text-center'
                style={{
                    margin: "10px auto auto auto",
                    width: "40rem"
                }}>
                    <h1 style={{ color: "#A81313" }}>
                        Welcome to The Krusty Krab!
                    </h1>
                </Card>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);