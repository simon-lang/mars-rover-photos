import { makeAutoObservable } from 'mobx'

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
        if (i < 0) i = 0
        if (i >= this.items.length) i = this.items.length - 1
        this.page = i
    }
}

export default Photos
