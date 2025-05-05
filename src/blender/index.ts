import path from "path";
import { GetBlenderPath } from "./utils.js";
import { execFile } from "child_process";
import { promisify } from "util";


type BlenderTask = {
    outputFile: string
    frames: number
}

const scripts = {
    taskProbe: path.resolve(__dirname, '/python/taskProbe.py'),
} as const;

export const BLENDER_EXEC = await GetBlenderPath();
const execFileAsync = promisify(execFile);

export const GetTaskProbeData = async (file: string): Promise<BlenderTask> => {
    const { stdout } = await execFileAsync(
        BLENDER_EXEC,
        ['-b', file, '--factory-startup', '--python', scripts.taskProbe],
        { maxBuffer: 1 << 20 }
      );
    
      const info = JSON.parse(stdout.trim());
      return {
        outputFile: info.outputFile,
        frames: info.frames,
      }
}
