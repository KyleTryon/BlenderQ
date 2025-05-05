import { Command } from 'components/commandBar.js'
import fs from 'fs'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import os from 'os'
import path from 'path'
import React, { useEffect, useState } from 'react'
import { useIcons } from 'utils/icons.js'

import { ScreenComponent } from './types.js'

interface FilePickerScreenProps extends ScreenComponent {
    dir?: string
}

const FilePickerScreen: React.FC<FilePickerScreenProps> = (props) => {
    const [files, setFiles] = useState<{ label: string; value: string }[]>([])
    const [dir, setDir] = useState(props.dir ?? os.homedir())
    const [notice, setNotice] = useState<string | null>(null)
    const icons = useIcons()

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
                ? `${icons.folder} ${entry}`
                : entry.endsWith('.blend')
                  ? `${icons.blenderFile} ${entry}`
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
            setNotice(null)
        } else {
            setNotice("That's a file — press Space to choose this folder")
        }
    }

    const goToCommand: Command = {
        input: 'g',
        label: icons.goTo,
        description: 'Go to a directory',
        action: () => {
            props.navigate('/filePicker/goTo', {})
        },
    }

    const selectCommand: Command = {
        input: ' ',
        label: icons.spaceKey,
        description: 'Select this folder',
        action: () => {
            const blendFiles = files
                .filter((file) => file.value.endsWith('.blend'))
                .map((file) => file.value)

            if (blendFiles.length > 0) {
                props.navigate('/queue', { blendFiles })
            } else {
                setNotice('No .blend files found in this folder')
            }
        },
    }

    const enterCommand: Command = {
        input: (key) => key.return,
        label: icons.enterKey,
        description: 'Enter directory',
        action: () => {},
    }

    return (
        <DefaultLayout commands={[goToCommand, enterCommand, selectCommand]}>
            <Text>Locate blender files in: {dir}</Text>
            <Box marginTop={1}>
                <SelectInput items={files} onSelect={handleSelect} />
            </Box>
            {notice && (
                <Box marginTop={1}>
                    <Text color="yellow">{notice}</Text>
                </Box>
            )}
        </DefaultLayout>
    )
}

export { FilePickerScreen }
