import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { TextField, Select, MenuItem } from '@material-ui/core'
import { observer } from 'mobx-react'

export const FiltersView = observer(({ filters, photos }) => {
    const [cameras, setCameras] = useState<string[]>([])
    useEffect(() => {
        const uniqueCameras: string[] = _.uniq(photos.items.map((d) => d.camera.name))
        setCameras(['', ...uniqueCameras])
    }, [photos.items])
    return (
        <div className="Filters">
            <div className="Filters__item">
                <Select
                    label="Rover"
                    value={filters.rover}
                    onChange={(e) => filters.setRover(e.target.value)}
                >
                    <MenuItem value="perseverance">Perseverance</MenuItem>
                    <MenuItem value="curiosity">Curiosity</MenuItem>
                    <MenuItem value="opportunity">Opportunity</MenuItem>
                    <MenuItem value="spirit">Spirit</MenuItem>
                </Select>
            </div>
            {false && (
                <div className="Filters__item">
                    <Select
                        label="Camera"
                        value={filters.camera}
                        onChange={(e) => filters.setCamera(e.target.value)}
                    >
                        {cameras.map((camera) => (
                            <MenuItem value={camera}>
                                {camera || 'All'}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            )}
            {false && (
                <div className="Filters__item">
                    <TextField
                        label="Sol"
                        value={filters.sol}
                        onChange={(e) => filters.setSol(e.target.value)}
                        type="number"
                    />
                </div>
            )}
        </div>
    )
})
