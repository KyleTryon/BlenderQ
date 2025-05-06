
import { getTaskProbeData } from './taskProbe.js'
import { BlenderTask } from './types.js'
import { GetBlenderPath } from './utils.js'
export const BLENDER_EXEC = await GetBlenderPath()
export const GetTaskProbeData = getTaskProbeData.bind(null, BLENDER_EXEC) as
  (file: string) => Promise<BlenderTask>