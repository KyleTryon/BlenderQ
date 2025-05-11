import { Command } from 'components/commandBar.js'
import { useIcons } from 'contexts/iconsContext.js'
import { useNavigation } from 'contexts/navContext.js'
import fs from 'fs'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import os from 'os'
import path from 'path'
import { FC, useEffect, useState } from 'react'
import { defineScreen } from 'router/defineScreen.js'

type Params = { dir?: string }

const FilePickerScreen: FC<Params> = ({ dir: initialDir }) => {
    const { navigate } = useNavigation()
    const icons = useIcons()

    const [currentDir, setCurrentDir] = useState(initialDir ?? os.homedir())
    const [files, setFiles] = useState<{ label: string; value: string }[]>([])
    const [notice, setNotice] = useState<string | null>(null)

    useEffect(() => {
        const entries = fs.readdirSync(currentDir).filter((entry) => {
            const fullPath = path.join(currentDir, entry)
            const stat = fs.statSync(fullPath)
            return (
                (stat.isDirectory() && !entry.startsWith('.')) ||
                entry.endsWith('.blend')
            )
        })

        const formatted = entries.map((entry) => {
            const fullPath = path.join(currentDir, entry)
            const stat = fs.statSync(fullPath)
            const isDir = stat.isDirectory()
            const label = isDir
                ? `${icons.folder} ${entry}`
                : entry.endsWith('.blend')
                  ? `${icons.blenderFile} ${entry}`
                  : entry
            return { label, value: fullPath }
        })

        setFiles(formatted)
    }, [currentDir, icons])

    const handleSelect = (item: { label: string; value: string }) => {
        const stat = fs.statSync(item.value)
        if (stat.isDirectory()) {
            setCurrentDir(item.value)
            setNotice(null)
        } else {
            setNotice("That's a file — press Space to choose this folder")
        }
    }

    const goToCommand: Command = {
        input: 'g',
        label: icons.goTo,
        description: 'Go to a directory',
        action: () => navigate('/filePicker/goTo', {}),
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
                navigate('/queue', { blendFiles })
            } else {
                setNotice('No .blend files found in this folder')
            }
        },
    }

    // Helper to find all .blend files recursively in a directory
    const findBlendFilesRecursively = (dir: string): string[] => {
        let results: string[] = []
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
            if (entry.name.startsWith('.')) continue
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                results.push(...findBlendFilesRecursively(fullPath))
            } else if (entry.name.endsWith('.blend')) {
                results.push(fullPath)
            }
        }
        return results
    }

    const findCommand: Command = {
        input: 'f',
        label: '[f]',
        description: 'Find .blend files recursively',
        action: () => {
            const blendFiles = findBlendFilesRecursively(currentDir)
            if (blendFiles.length > 0) {
                navigate('/queue', { blendFiles })
            } else {
                setNotice('No .blend files found recursively')
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
        <DefaultLayout commands={[goToCommand, enterCommand, selectCommand, findCommand]}>
            <Text>Locate blender files in: {currentDir}</Text>
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

export default defineScreen('/filePicker', FilePickerScreen)
