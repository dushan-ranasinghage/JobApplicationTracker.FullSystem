/**
 * @file EllipsisTooltipText.tsx
 * @description 
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Tooltip, Typography } from '@mui/material';

interface EllipsisTooltipTextProps {
  text: string;
  maxLength: number;
}

const EllipsisTooltipText = ({
  text,
  maxLength,
}: EllipsisTooltipTextProps) => {
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated
    ? `${text.slice(0, maxLength)}...`
    : text;

  return isTruncated ? (
    <Tooltip title={text} placement="top">
      <Typography
        variant="body2"
        sx={{
          cursor: 'help',
          whiteSpace: 'nowrap',
        }}
      >
        {displayText}
      </Typography>
    </Tooltip>
  ) : (
    <Typography variant="body2">{displayText}</Typography>
  );
};

export default EllipsisTooltipText;