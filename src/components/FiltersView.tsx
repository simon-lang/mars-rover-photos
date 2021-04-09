import { TextField, Select, MenuItem } from '@material-ui/core'
import { observer } from 'mobx-react'

export const FiltersView = observer(({ filters }) => {
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
