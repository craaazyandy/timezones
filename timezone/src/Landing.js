import React, { Component } from 'react'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'

export default class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    };

    // TODO use hooks
    handleChange = (event) => {
        const n = event.target.name;
        const v = event.target.value;
        if (n === 'email') this.setState({ email : v});
        if (n === 'password') this.setState({ password : v})
    }

    handleSignup = (event) => {
        event.preventDefault();

        axios.post("http://localhost:3030/User"
                    , { 'email': this.state.email, 'password': this.state.password }
                    , { headers: {
                        //'authorization': your_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }})
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.props.refresher();
            })
            .catch(
                (error) => {
                    console.log("ERROR in LOGIN:" + error);
                }
            )
    }

    /**
     * TODO: access token to state.  refresh token to cookie.
     *       as long as there are activities refresh token.
     *       user idle will cause the access token to expire.
     */
    handleLogin = (event) => {
        event.preventDefault();

        axios.post("http://localhost:3030/Login"
                    , { 'email': this.state.email, 'password': this.state.password }
                    , { headers: {
                        //'authorization': your_token,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }})
             .then(res => {
                console.log(res);
                console.log(res.data);
                localStorage.setItem('token', res.data.accessToken);
                localStorage.setItem('user', res.data.userEmail);
                localStorage.setItem('level', res.data.userLevel);
                this.props.refresher();
             })
             .catch(
                (error) => {
                    alert("ERROR logging in:" + error);
                }
             )
    }

    render() {

        return (
            <div style={{padding : '20px'}}>
                <form key="random4">
                    <label>
                        <input id="email" type="text" name="email" value={this.state.email} placeholder="email" onChange={this.handleChange}/>
                    </label>
                    <label style={{paddingLeft : '30px'}}>
                        <input id="password" type="text" name="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/>
                    </label>
                    <button onClick={this.handleLogin}>Login</button>
                    <button onClick={this.handleSignup}>Signup</button>
                </form>
            </div>
        );
    }

}
 