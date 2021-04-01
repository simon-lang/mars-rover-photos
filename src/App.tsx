import './App.css'
import Manifest from './store/manifest'
import Photos from './store/photos'
import React, { useState, useEffect, useRef } from 'react'
import SearchFilters from './store/search-filters'
import _ from 'lodash'
import { Button, TextField, Select, MenuItem } from '@material-ui/core'
import { Photo } from './models/Photo'
import { SearchFilter } from './models/SearchFilter'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { getPhotos, getManifest } from './services/photo-service'
import { observer } from 'mobx-react'

const photos = new Photos()
const manifest = new Manifest()
const searchFilters = new SearchFilters()

const DebugView = (data) => (
    <div><pre>{JSON.stringify(data, null, 2)}</pre></div>
)

const FiltersView = observer(({ filters, photos }) => {
    const [cameras, setCameras] = useState<string[]>([])
    useEffect(() => {
        const uniqueCameras = _.uniq(photos.items.map(d => d.camera.name))
        setCameras(['', ...uniqueCameras])
    }, [photos.items])
    return (
        <div className="Filters">
            <div className="Filters__item">
                <Select label="Rover" value={filters.rover} onChange={e => filters.setRover(e.target.value)}>
                    <MenuItem value="perseverance">Perseverance</MenuItem>
                    <MenuItem value="curiosity">Curiosity</MenuItem>
                    <MenuItem value="opportunity">Opportunity</MenuItem>
                    <MenuItem value="spirit">Spirit</MenuItem>
                </Select>
            </div>
            {false && <div className="Filters__item">
                <Select label="Camera" value={filters.camera} onChange={e => filters.setCamera(e.target.value)}>
                    {cameras.map(camera => <MenuItem value={camera}>{camera || 'All'}</MenuItem>)}
                </Select>
            </div>}
            <div className="Filters__item">
                <TextField label="Sol" value={filters.sol} onChange={e => filters.setSol(e.target.value)} type="number" />
            </div>
        </div>
    )
})

const PhotoView = ({ photo, onClickPhoto }) => {
    const [backgroundImage, setBackground] = useState('black')
    const [reveal, setReveal] = useState(false)
    const src = photo.img_src
    const img = new window.Image()
    img.onload = () => {
        setBackground(`url(${src})`)
        setReveal(true)
    }
    img.src = src
    return (
        <div className={`Photo ${reveal ? 'Photo--reveal' : ''}`} style={{ backgroundImage }} onClick={e => onClickPhoto(photo)}>
            <div className="Photo__details">
                <div hidden> {photo.rover.name} </div>
                <div> {photo.camera.name} </div>
                <div> {photo.earth_date} </div>
            </div>
        </div>
    )
}

const PhotosView = observer(({ photos, filters }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | undefined>(undefined)
    useEffect(() => {
        photos.set([])
        const params: SearchFilter = {
            rover: filters.rover,
            sol: filters.sol,
        }
        if (filters.camera) {
            params.camera = filters.camera
        }
        getPhotos(params).then(res => {
            console.log(res.data.photos)
            photos.set(res.data.photos)
            photos.setPage(0)
        })
    }, [filters.rover, filters.camera, filters.sol, photos])
    const selectPhoto = photo => {
        setSelectedPhoto(photo)
    }
    const { items, page } = photos
    const pages = Math.floor(items.length / 6)
    return <div className="Photos">
        <div className="Photos__carousel">
            <Button color="primary" onClick={() => photos.setPage(page - 6)}>Prev</Button>
            <div className="Photos__items">
                {items.slice(page, page + 6).map((photo: Photo) => <PhotoView photo={photo} key={photo.id} onClickPhoto={selectPhoto} />)}
            </div>
            <Button color="primary" onClick={() => photos.setPage(page + 6)}>Next</Button>
        </div>
        <div>Page: {Math.floor(page / 6) + 1} / {pages}</div>

        {selectedPhoto ? <div className="SelectedPhoto" onClick={() => selectPhoto(undefined)}>
            <img src={selectedPhoto.img_src} alt={'Mars Rover Photo ' + selectedPhoto.id} />
        </div> : ''}
    </div>
})

const ManifestView = observer(({ manifest, filters }) => {
    useEffect(() => {
        getManifest(filters.rover).then(d => {
            manifest.set(d)
        })
    }, [filters.rover, manifest])
    const { name, landing_date, launch_date, status, max_sol, max_date, total_photos, photos } = manifest.data
    const data = { name, landing_date, launch_date, status, max_sol, max_date, total_photos }
    // { photos ? <DebugView data={photos} /> : '' }
    const chartRef = useRef(null)
    if (chartRef.current && photos) {
        const values = photos.map(d => ({
            sol: d.sol,
            date: d.earth_date,
            value: d.total_photos,
        }))
        window.vegaEmbed(chartRef.current, {
            $schema: "https://vega.github.io/schema/vega-lite/v5.json",
            width: 1200,
            height: 400,
            data: { values },
            config: {
                background: null,
            },
            mark: {
                type: 'bar',
                color: 'rgb(154, 45, 50)'
            },
            encoding: {
                x: {
                    field: 'sol',
                    type: 'nominal',
                    axis: {
                        title: 'Martian Sol'
                    }
                },
                y: {
                    field: 'value',
                    type: 'quantitative',
                    axis: {
                        title: 'Photos'
                    }
                },
                tooltip: [
                    {
                        field: 'sol',
                        title: 'Martian Sol'
                    },
                    {
                        field: 'value',
                        title: 'Photos'
                    },
                    {
                        field: 'date',
                        title: 'Earth Date'
                    }
                ]
            }
        }, { actions: false, theme: 'dark' })
    }
    console.log(chartRef.current)
    return <div className="Manifest">
        <h2>Manifest</h2>
        <div ref={chartRef}></div>

        {/*
        <pre>
        Rover Selected: Perseverance

        Manifest... Loading
        Mission Status... Active
        Most Recent Photo... 2020-03-29

        Raw Data...
        </pre>
          */}

        {data.name ? <DebugView data={data} /> : 'Loading...'}
        {photos ? `${photos.length} Days` : ''}
    </div>
})

const theme = createMuiTheme({ palette: { type: 'dark' } })
const App = () => (
    <ThemeProvider theme={theme}>
        <div className="App">
            <header className="App__header">
                <div className="container">
                    Mars Rover Photos
                </div>
            </header>
            <div className="container">
                <FiltersView photos={photos} filters={searchFilters} />
                <PhotosView photos={photos} filters={searchFilters} />
                <ManifestView manifest={manifest} filters={searchFilters} />
                <a href="https://github.com/simon-lang/mars-rover-photos" className="credit-link">
                    simon-lang/mars-rover-photos
                </a>
            </div>
        </div>
    </ThemeProvider>
)

async function main() {
    // const res = await getPhotos({
    //     rover: 'curiosity',
    //     camera: 'NAVCAM',
    //     sol: 3072
    // })

}
main()

export default App
