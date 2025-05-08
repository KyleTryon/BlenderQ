import { Config } from 'utils/config.js'

import { routes } from './registerRoutes.js'

export type AppRouterProps = {
    initialRoute: RouteKey
    initialParams: any
    config: Config
}

export type RouteKey = keyof typeof routes

export type RouteParams<K extends RouteKey> =
    Parameters<(typeof routes)[K]>[0] extends Record<string, unknown>
        ? Parameters<(typeof routes)[K]>[0]
        : never

export type NavigateFn = <K extends RouteKey>(
    route: K,
    params: RouteParams<K>
) => void
