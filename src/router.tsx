import { Screens } from './screens/index.js'
import { FC, useState } from 'react'
import { ThemeProvider } from './theme/theme.js'
import { ScreenComponent } from './screens/types.js'

const routes = {
    '/splash': Screens.splash,
    '/filePicker': Screens.filePicker,
} as const satisfies Record<string, FC<ScreenComponent>>

export type RouteKey = keyof typeof routes

export const AppRouter = () => {
    const [currentScreen, setCurrentScreen] = useState<RouteKey>('/splash')

    const navigate = (route: RouteKey) => {
        if (routes[route]) {
            setCurrentScreen(route)
        } else {
            throw new Error(`Route ${route} not found`)
        }
    }
    const Screen = routes[currentScreen]

    return (
        <ThemeProvider variant={'normal'}>
            <Screen navigate={navigate} />
        </ThemeProvider>
    )
}
