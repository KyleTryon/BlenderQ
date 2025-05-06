import { execFile } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { GetBlenderPath } from './utils.js'

type BlenderTask = {
    outputFile: string
    frames: number
}

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const scripts = {
    taskProbe: path.resolve(__dirname, 'python/task_probe.py'),
} as const

export const BLENDER_EXEC = await GetBlenderPath()
const execFileAsync = promisify(execFile)

export const GetTaskProbeData = async (file: string): Promise<BlenderTask> => {
    if (!fs.existsSync(scripts.taskProbe)) {
        console.error(
            '[GetTaskProbeData] taskProbe.py not found at',
            scripts.taskProbe
        )
    }

    let stdout: string
    let stderr: string
    try {
        const result = await execFileAsync(
            BLENDER_EXEC,
            ['-b', file, '--factory-startup', '--python', scripts.taskProbe],
            { maxBuffer: 1 << 20 }
        )
        stdout = result.stdout
        stderr = result.stderr
    } catch (err: any) {
        // execFileAsync throws on non‑zero exit codes; capture stderr if present
        stdout = err?.stdout ?? ''
        stderr = err?.stderr ?? ''
        console.error(
            '[GetTaskProbeData] execFileAsync failed – exit code',
            err?.code,
            '\nStderr tail:\n',
            stderr
                .trim()
                .split('\n')
                .slice(-20)
                .join('\n')
        )
        throw err
    }

    /**
     * Blender writes a lot of startup logs to stdout before our Python
     * script prints its JSON summary.  Scan lines from the end until one
     * parses as JSON.
     */
    let info: any | undefined
    for (const line of stdout.trim().split('\n').reverse()) {
        try {
            info = JSON.parse(line)
            break
        } catch {
            /* keep scanning */
        }
    }

    if (!info) {
        throw new Error(
            `GetTaskProbeData: unable to locate JSON in Blender output:\n${stdout}`
        )
    }

    return {
        outputFile: info.outputFile,
        frames: info.frames,
    }
}
