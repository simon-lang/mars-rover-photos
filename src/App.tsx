import './App.css'
import Manifest from './store/manifest'
import SearchFilters from './store/search-filters'
import { FiltersView } from './components/FiltersView'
import { ManifestView } from './components/ManifestView'
import { PhotosView } from './components/PhotosView'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import classNames from 'classnames'
import { useRoutes, A } from 'hookrouter'

const manifest = new Manifest()
const searchFilters = new SearchFilters()
const theme = createMuiTheme({
    palette: { type: 'dark', primary: { main: 'rgb(153, 45, 50)' } },
})

const Splash = () => {
    return <div>Choose Rover...</div>
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
                    <div className="NavButton">
                        <A href="/">Home</A>
                        <A href="/manifest">Manifest</A>
                        <A href="/photos">Photos</A>
                    </div>
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
