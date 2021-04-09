import { useState } from 'react'
import { Button } from '@material-ui/core'
import { Photo } from '../models/Photo'
import { usePhotos } from '../services/photo-service'
import { observer } from 'mobx-react'

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
        <div
            className={`Photo ${reveal ? 'Photo--reveal' : ''}`}
            style={{ backgroundImage }}
            onClick={() => onClickPhoto(photo)}
        >
            <div className="Photo__details">
                <div hidden> {photo.rover.name} </div>
                <div> {photo.camera.name} </div>
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
    const { photos, isLoading } = usePhotos(filters)
    const selectPhoto = (photo: Photo | undefined) => {
        setSelectedPhoto(photo)
    }
    if (isLoading) {
        return <div>Loading...</div>
    }
    const items = photos.photos
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
                    <img
                        src={selectedPhoto.img_src}
                        alt={'Mars Rover Photo ' + selectedPhoto.id}
                    />
                </div>
            ) : (
                ''
            )}
        </div>
    )
})
