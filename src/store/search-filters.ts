import { makeAutoObservable  } from 'mobx';

class SearchFilters {
    rover: string = 'perseverance'
    camera: string = ''
    sol: number = 1

    constructor() {
        makeAutoObservable(this)
    }

    setRover(rover) {
        this.rover = rover
        this.sol = 1
        console.log('setRover', rover)
    }

    setCamera(camera) {
        this.camera = camera
        console.log('setCamera', camera)
    }

    setSol(sol) {
        this.sol = sol
        console.log('setSol', sol)
    }
}

export default SearchFilters

