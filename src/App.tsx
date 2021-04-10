import './App.css'
import Manifest from './store/manifest'
import SearchFilters from './store/search-filters'
import classNames from 'classnames'
import { AppBar, Toolbar } from '@material-ui/core'
import { FiltersView } from './components/FiltersView'
import { ManifestView } from './components/ManifestView'
import { Photo } from './models/Photo'
import { PhotosView, PhotoView } from './components/PhotosView'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { useRoutes, navigate, A } from 'hookrouter'

const manifest = new Manifest()
const searchFilters = new SearchFilters()
const theme = createMuiTheme({
    palette: { type: 'dark', primary: { main: 'rgb(153, 45, 50)' } },
})

const Splash = () => {
    const clickPhoto = (d) => {
        searchFilters.setRover(d.rover.name.toLowerCase())
        navigate('/photos')
    }

    const rovers: Array<Photo> = [
        {
            rover: { name: 'Perseverance', missionDates: '2021' },
            img_src:
                'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00044/ids/edr/browse/ncam/NLF_0044_0670852418_793ECM_N0031416NCAM02044_01_295J01_1200.jpg',
        },
        {
            rover: { name: 'Curiosity', missionDates: '2012 - 2021' },
            img_src:
                'https://mars.nasa.gov/msl-raw-images/msss/01100/mcam/1100ML0048780060500632E01_DXXX.jpg',
        },
        {
            rover: { name: 'Opportunity', missionDates: '2004 - 2018' },
            img_src:
                'https://mars.nasa.gov/mer/gallery/all/1/p/1901/1P296952193EFFA200P2359L1M1-BR.JPG',
        },
        {
            rover: { name: 'Spirit', missionDates: '2004 - 2010' },
            img_src:
                'https://mars.nasa.gov/mer/gallery/all/2/n/2017/2N305424848EFFB1E5P1938R0M1-BR.JPG',
        },
    ]
    return (
        <div className="SelectRover">
            {rovers.map((d) => (
                <PhotoView
                    key={d.img_src}
                    photo={d}
                    onClickPhoto={clickPhoto}
                />
            ))}
        </div>
    )
}

const MainView = ({ tab }) => {
    return (
        <>
            <div
                className={classNames({
                    View: true,
                    View__active: tab === 'home',
                })}
            >
                <div className="container">
                    <Splash />
                </div>
            </div>
            <div
                className={classNames({
                    View: true,
                    View__active: tab === 'manifest',
                })}
            >
                <div className="container">
                    <FiltersView filters={searchFilters} />
                    <ManifestView manifest={manifest} filters={searchFilters} />
                </div>
            </div>
            <div
                className={classNames({
                    View: true,
                    View__active: tab === 'photos',
                })}
            >
                <div className="container">
                    <PhotosView filters={searchFilters} />
                </div>
            </div>
        </>
    )
}

const NavView = () => (
    <div className="NavView">
        <div className="container NavView__inner">
            <A className="NavItem" href="/">
                Home
            </A>
            <A className="NavItem" href="/manifest">
                Manifest
            </A>
            <A className="NavItem" href="/photos">
                Photos
            </A>
        </div>
    </div>
)

const routes = {
    '/': () => <MainView tab="home" />,
    '/manifest': () => <MainView tab="manifest" />,
    '/photos': () => <MainView tab="photos" />,
    // '/photos/:id': ({id}) => <PhotoView id={id} />
}

const App = () => {
    const routeResult = useRoutes(routes)
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header className="App__header">
                    <div className="container">Mars Rover Photos</div>
                </header>
                <div className="App__main">
                    <NavView />
                    {routeResult}
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
