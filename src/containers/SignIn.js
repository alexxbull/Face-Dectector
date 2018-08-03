import React, {Component} from 'react'
import '../styles/SignIn.css'

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      toHomePage: () => this.props.changeRoute('home'),
      toRegisterPage: () => this.props.changeRoute('register'),
   };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
     const name = event.target.type
     this.setState({[name]: event.target.value});
  }

  handleSignIn = () => {
     fetch('https://rocky-dawn-33996.herokuapp.com/signin', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
           email: this.state.email,
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
              <h1>Sign In</h1>

              <label>Email:</label>
              <input className='inputField' type="email" value={this.state.email} placeholder='name@email.com' onChange={this.handleChange} />

              <label>Password:</label>
              <input className='inputField' type="password" value={this.state.password} placeholder='password'
                     onChange={this.handleChange} />

              <input className='submit' onClick={this.handleSignIn}type="submit" value="Sign in" />

              <button className='register' onClick={this.state.toRegisterPage}>Register</button>
         </main>
      </article>
    );
  }
}

export default SignIn;
