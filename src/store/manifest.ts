import { makeAutoObservable } from 'mobx'

class Manifest {
    data: any = {}

    constructor() {
        makeAutoObservable(this)
    }

    set(data) {
        this.data = data
    }
}

export default Manifest
