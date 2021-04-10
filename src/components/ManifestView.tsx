import './ManifestView.css'
import { FiltersView } from './FiltersView'
import React, { useEffect, useRef } from 'react'
import { getManifest } from '../services/photo-service'
import { observer } from 'mobx-react'
import { navigate } from 'hookrouter'

declare global {
    interface Window {
        vegaEmbed: any
    }
}

const DebugView = (data) => (
    <div>
        <pre>{JSON.stringify(data.data, null, 2)}</pre>
    </div>
)

export const ManifestView = observer(({ manifest, filters }) => {
    useEffect(() => {
        getManifest(filters.rover).then((d) => {
            manifest.set(d)
        })
    }, [filters.rover, manifest])
    const {
        name,
        landing_date,
        launch_date,
        status,
        max_sol,
        max_date,
        total_photos,
        photos,
    } = manifest.data
    const data = {
        name,
        landing_date,
        launch_date,
        status,
        max_sol,
        max_date,
        total_photos,
    }
    // { photos ? <DebugView data={photos} /> : '' }
    const chartRef = useRef(null)
    if (chartRef.current && photos) {
        const values = photos.map((d) => ({
            sol: d.sol,
            date: d.earth_date,
            value: d.total_photos,
        }))
        const spec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
            data: { values },
            config: {
                background: null,
            },
            vconcat: [
                {
                    width: 800,
                    height: 400,
                    transform: [{ filter: { param: 'brush' } }],
                    mark: {
                        type: 'bar',
                        color: 'rgb(153, 45, 50)',
                    },
                    encoding: {
                        x: {
                            field: 'sol',
                            type: 'nominal',
                            axis: false && {
                                title: 'Martian Sol',
                            },
                        },
                        y: {
                            field: 'value',
                            type: 'quantitative',
                            axis: {
                                title: 'Photos',
                            },
                        },
                        tooltip: [
                            {
                                field: 'sol',
                                title: 'Martian Sol',
                            },
                            {
                                field: 'value',
                                title: 'Photos',
                            },
                            {
                                field: 'date',
                                title: 'Earth Date',
                            },
                        ],
                    },
                },
                {
                    width: 800,
                    height: 100,
                    mark: {
                        type: 'bar',
                        color: 'rgb(153, 45, 50)',
                    },
                    params: [
                        {
                            name: 'brush',
                            select: { type: 'interval', encodings: ['x'] },
                        },
                    ],
                    encoding: {
                        x: {
                            field: 'sol',
                            type: 'nominal',
                            axis: false && {
                                title: 'Martian Sol',
                            },
                        },
                        y: {
                            field: 'value',
                            type: 'quantitative',
                            axis: {
                                title: 'Photos',
                            },
                        },
                    },
                },
            ],
        }
        console.log(spec)
        window
            .vegaEmbed(chartRef.current, spec, {
                actions: false,
                theme: 'dark',
            })
            .then(({ view, spec }) => {
                view.addEventListener('click', (event, item) => {
                    if (item && item.datum) {
                        const { sol } = item.datum
                        if (sol) {
                            filters.setSol(sol)
                            navigate('/photos')
                        }
                    }
                })
            })
    }
    // {photos ? `${photos.length} Days` : ""}
    // {data.name ? <DebugView data={data} /> : 'Loading...'}
    return !data ? (
        'Loading...'
    ) : (
        <div className="Manifest">
            <div ref={chartRef}></div>
            <div style={{ paddingLeft: '1em' }}>
                <FiltersView filters={filters} />
                <pre>Rover Selected: {data.name}</pre>
                <pre>Manifest... Loading</pre>
                <pre>Mission Status... {data.status}</pre>
                <pre>Most Recent Photo... {data.max_date}</pre>
                <pre>Days... {data.max_sol?.toLocaleString()}</pre>
                <pre>Total Photos... {data.total_photos?.toLocaleString()}</pre>
                <pre>&gt; Select date to view photos</pre>
            </div>
        </div>
    )
})

// Rover Selected: Perseverance

// Manifest... Loading
// Mission Status... Active
// Most Recent Photo... 2018-03-29

// Raw Data...
