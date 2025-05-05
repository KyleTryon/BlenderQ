import { RouteKey, RouteParams } from '../router.js'

export interface ScreenComponent {
    navigate: <K extends RouteKey>(route: K, params: RouteParams[K]) => void
}
