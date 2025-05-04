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

export const AppRouter = () => {
    const [current, setCurrent] = useState<{
        route: RouteKey
        props?: Record<string, unknown>
    }>({
        route: '/splash',
        props: {},
    })

    const navigate = (route: RouteKey, props?: Record<string, unknown>) => {
        if (routes[route]) {
            setCurrent({ route, props })
        } else {
            throw new Error(`Route ${route} not found`)
        }
    }

    const Screen = routes[current.route]

    return (
        <ThemeProvider variant={'normal'}>
            <Screen navigate={navigate} {...(current.props ?? {})} />
        </ThemeProvider>
    )
}
