import { GetTaskProbeData } from 'blender/index.js'
import { Command } from 'components/commandBar.js'
import { Column, DataTable } from 'components/dataTable.js'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import path from 'path'
import React, { useEffect, useMemo, useState } from 'react'
import { useIcons } from 'utils/icons.js'

import { ScreenComponent } from './types.js'

type QueueTaskStatus =
    | 'INITIALIZING'
    | 'QUEUED'
    | 'RUNNING'
    | 'COMPLETED'
    | 'FAILED'

type QueueTask = {
    enabled: boolean
    name: string
    status: QueueTaskStatus
    progress: number
    time: string
    blendFile: string
    outputFile: string
    frames: number
}

type TableRow = Omit<QueueTask, 'blendFile' | 'enabled'> & {
    enabled: string
}

interface QueueScreenProps extends ScreenComponent {
    blendFiles: string[]
}

const useTaskQueue = (blendFiles: string[]): QueueTask[] => {
    const [tasks, setTasks] = useState<QueueTask[]>([])

    useEffect(() => {
        if (!Array.isArray(blendFiles)) return

        // 1.  Initialise every task as "INITIALIZING"
        const initial: QueueTask[] = blendFiles.map((blendFile) => ({
            enabled: true,
            name: path.basename(blendFile).split('.')[0],
            status: 'INITIALIZING',
            progress: 0,
            time: '00:00',
            blendFile,
            outputFile: '',
            frames: 0,
        }))
        setTasks(initial)

        // 2.  Probe sequentially so the UI updates one at a time
        const probeSequentially = async () => {
            for (const blendFile of blendFiles) {
                try {
                    const { outputFile, frames } =
                        await GetTaskProbeData(blendFile)

                    // mark as QUEUED
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.blendFile === blendFile
                                ? {
                                      ...t,
                                      status: 'QUEUED',
                                      outputFile,
                                      frames,
                                  }
                                : t
                        )
                    )
                } catch (e) {
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.blendFile === blendFile
                                ? {
                                      ...t,
                                      status: 'FAILED',
                                      outputFile: '',
                                      frames: 0,
                                  }
                                : t
                        )
                    )
                }
            }
        }

        probeSequentially()
    }, [blendFiles])

    return tasks
}

export const QueueScreen: React.FC<QueueScreenProps> = ({ blendFiles }) => {
    const tasks = useTaskQueue(blendFiles)
    const icons = useIcons()

    const [selectedRow, setSelectedRow] = useState(0)

    const columns: Column<Record<string, any>>[] = [
        { label: icons.checkBoxOpen, dataKey: 'enabled', width: 4 },
        { label: 'STATUS', dataKey: 'status', width: 11, color: 'cyan' },
        { label: 'NAME', dataKey: 'name', width: 18 },
        { label: 'PROGRESS', dataKey: 'progress', width: 18 },
        { label: 'TIME', dataKey: 'time', width: 6 },
        { label: 'FRAMES', dataKey: 'frames', width: 7 },
    ]

    const tableData: TableRow[] = useMemo(
        () =>
            tasks.map(
                ({ enabled, ...rest }): TableRow => ({
                    ...rest,
                    enabled: enabled
                        ? icons.checkBoxFilled
                        : icons.checkBoxOpen,
                })
            ),
        [tasks, icons]
    )

    const startCommand: Command = {
        input: 's',
        label: '[s]',
        description: 'Start (all)}',
        action: () => {},
    }

    const editCommand: Command = {
        input: 'e',
        label: '[e]',
        description: 'Edit output (selected)',
        action: () => {},
    }

    return (
        <DefaultLayout commands={[startCommand, editCommand]}>
            <DataTable
                data={tableData}
                columns={columns}
                selected={selectedRow}
                onSelect={setSelectedRow}
            />
        </DefaultLayout>
    )
}
