import { Box, Text } from 'ink'

export type Column<Row> = {
    label: string
    dataKey: keyof Row
    width?: number // min width; default = label.length
    color?: string // ink color name
}

export const DataTable: React.FC<{
    data: Record<string, any>[]
    columns: Column<Record<string, any>>[]
}> = (props) => {
    const { data, columns } = props

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

            {data.map((row, idx) => (
                <Box key={idx}>
                    {columns.map((col) => {
                        const raw = String(row[col.dataKey] ?? '')
                        const cell = fmt(raw, col.width ?? col.label.length)
                        return (
                            <Text key={String(col.dataKey)} color={col.color}>
                                {cell}{' '}
                            </Text>
                        )
                    })}
                </Box>
            ))}
        </Box>
    )
}
