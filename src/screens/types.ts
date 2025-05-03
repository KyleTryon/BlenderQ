import { RouteKey } from '../router.js'

export interface ScreenComponent {
    navigate: (route: RouteKey) => void
}
