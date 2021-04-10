import store from 'store'
import { Button } from '@material-ui/core'
import { Photo } from '../models/Photo'
import { observer } from 'mobx-react'
import { usePhotos } from '../services/photo-service'
import { useState, useEffect } from 'react'

export const PhotoView = ({ photo, onClickPhoto }) => {
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
        <div
            className={`Photo ${reveal ? 'Photo--reveal' : ''}`}
            style={{ backgroundImage }}
            onClick={() => onClickPhoto(photo)}
        >
            <div className="Photo__details">
                <div> {photo.rover.name} </div>
                <div> {photo.rover.missionDates || ''} </div>
                <div> {photo.camera?.name} </div>
                <div> {photo.earth_date} </div>
            </div>
        </div>
    )
}

export const PhotosView = observer(({ filters }) => {
    const [page, setPage] = useState<number>(1)
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | undefined>(
        undefined
    )
    useEffect(() => {
        setPage(1)
    }, [filters])
    const { photos, isLoading } = usePhotos(filters)
    const selectPhoto = (photo: Photo | undefined) => {
        setSelectedPhoto(photo)
        if (photo !== undefined) {
            const favourites = store.get('favourites ') || []
            store.set('favourites', [...favourites, photo])
        }
    }
    if (isLoading) {
        return <div>Loading...</div>
    }
    const items = photos.photos
    console.log({ items, page })
    const pages = Math.floor(items.length / 6)
    return (
        <div className="Photos">
            {items.length && (
                <div className="Photos__carousel">
                    <Button color="primary" onClick={() => setPage(page - 6)}>
                        Prev
                    </Button>
                    <div className="Photos__items">
                        {items.slice(page, page + 6).map((photo: Photo) => (
                            <PhotoView
                                photo={photo}
                                key={photo.id}
                                onClickPhoto={selectPhoto}
                            />
                        ))}
                    </div>
                    <Button color="primary" onClick={() => setPage(page + 6)}>
                        Next
                    </Button>
                </div>
            )}
            <div className="text-center" hidden>
                Page: {Math.floor(page / 6) + 1} / {pages}
            </div>

            {selectedPhoto ? (
                <div
                    className="SelectedPhoto"
                    onClick={() => selectPhoto(undefined)}
                >
                    <div>
                        <img
                            src={selectedPhoto.img_src}
                            alt={'Mars Rover Photo ' + selectedPhoto.id}
                        />
                        <div className="Photo__details">
                            <div> {selectedPhoto.rover.name} </div>
                            <div>
                                {' '}
                                {selectedPhoto.rover.missionDates || ''}{' '}
                            </div>
                            <div> {selectedPhoto.camera?.name} </div>
                            <div> {selectedPhoto.earth_date} </div>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}
        </div>
    )
})
