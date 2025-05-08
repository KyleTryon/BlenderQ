import { spawn } from 'child_process'
import { QueueTask } from 'contexts/queueContext.js'
import readline from 'readline'

import { scripts } from './python.js'

export const runTaskRender = (
    blenderExec: string,
    blendFile: string,
    task: QueueTask,
    onProgress: (pct: number) => void
): Promise<'DONE'> => {
    return new Promise((resolve, reject) => {
        const child = spawn(
            blenderExec,
            [
                '-b',
                blendFile,
                '--factory-startup',
                '--python',
                scripts.renderTask,
                '--',
                '--outDir',
                task.renderPath,
                '--pattern',
                task.renderFilename,
                '--ext',
                task.renderExtension,
                '--start',
                '1', // or task.startFrame
                '--end',
                String(task.frames), // etc.
            ],
            { stdio: ['ignore', 'pipe', 'pipe'] }
        )

        readline.createInterface({ input: child.stdout }).on('line', (line) => {
            try {
                const msg = JSON.parse(line)
                if (msg.progress !== undefined) onProgress(msg.progress)
                if (msg.status === 'DONE') resolve('DONE')
                if (msg.status === 'ERROR') reject(new Error(msg.msg))
            } catch {
                /* ignore non‑JSON Blender chatter */
            }
        })

        child.stderr.pipe(process.stderr) // optional: surface errors
    })
}
