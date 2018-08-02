import React, {Component} from 'react'
import '../styles/SignIn.css'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      toHomePage: () => this.props.changeRoute('home'),
   };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
     const name = event.target.name
     this.setState({[name]: event.target.value});
  }

  handleRegister = () => {
     fetch('http://localhost:3001/register', {
       method: 'post',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({
          email: this.state.email,
          name: this.state.name,
          password: this.state.password,
       })
     })
     .then(response => response.json())
     .then(user => {
       if (user.id) {
          this.props.loadUser(user);
          this.state.toHomePage();
      }
     });
 }

  render() {
    return (
      <article className='middle'>
         <main>
           <h1>Register</h1>

           <label>Name:</label>
           <input className='inputField' name='name' type="text" value={this.state.name} onChange={this.handleChange} />

           <label>Email:</label>
           <input className='inputField' name='email' type="email" value={this.state.email} onChange={this.handleChange} />

           <label>Password:</label>
           <input className='inputField' name='password' type="password" value={this.state.password} onChange={this.handleChange} />


           <input onClick={this.handleRegister} className='submit' type="submit" value="Register" />
         </main>
      </article>
    );
  }
}

export default Register;
