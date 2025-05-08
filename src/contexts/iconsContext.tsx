import { createContext, ReactNode, useContext } from 'react'
import { Icons, IconsMap, IconStyle } from 'utils/icons.js'

const IconsContext = createContext<IconsMap | null>(null)

export const IconsProvider = ({
    style,
    children,
}: {
    style: IconStyle
    children: ReactNode
}) => {
    const selectedIcons: IconsMap = Object.fromEntries(
        Object.entries(Icons).map(([key, value]) => [key, value[style]])
    ) as IconsMap

    return (
        <IconsContext.Provider value={selectedIcons}>
            {children}
        </IconsContext.Provider>
    )
}

export const useIcons = () => {
    const context = useContext(IconsContext)
    if (!context)
        throw new Error('useIcons must be used within an IconsProvider')
    return context
}
