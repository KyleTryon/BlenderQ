import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import fs from "fs";
import path from "path";
import os from "os";
import { ScreenComponent } from "./types.js";
import { useTheme } from "../theme/theme.js";

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
    const formatted = entries.map((entry) => ({
      label: entry,
      value: path.join(dir, entry),
    }));
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
    <Box
      {...theme.styles.frame()}
      flexDirection="column"
      width="100%"
      paddingX={1}
    >
      <Text>Select a file or folder in: {dir}</Text>
      <Box marginTop={1}>
        <SelectInput items={files} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};

export { FilePickerScreen };
