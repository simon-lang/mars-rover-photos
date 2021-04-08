import './App.css'
import Manifest from './store/manifest'
import Photos from './store/photos'
import SearchFilters from './store/search-filters'
import _ from 'lodash'
import { Button } from '@material-ui/core'
import { FiltersView } from './components/FiltersView'
import { ManifestView } from './components/ManifestView'
import { PhotosView } from './components/PhotosView'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { useState } from 'react'
import classNames from 'classnames'

const photos = new Photos()
const manifest = new Manifest()
const searchFilters = new SearchFilters()
const theme = createMuiTheme({
    palette: { type: 'dark', primary: { main: 'rgb(153, 45, 50)' } },
})

const App = () => {
    const [tab, setTab] = useState('manifest')
    const changeTab = () => {
        setTab(tab === 'photos' ? 'manifest' : 'photos')
    }
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header className="App__header">
                    <div className="container">Mars Rover Photos</div>
                </header>
                <div className="App__main">
                    <div className="NavButton">
                        <Button onClick={changeTab}>
                            {tab === 'photos' ? 'Manifest' : 'Photos'}
                        </Button>
                    </div>
                    <div
                        className={classNames({
                            View: true,
                            View__active: tab === 'photos',
                        })}
                    >
                        <div className="container">
                            <PhotosView photos={photos} filters={searchFilters} />
                        </div>
                    </div>
                    <div
                        className={classNames({
                            View: true,
                            View__active: tab === 'manifest',
                        })}
                    >
                        <div className="container">
                            <FiltersView photos={photos} filters={searchFilters} />
                            <ManifestView
                                manifest={manifest}
                                filters={searchFilters}
                            />
                        </div>
                    </div>
                    <div className="container">
                        <a
                            href="https://github.com/simon-lang/mars-rover-photos"
                            className="credit-link"
                        >
                            simon-lang/mars-rover-photos
                        </a>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App
