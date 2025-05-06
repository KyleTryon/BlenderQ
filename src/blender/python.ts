import path from 'path'
import { __dirname } from './utils.js'
export const scripts = {
    taskProbe: path.resolve(__dirname, 'python/task_probe.py'),
} as const