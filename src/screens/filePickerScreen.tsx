import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import fs from "fs";
import path from "path";
import os from "os";
import { ScreenComponent } from "./types.js";
import { useTheme } from "../theme/theme.js";
import { CommandBar, quitCommand } from "../components/commandBar.js";
import { DefaultLayout } from "layouts/defaultLayout.js";

const FilePickerScreen: React.FC<ScreenComponent> = ({ navigate }) => {
  const { theme } = useTheme();
  const [files, setFiles] = useState<{ label: string; value: string }[]>([]);
  const [dir, setDir] = useState(os.homedir());

  useEffect(() => {
    const entries = fs.readdirSync(dir).filter((entry) => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      return (
        (stat.isDirectory() && !entry.startsWith(".")) ||
        entry.endsWith(".blend")
      );
    });
    const formatted = entries.map((entry) => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      const isDir = stat.isDirectory();
      const label = isDir
        ? `\uf07b ${entry}` // Nerd Font folder
        : entry.endsWith(".blend")
        ? `\ue766 ${entry}` // Nerd Font 3D file glyph
        : entry;
      return {
        label,
        value: fullPath,
      };
    });
    setFiles(formatted);
  }, [dir]);

  const handleSelect = (item: { label: string; value: string }) => {
    const stat = fs.statSync(item.value);
    if (stat.isDirectory()) {
      setDir(item.value);
    } else {
      navigate("/splash");
    }
  };

  return (
    <DefaultLayout>
        <Text>Select a file or folder in: {dir}</Text>
        <Box marginTop={1}>
          <SelectInput items={files} onSelect={handleSelect} />
        </Box>
    </DefaultLayout>
  );
};

export { FilePickerScreen };
