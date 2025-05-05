import { FC, useState } from 'react'

import { Screens } from './screens/index.js'
import { ScreenComponent } from './screens/types.js'
import { ThemeProvider } from './theme/theme.js'

type RouteMap = {
    '/splash': {}
    '/filePicker': { dir?: string }
    '/filePicker/goTo': {}
    '/queue': { blendFiles: string[] }
}

const routes: {
    [K in keyof RouteMap]: FC<RouteMap[K] & ScreenComponent<RouteMap[K]>>
} = {
    '/splash': Screens.splash,
    '/filePicker': Screens.filePicker,
    '/filePicker/goTo': Screens.goTo,
    '/queue': Screens.queue,
}

export type RouteKey = keyof typeof routes

export const AppRouter = (route: RouteKey, params?: RouteMap[RouteKey]) => {
    const [current, setCurrent] = useState<{
        route: RouteKey
        params: RouteMap[RouteKey]
    }>({
        route,
        params: params ?? ({} as RouteMap[RouteKey]),
    })

    const navigate = <K extends RouteKey>(route: K, params?: RouteMap[K]) => {
        if (routes[route]) {
            setCurrent({ route, params: { ...params } as RouteMap[K] })
        } else {
            throw new Error(`Route ${route} not found`)
        }
    }

    const Screen = routes[current.route] as FC<any>

    return (
        <ThemeProvider variant="normal">
            <Screen navigate={navigate} {...current.params} />
        </ThemeProvider>
    )
}
