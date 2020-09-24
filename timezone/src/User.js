import React, { Component } from 'react'
import axios from 'axios'
import { List, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import TzClock from './TzClock'

export default class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            city: '',
            timezone: '',
            offset: 0,
            tzs: []
        }

        this.refreshTimezones = this.refreshTimezones.bind(this);
        this.removeTimezone = this.removeTimezone.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        this.refreshTimezones();
    }

    // Refresh timezones
    refreshTimezones = () => {
        const usr = localStorage.getItem('user');
        const jwt_token = localStorage.getItem('token');
        const url = 'http://localhost:3030/timezone/' + usr;
        axios.get(url
                , { headers: {
                    'authorization': 'Bearer ' + jwt_token,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                }}
             )
             .then((result) => {
                 const tzs = result.data;
                 this.setState( {tzs} );
             })
             .catch((error) => {
                alert("ERROR getting timezones: " + error);
             })
    }

    // Remove timezone
    removeTimezone = (id) => {
        const usr = localStorage.getItem('user');
        const jwt_token = localStorage.getItem('token');
        const url = 'http://localhost:3030/timezone/' + usr + '/' + id;
        axios.delete(url
                , { headers: {
                    'authorization': 'Bearer ' + jwt_token,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                }}
             )
             .then(res => {
                this.refreshTimezones();
                console.log(res);
                console.log(res.data);
             })
             .catch((error) => {
                alert("ERROR deleting timezone id " + id + ": " + error);
             })
    }

    // TODO use hooks
    handleChange = (event, data) => {
        const selection = data.value;
        const idx1 = selection.indexOf('/');
        const idx2 = selection.indexOf('(');
        const idx3 = selection.indexOf(')');
        const tzCity = selection.slice(idx1+1, idx2);
        const tzOffsetString = selection.slice(idx2+4, idx3);
        const tzOffset = parseInt(tzOffsetString);
        // console.log('tzCity:' + tzCity);
        // console.log('tzOffsetString:' + tzOffsetString);
        // console.log('tzOffset:' + tzOffset);
        this.setState({ city : tzCity})
        this.setState({ timezone : selection})
        this.setState({ offset : tzOffset})
    }
    
    // Add timezone
    handleSubmit = (event) => {
        const usr = localStorage.getItem('user');
        const jwt_token = localStorage.getItem('token');
        axios.post("http://localhost:3030/timezone"
                    , { 'email': usr, 
                        'city' : (this.state.city) ? this.state.city : 'Greenwich',
                        'timezone' : (this.state.timezone) ? (this.state.timezone) : '(GMT)',
                        'offset' : this.state.offset
                      }
                    , { headers: {
                        'authorization': 'Bearer ' + jwt_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }}
             )
             .then(res => {
                this.refreshTimezones();
                console.log(res);
                console.log(res.data);
             })
             .catch((error) => {
                alert("ERROR adding timezone " + this.state.timezone + ": " + error);
             })
    }

    // Add local timezone
    handleLocal = () => {
        const currentTime = new Date();
        const currentOffset = currentTime.getTimezoneOffset()
        const localTimeZone = 'Local (GMT' + ((currentOffset > 0) ? '+' + currentOffset : currentOffset) + ')';
        const usr = localStorage.getItem('user');
        const jwt_token = localStorage.getItem('token');
        axios.post("http://localhost:3030/timezone"
                    , { 'email': usr, 
                        'city' : 'Local',
                        'timezone' : localTimeZone,
                        'offset' : currentOffset
                      }
                    , { headers: {
                        'authorization': 'Bearer ' + jwt_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }}
             )
             .then(res => {
                this.refreshTimezones();
                console.log(res);
                console.log(res.data);
             })
             .catch((error) => {
                alert("ERROR adding local timezone: " + error);
             })
    }


    render() {

        const renderList = this.state.tzs.map((data) => {
            return (
                <List.Item>
                    <List.Content key={data._id}><TzClock tz={data} rf={this.removeTimezone}/></List.Content>
                </List.Item>
            )
        })

        return (
            <div>
                <div>
                    <div style={{padding: '60px', width:'500px'}}>
                        <form>
                            <Dropdown
                                onChange={this.handleChange} 
                                placeholder='Select Timezone (empty for GMT)'
                                fluid
                                selection
                                options={this.props.zoneList}
                            />
                            <button onClick={this.handleSubmit} style={{float:'right'}}>Add Timezone</button>
                            <button onClick={this.handleLocal} style={{float:'right'}}>Add Local</button>
                        </form>
                    </div>
                </div>
                <div style={{padding : '20px', float:'left'}}>
                    <List horizontal relaxed='very'>
                        { renderList }
                    </List>
                </div>
            </div>
        );
    }

}
 