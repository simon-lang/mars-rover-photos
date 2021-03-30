import axios from 'axios'
import dayjs from 'dayjs'

const API_URL: string = 'https://api.nasa.gov/mars-photos/api/v1/'
const API_KEY: string = 'wwYXJBLASfX4wNrbLfEetDdx6U3EbRSm1Lx93DGa'

export const getPhotos = async (filter) => {
    let url: string = API_URL + 'rovers/' + filter.rover.toLowerCase() + '/photos?camera=' + filter.camera
    if (filter.sol != null) {
        url += '&sol=' + filter.sol
    } else {
        url += '&earth_date=' + dayjs(filter.earth_date).format('YYYY-M-D')
    }
    url += `&api_key=${ API_KEY || 'DEMO_KEY' }`
    return axios({
        method: 'GET',
        url: url
    })
}

export const getManifest = function(rover: string) {
    return axios({
        method: 'GET',
        url: API_URL + 'manifests/' + rover.toLowerCase() + '?api_key=' + (API_KEY || 'DEMO_KEY')
    }).then(function({data}) {
        return data.photo_manifest
    })
}
