import { Camera } from './Camera'
import { Rover } from './Rover'

export interface Photo {
    id: number
    img_src: string
    rover: Rover
    camera: Camera
    earth_date: string 
}
