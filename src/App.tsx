import './App.css'
import Photos from './store/photos'
import Manifest from './store/manifest'
import React, {Suspense} from 'react'
import { Photo } from './models/Photo'
import { observer } from 'mobx-react'
import { getPhotos, getManifest } from './services/photo-service'
import { useImage } from 'react-image'

const photos = new Photos()
const manifest = new Manifest()

const DebugView = (data) => (
    <div><pre>{JSON.stringify(data, null, 2) }</pre></div>
)

const PhotoView = ({ photo }) => {
    // const {src} = useImage({
    //     srcList: photo.img_src
    // })
    const src = photo.img_src
    return (
        <div className="Photo">
            <div> {photo.rover.name} </div>
            <div> {photo.camera.name} </div>
            <div> {photo.earth_date} </div>
            <img src={src} alt={`Mars Rover ${photo.camera.name}`} className="Photo__image" />
        </div>
    )
}

const PhotosView = observer(({ photos }) => {
    const {items, page} = photos
    return <div className="Photos">
        <button className="btn" onClick={() => photos.setPage(page - 1)}>Prev</button>
        <div className="Photos__items">
            {photos.items.slice(page, page + 5).map((photo: Photo) => <PhotoView photo={photo} key={photo.id} />) }
        </div>
        <button className="btn" onClick={() => photos.setPage(page + 1)}>Next</button>
        <div hidden>Page: {page}</div>
    </div>
    })

const ManifestView = observer(({ manifest }) => {
    return <div className="manifest">
        <div>Manifest</div>
        <DebugView data={manifest.data} />
    </div>
})

const App = () => (
    <Suspense fallback="https://mars.nasa.gov/msl-raw-images/msss/00476/mhli/0476MH0264000000E1_DXXX.jpg">
        <div className="App">
            <header className="App-header">
                Mars Rover Image Viewer
            </header>
            <PhotosView photos={photos} />
            <ManifestView manifest={manifest} />
        </div>
    </Suspense>
)

async function main() {
    const res = await getPhotos({
        rover: 'curiosity',
        camera: 'NAVCAM',
        sol: 3072
    })
    console.log(res.data.photos)
    photos.set(res.data.photos)

    const manifestRes = await getManifest('curiosity')
    manifest.set(manifestRes)
}
main()

export default App
