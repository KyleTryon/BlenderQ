import { RouteKey } from '../router.js'

export interface ScreenComponent<T = {}> {
    navigate: (route: RouteKey, params?: T) => void
}
