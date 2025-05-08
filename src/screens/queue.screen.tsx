import { Command } from 'components/commandBar.js'
import { Column, DataTable } from 'components/dataTable.js'
import { useIcons } from 'contexts/iconsContext.js'
import { useNavigation } from 'contexts/navContext.js'
import { useQueueContext } from 'contexts/queueContext.js'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import React, { useMemo, useState } from 'react'
import { defineScreen } from 'router/defineScreen.js'

const InnerQueueScreen: React.FC = () => {
    const { tasks, toggleTaskEnabled } = useQueueContext()
    const icons = useIcons()
    const [selectedRow, setSelectedRow] = useState(0)
    const { navigate } = useNavigation()

    const columns = useMemo<Column<Record<string, any>>[]>(
        () => [
            { label: icons.checkBoxOpen, dataKey: 'enabled', width: 4 },
            { label: 'STATUS', dataKey: 'status', width: 11, color: 'cyan' },
            { label: 'NAME', dataKey: 'name', width: 18 },
            { label: 'PROGRESS', dataKey: 'progress', width: 18 },
            { label: 'TIME', dataKey: 'time', width: 6 },
            { label: 'FRAMES', dataKey: 'frames', width: 7 },
            { label: 'OUTPUT', dataKey: 'outputFile', width: 20 },
        ],
        [icons]
    )

    const tableData = useMemo(
        () =>
            tasks.map(({ enabled, ...rest }) => ({
                ...rest,
                enabled: enabled ? icons.checkBoxFilled : icons.checkBoxOpen,
            })),
        [tasks, icons]
    )

    const commands = useMemo<Command[]>(
        () => [
            {
                input: 's',
                label: '[s]',
                description: 'Start (all)',
                action: () => {},
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
                input: ' ',
                label: icons.spaceKey,
                description: 'Toggle (selected)',
                action: () => toggleTaskEnabled(selectedRow),
            },
        ],
        [icons, selectedRow, toggleTaskEnabled]
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
