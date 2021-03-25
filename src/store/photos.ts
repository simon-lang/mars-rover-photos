import { makeAutoObservable  } from 'mobx';

class Photos {
    items: Array<string> = []

    constructor() {
        makeAutoObservable(this)
    }

    set(items) {
        this.items = items
    }

    add() {
        this.items.push('test')
    }

    reset() {
        this.items = []
    }
}

export default Photos

