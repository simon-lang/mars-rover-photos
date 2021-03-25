import React from 'react';
import './App.css';
import {getPhotos} from './services/photo-service'
import Photos from './store/photos'
import { makeAutoObservable  } from 'mobx';
import { observer  } from 'mobx-react';
const myPhotos = new Photos()

const PhotosView = observer(({ photos }) => (
    // <button onClick={() => photos.reset()}>Number of Photos: {photos.items.length}</button>
    <div className="Photos">
        {photos.items.map(photo => (
            <div key={photo.id} className="Photo">
                <img src={photo.img_src} />
                <div>
                    {photo.rover.name}
                </div>
                <div>
                    {photo.camera.name}
                </div>
                <div>
                    {photo.earth_date}
                </div>
            </div>
        ))}
    </div>
))

interface Camera {
    id: number
    full_name: string
    name: string
    rover_id: number
}

async function main() {
    const res = await getPhotos({
        rover: 'opportunity',
        camera: 'FHAZ',
        sol: 1
    })
    console.log(res.data.photos)
    myPhotos.set(res.data.photos)
}
main()

function App() {
    return (
        <div className="App">
            <header className="App-header">
                Mars Rover Image Viewer
            </header>
            <PhotosView photos={myPhotos} />
        </div>
    );
}

// TODO: feed photos into mobx store or something like that

export default App;
