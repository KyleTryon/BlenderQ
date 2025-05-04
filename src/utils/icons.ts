type Icon = {
    utf: string
    emoji: string
}

export const Icons: Record<string, Icon> = {
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
}

export type ValidIcon = keyof typeof Icons
