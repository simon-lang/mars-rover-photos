import { useState, useEffect } from 'react'
import _ from 'lodash'
import { Button } from '@material-ui/core'
import { Photo } from '../models/Photo'
import { SearchFilter } from '../models/SearchFilter'
import { getPhotos } from '../services/photo-service'
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

export const PhotosView = observer(({ photos, filters }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | undefined>(
        undefined
    )
    useEffect(() => {
        photos.set([])
        const params: SearchFilter = {
            rover: filters.rover,
            sol: filters.sol,
        }
        if (filters.camera) {
            params.camera = filters.camera
        }
        getPhotos(params).then((res) => {
            console.log(res.data.photos)
            photos.set(res.data.photos)
            photos.setPage(0)
        })
    }, [filters.rover, filters.camera, filters.sol, photos])
    const selectPhoto = (photo: Photo | undefined) => {
        setSelectedPhoto(photo)
    }
    const { items, page } = photos
    if (!items) {
        return <div>Loading...</div>
    }
    const pages = Math.floor(items.length / 6)
    return (
        <div className="Photos">
            {items.length && (
                <div className="Photos__carousel">
                    <Button
                        color="primary"
                        onClick={() => photos.setPage(page - 6)}
                    >
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
                    <Button
                        color="primary"
                        onClick={() => photos.setPage(page + 6)}
                    >
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
