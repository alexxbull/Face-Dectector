import React, { Component } from 'react';
import '../styles/App.css';
import Background from '../components/Background';
import Header from '../components/Header'
import Logo from '../components/Logo'
import ImageLinkForm from '../components/ImageLinkForm'
import FaceDetector from '../components/FaceDetector'
import Footer from '../components/Footer'
import SignIn from './SignIn'
import Register from './Register'
import Usage from '../components/Usage'

const initialState = {
  box: [],
  input: '',
  imageURL: '',
  route: 'signin',
  isSignedIn: false,
  user: {
     id: '',
     name: '',
     email: '',
     attempts: 0,
     joined: '',
  }
}

class App extends Component
{
   constructor(props) {
      super(props);
      this.state = initialState;
   }

   loadUser = (data) => {
      this.setState({user: {
        attempts: data.attempts,
        email: data.email,
        id: data.id,
        joined: data.joined,
        name: data.name,
      }})
   }

   getFaceLocation = (response) => {
      const image = document.getElementById('inputImage');
      const height = Number(image.height)
      const width = Number(image.width)

      const coordinates = []

      response.outputs.forEach(output => {
         return output.data.regions.forEach(regions => {
             const clarifaiFace = regions.region_info.bounding_box;
             coordinates.push({
                leftCol: clarifaiFace.left_col * width,
                topRow: clarifaiFace.top_row * height,
                rightCol: width - (clarifaiFace.right_col * width),
                bottomRow: height - (clarifaiFace.bottom_row * height),
             })
         })
      })

      return coordinates;
   }

   onInputchange = (event) => this.setState({input: event.target.value});

   onImageSubmit = () => {
      this.setState({imageURL: this.state.input})

      fetch('https://rocky-dawn-33996.herokuapp.com/imageurl', {
       method: 'post',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({input: this.state.input})
      })
      .then(response => response.json())
      .then(response => {
        if (response)
        {
           fetch('https://rocky-dawn-33996.herokuapp.com/attempts', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: this.state.user.id})
               })
           .then(response => response.json())
           .then(count => this.setState(Object.assign(this.state.user, {attempts: count})))
           .catch(console.log)

           this.setState({box: this.getFaceLocation(response)})
        }
      })
      .catch(err => console.log('ERROR', err));
   }

   changeRoute = (newPage) =>
   {
      this.setState({route: newPage});

      if (newPage === 'home')
         this.setState({isSignedIn: true});
      else if (newPage === 'signin')
         this.setState(initialState);
   }

   handleRouting = () =>
   {
      switch (this.state.route)
      {
         case 'signin':
            return <SignIn changeRoute={this.changeRoute} loadUser={this.loadUser}/>

         case 'register':
            return <Register changeRoute={this.changeRoute} loadUser={this.loadUser}/>

         case 'home':
            return (
               <div>
                  <Logo />
                  <Usage name={this.state.user.name} attempts={this.state.user.attempts}/>
                  <ImageLinkForm onInputchange={this.onInputchange}
                                 onImageSubmit={this.onImageSubmit}
                   />
                  <FaceDetector box={this.state.box} imageURL={this.state.imageURL}/>
                  <Footer />
               </div>
            );

         default:
            return <SignIn changeRoute={this.changeRoute}/>
      }
   }

  render()
  {
    return (
      <div className="App">
         <Background />
         <Header isSignedIn={this.state.isSignedIn} changeRoute={this.changeRoute} />
         {this.handleRouting()}
    </div>
    );
  }
}

export default App;
