import { Command } from 'components/commandBar.js'
import fs from 'fs'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import os from 'os'
import path from 'path'
import React, { useEffect, useState } from 'react'
import { Icons } from 'utils/icons.js'

import { ScreenComponent } from './types.js'

interface FilePickerScreenProps extends ScreenComponent {
    dir?: string
}

const FilePickerScreen: React.FC<FilePickerScreenProps> = (props) => {
    const [files, setFiles] = useState<{ label: string; value: string }[]>([])
    const [dir, setDir] = useState(props.dir ?? os.homedir())

    useEffect(() => {
        if (props.dir) {
            setDir(props.dir)
        }
    }, [props.dir])
    useEffect(() => {
        const entries = fs.readdirSync(dir).filter((entry) => {
            const fullPath = path.join(dir, entry)
            const stat = fs.statSync(fullPath)
            return (
                (stat.isDirectory() && !entry.startsWith('.')) ||
                entry.endsWith('.blend')
            )
        })
        const formatted = entries.map((entry) => {
            const fullPath = path.join(dir, entry)
            const stat = fs.statSync(fullPath)
            const isDir = stat.isDirectory()
            const label = isDir
                ? `${Icons.folder.utf} ${entry}`
                : entry.endsWith('.blend')
                  ? `${Icons.blenderFile.utf} ${entry}`
                  : entry
            return {
                label,
                value: fullPath,
            }
        })
        setFiles(formatted)
    }, [dir])

    const handleSelect = (item: { label: string; value: string }) => {
        const stat = fs.statSync(item.value)
        if (stat.isDirectory()) {
            setDir(item.value)
        } else {
            props.navigate('/splash')
        }
    }

    const goToCommand: Command = {
        input: 'g',
        label: Icons.goTo.utf,
        description: 'Go to a directory',
        action: () => {
            props.navigate('/filePicker/goTo')
        },
    }

    return (
        <DefaultLayout commands={[goToCommand]}>
            <Text>Locate blender files in: {dir}</Text>
            <Box marginTop={1}>
                <SelectInput items={files} onSelect={handleSelect} />
            </Box>
        </DefaultLayout>
    )
}

export { FilePickerScreen }
