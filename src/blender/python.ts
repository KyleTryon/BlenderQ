import path from 'path'

import { __dirname } from './utils.js'
export const scripts = {
    taskProbe: path.resolve(__dirname, 'python/task_probe.py'),
    renderTask: path.resolve(__dirname, 'python/render_task.py'),
} as const
