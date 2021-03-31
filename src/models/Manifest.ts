export type ManifestName = 'spirit' | 'opportunity' | 'curiosity' | 'perseverance'

export interface ManifestItem {}

export interface Manifest {
	landing_date: string
	launch_date: string
	max_date: string
	max_sol: number
	name: ManifestName
	photos: Array<any>
	status: string
	total_photos: number
}
