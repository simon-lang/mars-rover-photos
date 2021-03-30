import './App.css'
import Photos from './store/photos'
import { useEffect, useState } from 'react'
import { Photo } from './models/Photo'
import { Manifest } from './models/Manifest'
import { observer  } from 'mobx-react'
import { getPhotos, getManifest } from './services/photo-service'

const photos = new Photos()

const PhotoView = ({ photo }) => (
    <div className="Photo">
        <div> {photo.rover.name} </div>
        <div> {photo.camera.name} </div>
        <div> {photo.earth_date} </div>
        <img src={photo.img_src} alt={`Mars Rover ${photo.camera.name}`}/>
    </div>
)

const PhotosView = observer(({ photos }) => {
    useEffect(() => { })
    return <div className="Photos">
        {photos.items.map((photo: Photo) => <PhotoView photo={photo} key={photo.id} />) }
    </div>
})

const ManifestView = () => {
	const [manifest, setManifest] = useState({name: '???'})
    getManifest('spirit').then((d: Manifest) => {
        console.log({manifest: d})
		setManifest(d)
    })
    return <div>
		<div>Manifest</div>
		{manifest.name}
	</div>
}

const App = () => (
    <div className="App">
        <header className="App-header">
            Mars Rover Image Viewer
        </header>
        <ManifestView />
        <PhotosView photos={photos} />
    </div>
)

async function main() {
    const res = await getPhotos({
        rover: 'opportunity',
        camera: 'FHAZ',
        sol: 1
    })
    console.log(res.data.photos)
    photos.set(res.data.photos)
}
main()

export default App
