import { Box, Text, useInput, Key } from 'ink'
import React from 'react'
import { Icons } from 'utils/icons.js'

import { useTheme } from '../theme/theme.js'

type Command = {
    input: string | ((key: Key) => boolean)
    label: string
    description: string
    action: () => void
}

type Props = {
    commands: Command[]
}

const CommandBar: React.FC<Props> = ({ commands }) => {
    const { theme } = useTheme()

    useInput((input, key) => {
        const matched = commands.find((cmd) => {
            if (typeof cmd.input === 'string') {
                return cmd.input.toLowerCase() === input.toLowerCase()
            } else {
                return cmd.input(key)
            }
        })
        if (matched) {
            matched.action()
        }
    })

    return (
        <Box {...theme.styles.footer()}>
            {commands.map(({ label, description }, idx) => (
                <Text key={idx}>
                    {label} {description}
                </Text>
            ))}
        </Box>
    )
}

const quitCommand: Command = {
    input: (key) => key.escape,
    label: Icons.quit.utf,
    description: 'Quit',
    action: () => process.exit(),
}

export { CommandBar, quitCommand }
export type { Command }
