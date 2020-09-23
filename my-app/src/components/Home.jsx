import React, { Component,useState,useEffect } from 'react';
import { BrowserRouter as  Router,Redirect, Link} from 'react-router-dom';
import "../styles/Login.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Home extends Component{
    constructor() {
        super();
        this.state = {
            description: '',
            todo:'',
            success:false,
            data:[]
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange=(e)=> {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
          [name]: value
        });
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        let data ={
            "name":this.state.todo,
            "description":this.state.description,
        }
        axios.post('http://localhost:9000/api/v1/todoList',data, {headers : { 'Content-Type': 'application/json','Authorization': localStorage.getItem('JWT token')}})
        .then(res => {
            if(res.data.success===true){
                toast.info("Todo item Added successfully !!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                axios.get('http://localhost:9000/api/v1/todoList')
                .then(res => {
                    this.setState({data:res.data})
                });
            }
            else{
                toast.error('Something went wrong !! Please try again later', {
                    position: "bottom-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        })
    }
    handleRemoveItem =(clickedItem)=>{
        axios.delete('http://localhost:9000/api/v1/todoList/'+clickedItem,{headers : { 'Content-Type': 'application/json','Authorization': localStorage.getItem('JWT token')}})
        .then(res => {
            axios.get('http://localhost:9000/api/v1/todoList')
            .then(res => {
                this.setState({data:res.data})
            })
        })
    }
    componentDidMount(){
        axios.get('http://localhost:9000/api/v1/todoList')
        .then(res => {
            this.setState({data:res.data})
        })
      }

    render(){
        if( localStorage.getItem('JWT token')===undefined||localStorage.getItem('JWT token')===null){
            return <Redirect to="/" />;
        }
        return(
            <Router>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover/>
                <div className="container-fluid center color-background">
                 <div className="row">
                    <div className="col-4">
                    <form className="form-signin card" onSubmit={this.handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">To do List</h1>
                        <label htmlFor="inputText" className="sr-only">Enter todo Item</label>
                        <input type="text" id="inputText" className="form-control gap" placeholder="Enter Todo item" autoFocus="" name="todo" value={this.state.todo} onChange={this.handleChange} required/>

                        <label htmlFor="inputDescription" className="sr-only">Enter Description</label>
                        <input type="text" id="inputDescription" className="form-control gap" placeholder="Enter Description" autoFocus="" name="description" value={this.state.description} onChange={this.handleChange} required/>
                    
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                {
                                    localStorage.getItem('type')==="admin"?<button className="btn btn-md btn-primary btn-block signin-btn" >Add Todo</button>:null
                                }
                                   
                                </div>
                            </div>
                        </div>
                    </form>
                    </div>
                    
                    <div className="col-6">
                    <div>
                        <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Remove item</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data.success?this.state.data.result.map(result => 
                                            <tr>
                                                <td className="ChangeText_color">
                                                    {result.name}
                                                </td>
                                                <td className="ChangeText_color">
                                                    {result.description}
                                                </td>
                                                { localStorage.getItem('type')==="admin"?<td className="ChangeText_color">
                                                    <button className="btn btn-danger btn-small active" onChange={this.handleChange} primary={false}onClick={() => this.handleRemoveItem(result._id)}>Remove</button>
                                                </td>:"You are not admin"}
                                            </tr>
                                            )
                                        : <div style={{ marginTop: '20px', textAlign: 'center' }}><b>"There are no records to display"</b></div>}
                                    </tbody>
                        </table>
                    </div>
                    </div>
                    
                    </div>  
                </div>
            </Router>
        );
    }
}

export default Home;
