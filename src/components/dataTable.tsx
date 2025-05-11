import { Box, useInput, Text } from 'ink'
import React, { useEffect, useState } from 'react'

// Inline substitute for ink-use-stdout-dimensions
function useStdoutDimensions(): [number, number] {
    const [dimensions, setDimensions] = useState<[number, number]>(() => {
        const { columns = 0, rows = 0 } = process.stdout;
        return [columns, rows];
    });
    useEffect(() => {
        const onResize = () => {
            const { columns = 0, rows = 0 } = process.stdout;
            setDimensions([columns, rows]);
        };
        process.stdout.on('resize', onResize);
        return () => {
            process.stdout.off('resize', onResize);
        };
    }, []);
    return dimensions;
}

export type Column<Row> = {
    label: string
    dataKey: keyof Row
    width?: number | `flex-${number}` // number = fixed min width; flex-N = share of remaining space
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
    const [termWidth] = useStdoutDimensions()
    const { data, columns, selected, onSelect } = props

    // Determine fixed widths and flex units
    const fixedWidths = columns.map(col =>
        typeof col.width === 'number'
            ? col.width
            : typeof col.width === 'string' && col.width.startsWith('flex-')
            ? 0 // flex columns count later
            : col.label.length
    )
    const totalFixed = fixedWidths.reduce((a, b) => a + b, 0)
    const totalSpaces = columns.length // one space between columns
    const flexCols = columns.map(col =>
        typeof col.width === 'string' && col.width.startsWith('flex-')
            ? parseInt(col.width.split('-')[1], 10)
            : 0
    )
    const totalFlexUnits = flexCols.reduce((a, b) => a + b, 0)
    const remaining = Math.max(
        0,
        termWidth - totalFixed - totalSpaces
    )
    // Allocate widths
    const flexWidths = flexCols.map(units =>
        totalFlexUnits > 0
            ? Math.floor((units / totalFlexUnits) * remaining)
            : 0
    )
    // Distribute any leftover columns to the first flex columns
    let leftover = remaining - flexWidths.reduce((a, b) => a + b, 0)
    const extraWidths = flexCols.map((units, idx) => {
        if (leftover > 0 && units > 0) {
            leftover--
            return 1
        }
        return 0
    })
    // Final widths per column
    const colWidths = columns.map((col, idx) => {
        if (typeof col.width === 'number') return col.width
        if (typeof col.width === 'string' && col.width.startsWith('flex-')) {
            return flexWidths[idx] + extraWidths[idx]
        }
        return col.label.length
    })

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
                {columns.map((col, colIndex) => (
                    <Text bold key={String(col.dataKey)}>
                        {fmt(col.label, colWidths[colIndex])}{' '}
                    </Text>
                ))}
            </Box>

            {data.map((row, idx) => {
                const isSelected = idx === current
                return (
                    <Box key={idx}>
                        {columns.map((col, colIndex) => {
                            const raw = String(row[col.dataKey] ?? '')
                            const cell = fmt(raw, colWidths[colIndex])
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
