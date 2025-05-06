import { Box, Text, useInput } from 'ink'
import React, { useEffect, useState } from 'react'

export type Column<Row> = {
    label: string
    dataKey: keyof Row
    width?: number // min width; default = label.length
    color?: string // ink color name
}

export const DataTable: React.FC<{
    data: Record<string, any>[]
    columns: Column<Record<string, any>>[]
    /** Zero‑based index of the currently selected row (controlled). */
    selected?: number
    /** Callback fired whenever the selected row changes. */
    onSelect?: (index: number) => void
}> = (props) => {
    const { data, columns, selected, onSelect } = props
    const [internalSelected, setInternalSelected] = useState(selected ?? 0)

    // keep internal state in sync when controlled
    useEffect(() => {
        if (selected !== undefined) setInternalSelected(selected)
    }, [selected])

    const current = selected ?? internalSelected

    useInput((_input, key) => {
        if (key.upArrow) {
            const next = current > 0 ? current - 1 : 0
            if (selected === undefined) setInternalSelected(next)
            onSelect?.(next)
        } else if (key.downArrow) {
            const next =
                current < data.length - 1 ? current + 1 : data.length - 1
            if (selected === undefined) setInternalSelected(next)
            onSelect?.(next)
        }
    })

    const fmt = (s: string, w: number) =>
        s.length >= w ? s.slice(0, w) : s.padEnd(w)

    return (
        <Box flexDirection="column">
            <Box>
                {columns.map((col) => (
                    <Text bold key={String(col.dataKey)}>
                        {fmt(col.label, col.width ?? col.label.length)}{' '}
                    </Text>
                ))}
            </Box>

            {data.map((row, idx) => {
                const isSelected = idx === current
                return (
                    <Box key={idx}>
                        {columns.map((col) => {
                            const raw = String(row[col.dataKey] ?? '')
                            const cell = fmt(raw, col.width ?? col.label.length)
                            return (
                                <Text
                                    key={String(col.dataKey)}
                                    color={col.color}
                                    inverse={isSelected}
                                >
                                    {cell}{' '}
                                </Text>
                            )
                        })}
                    </Box>
                )
            })}
        </Box>
    )
}
