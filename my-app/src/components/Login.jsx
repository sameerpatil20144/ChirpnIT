import React, { Component } from 'react';
import { BrowserRouter as  Router,Redirect, Link} from 'react-router-dom';
import "../styles/Login.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Login extends Component{
    constructor() {
        super();
        this.state = {
            email: '',
            password:'',
            success:false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
          [name]: value
        });
    }
    handleSubmit(e){
        e.preventDefault();
        let data ={
            "email":this.state.email,
            "password":this.state.password,
        }
        
        axios.post('http://localhost:9000/users/login',data)
        .then(res => {
            if(res.data.success===true){
                this.setState({success: res.data.success});
                localStorage.setItem("JWT token", res.data.token);
                localStorage.setItem("type", res.data.user.type);
            }
            else{
                toast.error('Invalid Email or Invalid Password', {
                    position: "bottom-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                    });
            }
    })
        console.log('The form was submitted with the following data:',this.state);
    }

    render(){
        if(this.state.success===true){
            return <Redirect to="/home" />;
        }
        return(
            <Router>
              <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover/>
                <div className="container-fluid center color-background">
                 <div className="row">
                    <div className="col-4">
                    </div>

                    <div className="col-4">
                    <form className="form-signin card" onSubmit={this.handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Get started with Todo list</h1>
                        <label for="inputEmail" className="sr-only">Email address</label>
                        <input type="email" id="inputEmail" className="form-control gap" placeholder="Email address" autoFocus="" name="email" value={this.state.email} onChange={this.handleChange} required/>
                        <label for="inputPassword" className="sr-only">Password</label>
                        <input type="password" id="inputPassword" className="form-control gap" placeholder="Password" name="password" value ={this.state.password}  onChange={this.handleChange} required/>
                        
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-md btn-primary btn-block signin-btn">Sign In</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    </div>
                    <div className="col-4">
                    </div>
                    
                    </div>  
                </div>
            </Router>
        );
    }
}

export default Login;
