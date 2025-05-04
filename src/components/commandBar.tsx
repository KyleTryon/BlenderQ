import React from 'react'
import { Box, Key, Text, useInput } from 'ink'
import { useTheme } from '../theme/theme.js'
import { Icons, ValidIcon } from 'utils/icons.js'

type Command = {
    input: ((key: Key) => boolean) | string
    label: ValidIcon
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
    input: 'q',
    label: Icons.quit.utf,
    description: 'Quit',
    action: () => process.exit(),
}

export { CommandBar, quitCommand }
export type { Command }
