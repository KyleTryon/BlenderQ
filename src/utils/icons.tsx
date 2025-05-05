import React, { createContext, useContext, ReactNode } from 'react'

type Icon = {
    utf: string
    emoji: string
}

const icons = {
    folder: {
        utf: '\uf07b',
        emoji: '📁',
    },
    blenderFile: {
        utf: '\ue766',
        emoji: '📦',
    },
    spaceKey: {
        utf: '\udb84\udc50',
        emoji: '␣',
    },
    enterKey: {
        utf: '\udb80\udf11',
        emoji: '⏎',
    },
    quit: {
        utf: '\udb84\udeb7',
        emoji: '␛',
    },
    goTo: {
        utf: '[g]',
        emoji: '[g]',
    },
    checkBoxOpen: {
        utf: '\udb80\udd30',
        emoji: '○',
    },
    checkBoxFilled: {
        utf: '\udb80\udd2f',
        emoji: '◉',
    },
} as const satisfies Record<string, Icon>

export const Icons = icons

type IconStyle = 'utf' | 'emoji'

type IconsMap = { [K in keyof typeof icons]: string }
const IconsContext = createContext<IconsMap | null>(null)

export const IconsProvider = ({
    style,
    children,
}: {
    style: IconStyle
    children: ReactNode
}) => {
    const selectedIcons: IconsMap = Object.fromEntries(
        Object.entries(icons).map(([key, value]) => [key, value[style]])
    ) as IconsMap

    return (
        <IconsContext.Provider value={selectedIcons}>
            {children}
        </IconsContext.Provider>
    )
}

export const useIcons = () => {
    const context = useContext(IconsContext)
    if (!context) throw new Error('useIcons must be used within an IconsProvider')
    return context
}
