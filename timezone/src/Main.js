import React, { Component } from 'react'
import logo from './img/logo_transparent.png'
import moment from 'moment';
import momentTimezone from 'moment-timezone';   // need
import User from './User'
import Manager from './Manager'
import Admin from './Admin'
import Landing from './Landing'

//const tzs = moment.tz.names();
const timeZoneData = moment.tz.zonesForCountry('US', true);

let usTimeZoneData = [];
usTimeZoneData = timeZoneData.map((data) => {
    const offsetString = (data.offset > 0) ? '+' + data.offset : '' + data.offset;
    const nameString = data.name + '(GMT' + offsetString + ')';
    const cityString = data.name.substring(data.name.indexOf('/') + 1);
    const option = {
        "key": nameString,
        "text": nameString,
        "value": nameString
    }
    return ( option );
})


export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loggedIn: 0
        }
        this.refreshLoggedIn = this.refreshLoggedIn.bind(this);
    };

    componentDidMount() {
        this.refreshLoggedIn();
    }

    // Refresh loggedIn flag
    refreshLoggedIn = () => {
        const tmp1 = localStorage.getItem('token');
        const loggedInUser = localStorage.getItem('user');
        const loggedInLevel = localStorage.getItem('level');
        this.setState({ email : loggedInUser });
        this.setState({ loggedIn : ((loggedInLevel) ? parseInt(loggedInLevel) : 0) });
    }

    handleLogout = (event) => {
        event.preventDefault();

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('level');
        this.refreshLoggedIn();
    }


    render() {

        const NavLinks = () => {
            if (this.state.loggedIn > 0) 
                return (
                    <div>
                        <p style={{display:'inline', paddingRight:'20px'}}>Welcome {this.state.email}</p>
                        <button onClick={this.handleLogout} style={{display:'inline'}}>Logout</button>
                    </div>
                )
            else
                return (
                    <div>
                        <p style={{display:'inline', paddingLeft:'20px'}}>Welcome.  Please login or signup</p>
                    </div>
                )
        }

        const ContentContainer = () => {
        console.log('ContentContainer:' + this.state.loggedIn);
            if (this.state.loggedIn && this.state.loggedIn === 1) 
                return (
                    <User zoneList={usTimeZoneData}/>
                )
            else if (this.state.loggedIn && this.state.loggedIn === 2)
                return (
                    <Manager/>
                )
            else if (this.state.loggedIn && this.state.loggedIn === 3)
                return (
                    <Admin zoneList={usTimeZoneData}/>
                )
            else 
                return (
                    <Landing refresher={this.refreshLoggedIn}/>
                )
            }

        return (
            <div>
                <div style={{padding:'20px 20px 50px', backgroundColor:'lightblue'}}>
                    <img src={logo} alt="logo" style={{float:'left'}}/>
                    <nav style={{float:'right'}}>
                        <NavLinks/>
                    </nav>
                </div>
                <ContentContainer/>
            </div>
        )
    }

}
 