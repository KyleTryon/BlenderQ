import { Screens } from './screens/index.js'
import { FC, useState } from 'react'
import { ThemeProvider } from './theme/theme.js'
import { ScreenComponent } from './screens/types.js'

type RouteMap = {
    '/splash': ScreenComponent
    '/filePicker': ScreenComponent & { dir?: string }
    '/filePicker/goTo': ScreenComponent
}

const routes: {
    [K in keyof RouteMap]: FC<RouteMap[K]>
} = {
    '/splash': Screens.splash,
    '/filePicker': Screens.filePicker,
    '/filePicker/goTo': Screens.goTo,
}

export type RouteKey = keyof typeof routes

export const AppRouter = (route: RouteKey, params?: any) => {
    const [current, setCurrent] = useState<{
        route: RouteKey
        params?: Record<string, unknown>
    }>({
        route: route,
        params: params ?? {},
    })

    const navigate = (route: RouteKey, params?: Record<string, unknown>) => {
        if (routes[route]) {
            setCurrent({ route, params: { ...current.params, ...params } })
        } else {
            throw new Error(`Route ${route} not found`)
        }
    }

    const Screen = routes[current.route]

    return (
        <ThemeProvider variant={'normal'}>
            <Screen navigate={navigate} {...(current.params ?? {})} />
        </ThemeProvider>
    )
}
