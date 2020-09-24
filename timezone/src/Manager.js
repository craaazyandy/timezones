import React, { Component } from 'react'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import { List } from 'semantic-ui-react'

export default class Manager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            users: []
        }

        this.refreshUsers = this.refreshUsers.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        this.refreshUsers();
    }

    // Refresh users
    refreshUsers = () => {
        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        if (lvl > 1) {
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
                    alert("ERROR getting users: " + error);
                 })
        }
        else {
            alert("ERROR getting users: Unauthorized Operation");
        }

    }

    // Remove user
    removeUser = (email) => {
        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        const url = 'http://localhost:3030/user/' + email;
        if (lvl > 1) {
            axios.delete(url
                    , { headers: {
                        'authorization': 'Bearer ' + jwt_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }}
                 )
                 .then(res => {
                    this.refreshUsers();
                    console.log(res);
                    console.log(res.data);
                 })
                .catch((error) => {
                    alert("ERROR deleting user " + email + ": " + error);
                })
        }
        else {
            alert("ERROR deleting user " + email + ": Unauthorized Operation");
        }
    }

    // TODO use hooks
    handleChange = (event) => {
        const n = event.target.name;
        const v = event.target.value;
        if (n === 'email') this.setState({ email : v});
        if (n === 'password') this.setState({ password : v})
    }
    
    // Add user
    handleSubmit = (event) => {
        event.preventDefault();

        const jwt_token = localStorage.getItem('token');
        const lvlString = localStorage.getItem('level');
        const lvl = (lvlString) ? parseInt(lvlString) : 0;
        if (lvl > 1) {
            axios.post("http://localhost:3030/user"
                        , { 'email': this.state.email, 'password': this.state.password }
                        , { headers: {
                            'authorization': 'Bearer ' + jwt_token,
                            'Accept' : 'application/json',
                            'Content-Type': 'application/json'
                        }}
                 )
                 .then(res => {
                    this.refreshUsers();
                    console.log(res);
                    console.log(res.data);
                 })
                 .catch((error) => {
                        alert("ERROR adding user " + this.state.email + ": " + error);
                 })
        }
        else {
            alert("ERROR adding user " + this.state.email + ": Unauthorized Operation");
        }
    }


    render() {

        // Manager can only handle users (level 1)
        const renderList = this.state.users.map((data) => {
            const e = data.email;
            const DeleteIcon = () => {
                if (data.level == 1) 
                    return (<a onClick={() => this.removeUser(e)}><i className="trash icon"/></a>)
                else 
                    return (<i className="trash icon"/>)
            }
            return (
                <List.Item>
                    <div style={{float:'left'}}><DeleteIcon/></div>
                    <div style={{float:'left'}}>
                        <List.Content>
                            <List.Header>{e}</List.Header>
                        </List.Content>
                    </div>
                </List.Item>
            )
        })

        return (
            <div>
                <div style={{padding : '20px'}}>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input type="text" name="email" placeholder="email" onChange={this.handleChange}/>
                        </label>
                        <label style={{paddingLeft : '30px'}}>
                            <input type="text" name="password" size="10" placeholder="password" onChange={this.handleChange} />
                        </label>
                        <button type="submit">Add User</button>
                    </form>
                </div>
                <div style={{padding : '20px 40px'}}>
                    <List divided verticalAlign='middle'>
                        { renderList }
                    </List>
                </div>
            </div>
        );
    }

}
 