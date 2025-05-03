import React from "react";
import { Box, Text, useInput } from "ink";
import { useTheme } from "../theme/theme.js";

type Command = {
  key: string;
  label: string;
  action: () => void;
};

type Props = {
  commands: Command[];
};

const CommandBar: React.FC<Props> = ({ commands }) => {
  const { theme } = useTheme();

  useInput((input) => {
    const matched = commands.find(cmd => cmd.key.toLowerCase() === input.toLowerCase());
    if (matched) {
      matched.action();
    }
  });

  return (
    <Box
      {...theme.styles.footer()}
    >
      {commands.map(({ key, label }, idx) => (
        <Text key={idx}>
          {key} {label}
        </Text>
      ))}
    </Box>
  );
};

const quitCommand: Command = {
  key: "q",
  label: "Quit",
  action: () => process.exit(),
};

export { CommandBar, quitCommand };
export type { Command };