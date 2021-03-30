import { makeAutoObservable  } from 'mobx';

class Photos {
    items: Array<string> = []
    page: number = 0

    constructor() {
        makeAutoObservable(this)
    }

    set(items) {
        this.items = items
    }

    add(item) {
        this.items.push(item)
    }

    reset() {
        this.items = []
    }

    setPage(i) {
        this.page = i
    }
}

export default Photos

