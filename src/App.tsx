import React from 'react';
import logo from './logo.svg';
import './App.css';

interface Person {
    name: String
    age: number
}

const person: Person = {
    name: 'Simon',
    age: 22,
}

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
