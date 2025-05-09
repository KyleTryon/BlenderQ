import { Command } from 'components/commandBar.js'
import { Column, DataTable } from 'components/dataTable.js'
import { useIcons } from 'contexts/iconsContext.js'
import { useNavigation } from 'contexts/navContext.js'
import { useQueueContext } from 'contexts/queueContext.js'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import React, { useMemo, useState } from 'react'
import { defineScreen } from 'router/defineScreen.js'

const InnerQueueScreen: React.FC = () => {
    const { tasks, toggleTaskEnabled, startRenderAll } = useQueueContext()
    const icons = useIcons()
    const [selectedRow, setSelectedRow] = useState(0)
    const { navigate } = useNavigation()

    const columns = useMemo<Column<Record<string, any>>[]>(
        () => [
            { label: icons.checkBoxOpen, dataKey: 'enabled', width: 4 },
            { label: 'STATUS', dataKey: 'status', width: 10, color: 'cyan' },
            { label: 'NAME', dataKey: 'name', width: 12 },
            { label: 'PROGRESS', dataKey: 'progress', width: 10 },
            { label: 'TIME', dataKey: 'time', width: 6 },
            { label: 'FRAMES', dataKey: 'frames', width: 6 },
            { label: 'OUTPUT', dataKey: 'output', width: 32 },
        ],
        [icons]
    )

    const tableData = useMemo(
        () =>
            tasks.map(({ ...task }) => ({
                enabled: task.enabled
                    ? icons.checkBoxFilled
                    : icons.checkBoxOpen,
                status: task.status.toUpperCase(),
                name: task.name,
                progress: `${task.progress.toFixed(2)}%`,
                time: task.time,
                frames: task.frames,
                output: `${task.renderPath}${task.renderFilename}${task.renderExtension}`,
            })),
        [tasks, icons]
    )

    const commands = useMemo<Command[]>(
        () => [
            {
                input: 's',
                label: '[s]',
                description: 'Start (all)',
                action: startRenderAll,
            },
            {
                input: 'e',
                label: '[e]',
                description: 'Edit output (selected)',
                action: () => {
                    navigate('/queue/editTaskOutput', {
                        taskIndex: selectedRow,
                    })
                },
            },
            {
                input: 'a',
                label: '[a]',
                description: 'Edit output (all)',
                action: () => {
                    navigate('/queue/editTaskOutput', {
                        taskIndex: -1,
                    })
                },
            },
            {
                input: ' ',
                label: icons.spaceKey,
                description: 'Toggle (selected)',
                action: () => toggleTaskEnabled(selectedRow),
            },
        ],
        [icons, selectedRow, toggleTaskEnabled, startRenderAll]
    )

    return (
        <DefaultLayout commands={commands}>
            <DataTable
                data={tableData}
                columns={columns}
                selected={selectedRow}
                onSelect={setSelectedRow}
            />
        </DefaultLayout>
    )
}

const QueueScreen: React.FC = () => <InnerQueueScreen />

export default defineScreen('/queue', QueueScreen)
