import React from 'react';
import './App.css';
import {getPhotos} from './services/photo-service'

getPhotos({
    rover: 'opportunity',
    camera: 'FHAZ',
    sol: 4304
}).then(res => {
    console.log(res.data.photos)
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Mars Rover Image Viewer
      </header>
    </div>
  );
}

export default App;
