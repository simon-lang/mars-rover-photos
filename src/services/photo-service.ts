import axios from 'axios'
import dayjs from 'dayjs'
import { SearchFilter } from '../models/SearchFilter'
import useSWR from 'swr'
// import { URLSearchParams } from "url"

const API_URL: string = 'https://api.nasa.gov/mars-photos/api/v1/'
const API_KEY: string = 'wwYXJBLASfX4wNrbLfEetDdx6U3EbRSm1Lx93DGa'

const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
) => {
    const res = await fetch(input, init)
    return res.json()
}

const getUrl = (filter: SearchFilter) => {
    const rover = filter.rover.toLowerCase()
    let url: string = API_URL + 'rovers/' + rover + '/photos?'
    if (filter.camera) {
        url += 'camera=' + filter.camera
    }
    if (filter.sol != null) {
        url += '&sol=' + filter.sol
    } else {
        url += '&earth_date=' + dayjs(filter.earth_date).format('YYYY-M-D')
    }
    url += `&api_key=${API_KEY || 'DEMO_KEY'}`
    // const queryString = new URLSearchParams(filter).toString()
    // console.log({queryString})
    return url
}

export const usePhotos = (filter: SearchFilter) => {
    const url = getUrl(filter)
    const { data, error } = useSWR(url, fetcher)
    return {
        photos: data,
        isLoading: !error && !data,
        isError: error,
    }
}

export const getPhotos = async (filter: SearchFilter) => {
    const url = getUrl(filter)
    return axios({
        method: 'GET',
        url: url,
    })
}

export const getManifest = function (rover: string) {
    return axios({
        method: 'GET',
        url:
            API_URL +
            'manifests/' +
            rover.toLowerCase() +
            '?api_key=' +
            (API_KEY || 'DEMO_KEY'),
    }).then(function ({ data }) {
        return data.photo_manifest
    })
}
