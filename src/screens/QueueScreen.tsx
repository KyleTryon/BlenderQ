import { Column, DataTable } from 'components/datatable.js'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import path from 'path'
import React, { useEffect, useState } from 'react'

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

interface QueueScreenProps extends ScreenComponent<{ blendFiles: string[] }> {
    blendFiles: string[]
}

export const QueueScreen: React.FC<QueueScreenProps> = ({ blendFiles }) => {
    const [tasks, setTasks] = useState<QueueTask[]>([])
    const [tableData, setTableData] = useState<TableRow[]>([])

    const columns: Column<Record<string, any>>[] = [
        { label: '○', dataKey: 'enabled', width: 2 },
        { label: 'STATUS', dataKey: 'status', width: 11, color: 'cyan' },
        { label: 'NAME', dataKey: 'name', width: 18 },
        { label: 'PROGRESS', dataKey: 'progress', width: 18 },
        { label: 'TIME', dataKey: 'time', width: 6 },
        { label: 'FRAMES', dataKey: 'frames', width: 7 },
    ]

    useEffect(() => {
        const newTasks = blendFiles.map(
            (blendFile): QueueTask => ({
                enabled: true,
                name: path.basename(blendFile),
                status: 'INITIALIZING',
                progress: 0,
                time: '00:00',
                blendFile,
                outputFile: '',
                frames: 0,
            })
        )
        setTasks(newTasks)
    }, [blendFiles])

    useEffect(() => {
        const interval = setInterval(() => {
            setTableData(
                tasks.map(
                    ({ enabled, ...rest }): TableRow => ({
                        ...rest,
                        enabled: enabled ? '◉' : '○',
                    })
                )
            )
        }, 500)

        return () => clearInterval(interval)
    }, [tasks])

    return (
        <DefaultLayout>
            <DataTable data={tableData} columns={columns} />
        </DefaultLayout>
    )
}
