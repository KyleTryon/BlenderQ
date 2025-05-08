type Icon = {
    utf: string
    emoji: string
}

export const Icons = {
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

export type IconStyle = 'utf' | 'emoji'

export type IconsMap = { [K in keyof typeof Icons]: string }
