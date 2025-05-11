import { useEffect, useState } from 'react'

// Inline substitute for ink-use-stdout-dimensions
export const useStdoutDimensions = (): [number, number] => {
    const [dimensions, setDimensions] = useState<[number, number]>(() => {
        const { columns = 0, rows = 0 } = process.stdout
        return [columns, rows]
    })
    useEffect(() => {
        const onResize = () => {
            const { columns = 0, rows = 0 } = process.stdout
            setDimensions([columns, rows])
        }
        process.stdout.on('resize', onResize)
        return () => {
            process.stdout.off('resize', onResize)
        }
    }, [])
    return dimensions
}
