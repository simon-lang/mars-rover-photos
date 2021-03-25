import axios from 'axios'

const API_URL: string = 'https://api.nasa.gov/mars-photos/api/v1/';
const API_KEY: string = 'wwYXJBLASfX4wNrbLfEetDdx6U3EbRSm1Lx93DGa';

// if (location.host === 'captainclam.github.io') {
//     API_KEY = 'P1YSIZOzLqwxUbFxX2Gvj4vNu9Rgs7qjjpEkld3A';
// } else {
//     API_KEY = 'wwYXJBLASfX4wNrbLfEetDdx6U3EbRSm1Lx93DGa';
// }

export const getPhotos = function(filter) {
    var url;
    url = API_URL + 'rovers/' + filter.rover.toLowerCase() + '/photos' + '?camera=' + filter.camera;
    if (filter.sol != null) {
        url += '&sol=' + filter.sol;
    } else {
        // url += '&earth_date=' + moment(filter.earth_date).format('YYYY-M-D');
    }
    url += '&api_key=' + (API_KEY || 'DEMO_KEY');
    return axios({
        method: 'GET',
        url: url
    });
}


const getManifest = function(rover) {
    return axios({
        method: 'GET',
        url: API_URL + 'manifests/' + rover.toLowerCase() + '?api_key=' + (API_KEY || 'DEMO_KEY')
    }).then(function({data}) {
        return data.photo_manifest;
    });
}

const encode = function(photos) {
    photos = photos.map(function(photo) {
        return {
            img_src: photo.img_src,
            earth_date: photo.earth_date,
            rover: {
                name: photo.rover.name
            },
            camera: {
                name: photo.camera.name
            }
        };
    });
    return window.btoa(JSON.stringify(photos));
}

const decode = function(str) {
    return JSON.parse(window.atob(str));
}
