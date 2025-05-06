import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);
const fsAccess = promisify(fs.access);
const fsReaddir = promisify(fs.readdir);
const fsStat = promisify(fs.stat);

/**
 * Finds the path to the Blender executable across different operating systems.
 * Checks environment variables, PATH, and common installation locations.
 * 
 * @returns Promise resolving to the path of the Blender executable or throws an error if not found
 */
export async function GetBlenderPath(): Promise<string> {
  // First check if BLENDER_PATH environment variable is set
  if (process.env.BLENDER_PATH) {
    try {
      await fsAccess(process.env.BLENDER_PATH, fs.constants.X_OK);
      return process.env.BLENDER_PATH;
    } catch (err) {
      {/* Ignore error if the path is not executable */}
    }
  }

  const platform = os.platform();
  
  // Try to find Blender in PATH
  try {
    let command = 'which blender';
    if (platform === 'win32') {
      command = 'where blender';
    }
    
    const { stdout } = await execPromise(command);
    const pathResult = stdout.trim();
    
    if (pathResult && await isExecutable(pathResult)) {
      return pathResult;
    }
  } catch (err) {
    {/* Ignore error if 'which' or 'where' command fails */}
  }
  
  // Check common installation locations based on platform
  if (platform === 'darwin') {
    // macOS common locations
    const macLocations = [
      '/Applications/Blender.app/Contents/MacOS/Blender',
      '/Applications/Blender/Blender.app/Contents/MacOS/Blender'
    ];
    
    // Check for versioned Blender installations
    try {
      const appDirs = await fsReaddir('/Applications');
      for (const dir of appDirs) {
        if (dir.startsWith('Blender ') && dir.endsWith('.app')) {
          macLocations.push(`/Applications/${dir}/Contents/MacOS/Blender`);
        }
      }
    } catch (err) {
      {/* Continue if directory doesn't exist */}
    }
    
    for (const location of macLocations) {
      try {
        await fsAccess(location, fs.constants.X_OK);
        return location;
      } catch (err) {
        // Continue to next location
      }
    }
  } else if (platform === 'win32') {
    // Windows common locations
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    
    const winLocations = [
      `${programFiles}\\Blender Foundation\\Blender\\blender.exe`,
      `${programFilesX86}\\Blender Foundation\\Blender\\blender.exe`
    ];
    
    // Check for versioned Blender installations
    for (const baseDir of [programFiles, programFilesX86]) {
      try {
        const blenderDir = path.join(baseDir, 'Blender Foundation');
        const exists = await pathExists(blenderDir);
        
        if (exists) {
          const subDirs = await fsReaddir(blenderDir);
          for (const dir of subDirs) {
            if (dir.startsWith('Blender ')) {
              winLocations.push(path.join(blenderDir, dir, 'blender.exe'));
            }
          }
        }
      } catch (err) {
        {/* Continue if directory doesn't exist */}
      }
    }
    
    for (const location of winLocations) {
      try {
        await fsAccess(location, fs.constants.X_OK);
        return location;
      } catch (err) {
        {/* Continue to next location */}
      }
    }
  } else if (platform === 'linux') {
    // Linux common locations
    const linuxLocations = [
      '/usr/bin/blender',
      '/usr/local/bin/blender',
      '/opt/blender/blender'
    ];
    
    // Check for versioned Blender installations in /opt
    try {
      const optDirs = await fsReaddir('/opt');
      for (const dir of optDirs) {
        if (dir.startsWith('blender')) {
          linuxLocations.push(`/opt/${dir}/blender`);
        }
      }
    } catch (err) {
      {/* Continue if directory doesn't exist */}
    }
    
    for (const location of linuxLocations) {
      try {
        await fsAccess(location, fs.constants.X_OK);
        return location;
      } catch (err) {
        {/* Continue to next location */}
      }
    }
  }
  
  // If still not found, throw an error
  throw new Error('Blender executable not found. Please install Blender or set the BLENDER_PATH environment variable.');
}

/**
 * Helper function to check if a path exists
 */
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fsAccess(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Helper function to check if a path is executable
 */
async function isExecutable(filePath: string): Promise<boolean> {
  try {
    await fsAccess(filePath, fs.constants.X_OK);
    const stats = await fsStat(filePath);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}