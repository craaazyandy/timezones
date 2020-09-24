import React, { Component } from 'react'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import { List, Dropdown } from 'semantic-ui-react'

export default class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            level: 1,
            city: '',
            timezone: '',
            offset: 0,
            users: [],
            tzs: []
        }

        this.refreshAll = this.refreshAll.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.removeTimezone = this.removeTimezone.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
        this.handleUserSubmit = this.handleUserSubmit.bind(this);
        this.handleTimezoneSubmit = this.handleTimezoneSubmit.bind(this);
    };

    componentDidMount() {
        this.refreshAll();
    }

    // Refresh users and timezones
    refreshAll = () => {
        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        if (lvl > 2) {
            axios.get("http://localhost:3030/users"
                    , { headers: {
                        'authorization': 'Bearer ' + jwt_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }}
                 )
                 .then((result) => {
                    const users = result.data;
                    this.setState( {users} );
                 })
                 .catch((error) => {
                    alert("ERROR getting users:" + error);
                 })

            axios.get("http://localhost:3030/timezones"
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
        else {
            alert("ERROR getting users or timezones: Unauthorized Operation");
        }

    }

    // Remove user
    removeUser = (email) => {
        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        const url = 'http://localhost:3030/user/' + email;
        if (lvl > 2) {
            axios.delete(url
                    , { headers: {
                        'authorization': 'Bearer ' + jwt_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }}
                 )
                 .then(res => {
                    this.refreshAll();
                    console.log(res);
                    console.log(res.data);
                 })
                .catch((error) => {
                    alert("ERROR deleting user " + email + ":" + error);
                })
        }
        else {
            alert("ERROR deleting user " + email + ": Unauthorized Operation");
        }
    }

    // Remove timezone
    removeTimezone = (data) => {
        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        const url = 'http://localhost:3030/timezone/' + data.email + '/' + data._id;
        if (lvl > 2) {
            axios.delete(url
                    , { headers: {
                        'authorization': 'Bearer ' + jwt_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }}
                 )
                 .then(res => {
                    this.refreshAll();
                    console.log(res);
                    console.log(res.data);
                 })
                 .catch((error) => {
                    alert("ERROR deleting timezone id " + data._id + ": " + error);
                 })
        }
        else {
            alert("ERROR deleting timezone " + data._id + ": Unauthorized Operation");
        }
    }

    // TODO use hooks
    handleUserChange = (event) => {
        const n = event.target.name;
        const v = event.target.value;
        if (n === 'email') this.setState({ email : v});
        if (n === 'password') this.setState({ password : v})
    }

    // TODO use hooks
    handleTzUserChange = (event) => {
        const v = event.target.value;
        this.setState({ email : v});
    }

    // TODO use hooks
    handleLevelChange = (event) => {
        const v = event.target.value;
        this.setState({ level : v});
    }

    // TODO use hooks
    handleTimezoneChange = (event, data) => {
        const selection = data.value;
        const idx1 = selection.indexOf('/');
        const idx2 = selection.indexOf('(');
        const idx3 = selection.indexOf(')');
        const tzCity = selection.slice(idx1+1, idx2);
        const tzOffsetString = selection.slice(idx2+4, idx3);
        const tzOffset = parseInt(tzOffsetString);
        this.setState({ city : tzCity})
        this.setState({ timezone : selection})
        this.setState({ offset : tzOffset})
    }
    
    // Add user
    handleUserSubmit = (event) => {
        event.preventDefault();

        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        if (lvl > 2) {
            axios.post("http://localhost:3030/user"
                        , { 
                            'email': this.state.email, 
                            'password': this.state.password,
                            'level': this.state.level
                         }
                        , { headers: {
                            'authorization': 'Bearer ' + jwt_token,
                            'Accept' : 'application/json',
                            'Content-Type': 'application/json'
                        }}
                 )
                 .then(res => {
                    this.refreshAll();
                    console.log(res);
                    console.log(res.data);
                 })
                 .catch((error) => {
                        alert("ERROR adding user " + this.state.email + ":" + error);
                 })
        }
        else {
            alert("ERROR adding user " + this.state.email + ": Unauthorized Operation");
        }
    }

    // Add timezone
    handleTimezoneSubmit = (event) => {
        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        if (lvl > 2) {
            axios.post("http://localhost:3030/timezone"
                        , { 'email': this.state.email, 
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
                    this.refreshAll();
                    console.log(res);
                    console.log(res.data);
                 })
                 .catch((error) => {
                    alert("ERROR adding timezone " + this.state.timezone + ": Unauthorized Operation");
                 })
        }
        else {
            alert("ERROR adding user " + this.state.email + ": Unauthorized Operation");
        }
    }

    // Add local timezone
    handleLocal = () => {
        const currentTime = new Date();
        const currentOffset = currentTime.getTimezoneOffset()
        const localTimeZone = 'Local (GMT' + ((currentOffset > 0) ? '+' + currentOffset : currentOffset) + ')';
        const jwt_token = localStorage.getItem('token');
        axios.post("http://localhost:3030/timezone"
                    , { 'email': this.state.email, 
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
                this.refreshAll();
                console.log(res);
                console.log(res.data);
             })
             .catch((error) => {
                alert("ERROR adding local timezone: " + error);
             })
    }

    render() {

        const usr = localStorage.getItem('user');
        const renderUserList = this.state.users.map((data) => {
            const e = data.email;
            const el = data.email + '(' + data.level + ')';
            const DeleteIcon = () => {
                if (data.email === usr) 
                    return (<i className="trash icon"/>)
                else 
                    return (<a onClick={() => this.removeUser(e)}><i className="trash icon"/></a>)
            }
            return (
                <List.Item style={{padding:'10px'}}>
                    <div style={{float:'left'}}><DeleteIcon/></div>
                    <div style={{float:'left'}}>
                        <List.Content>
                            <List.Header>{el}</List.Header>
                        </List.Content>
                    </div>
                </List.Item>
            )
        })

        const renderTimezoneList = this.state.tzs.map((data) => {
            const e = data.email;
            const t = data.timezone;
            return (
                <List.Item style={{padding:'10px'}}>
                    <div style={{float:'left'}}><a onClick={() => this.removeTimezone(data)}><i className="trash icon"/></a></div>
                    <div style={{float:'left'}}>
                        <List.Content>
                            <List.Header>{t}[{e}]</List.Header>
                        </List.Content>
                    </div>
                </List.Item>
            )
        })

        const selectUserList = this.state.users.map((data) => {
            const e = data.email;
            const l = data.level;
            if (l === 1) {
                return (
                    <option>{e}</option>
                )
            }
        })

        return (
            <div>
                <div style={{float:'left'}}>
                    <div style={{padding:'80px 0px 60px 0px'}}>
                        <form onSubmit={this.handleUserSubmit}>
                            <label>
                                <input type="text" name="email" placeholder="email" onChange={this.handleUserChange}/>
                            </label>
                            <label>
                                <input type="text" name="password" size="10" placeholder="password" onChange={this.handleUserChange}/>
                            </label>
                            <label>
                                <select name="selectLevel" onChange={this.handleLevelChange}>
                                    <option value="" disabled selected hidden>Level</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </label>
                            <button type="submit">Add User</button>
                        </form>
                    </div>
                    <div>
                        <List divided verticalAlign='middle'>
                            { renderUserList }
                        </List>
                    </div>
                </div>
                <div style={{float:'left'}}>
                    <div style={{padding:'80px 0px 20px 30px', width:'500px'}}>
                        <form>
                            <Dropdown
                                onChange={this.handleTimezoneChange} 
                                placeholder='Select Timezone (empty for GMT)'
                                fluid
                                selection
                                options={this.props.zoneList}
                            />
                            <label>
                                <select name="selectTzUser" onChange={this.handleTzUserChange}>
                                    <option value="" disabled selected hidden>choose user</option>
                                    {selectUserList}
                                </select>
                            </label>
                            <button onClick={this.handleTimezoneSubmit} style={{float:'right'}}>Add Timezone</button>
                            <button onClick={this.handleLocal} style={{float:'right'}}>Add Local</button>
                        </form>
                    </div>
                    <div style={{padding:'0px 0px 0px 30px', width:'500px'}}>
                        <List divided verticalAlign='middle'>
                            { renderTimezoneList }
                        </List>
                    </div>
                </div>
            </div>
        );
    }

}
 