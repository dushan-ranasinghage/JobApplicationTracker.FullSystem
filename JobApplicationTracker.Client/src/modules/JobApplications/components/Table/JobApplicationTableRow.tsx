/**
 * @file JobApplicationTableRow.tsx
 * @description Table row component for a single job application
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import {
  TableRow,
  TableCell,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment-timezone';

import type {
  JobApplication,
  JobApplicationStatus,
} from '../../../../redux/types/jobApplications';
import { JobApplicationStatusValues } from '../../../../redux/types/jobApplications';
import { getStatusColor, getStatusDisplayName } from '../../utils/statusUtils';
import EllipsisTooltipText from '../../../../components/EllipsisTooltipText';

interface JobApplicationTableRowProps {
  application: JobApplication;
  onStatusChange: (id: number, newStatus: JobApplicationStatus) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const JobApplicationTableRow = ({
  application,
  onStatusChange,
  onEdit,
  onDelete,
}: JobApplicationTableRowProps) => {
  return (
    <TableRow key={application.id} hover>
      <TableCell>
        <EllipsisTooltipText text={application.companyName} maxLength={35} />
      </TableCell>
      <TableCell>
        <EllipsisTooltipText text={application.position} maxLength={35} />
      </TableCell>
      <TableCell>
        <Select
          value={application.status}
          onChange={(e) =>
            onStatusChange(
              application.id,
              e.target.value as JobApplicationStatus
            )
          }
          size="small"
          sx={{
            minWidth: 160,
            height: 28,
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiSelect-select': {
              py: 0.5,
              px: 1.5,
              backgroundColor: (theme) => {
                const color = getStatusColor(application.status);
                if (color === 'success') return theme.palette.success.main;
                if (color === 'info') return theme.palette.info.main;
                if (color === 'error') return theme.palette.error.main;
                return theme.palette.grey[300];
              },
              color: (theme) => {
                const color = getStatusColor(application.status);
                if (
                  color === 'success' ||
                  color === 'info' ||
                  color === 'error'
                ) {
                  return theme.palette.common.white;
                }
                return theme.palette.text.primary;
              },
              borderRadius: 1.5,
              fontWeight: 500,
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              '&:focus': {
                backgroundColor: (theme) => {
                  const color = getStatusColor(application.status);
                  if (color === 'success') return theme.palette.success.main;
                  if (color === 'info') return theme.palette.info.main;
                  if (color === 'error') return theme.palette.error.main;
                  return theme.palette.grey[300];
                },
              },
            },
            '& .MuiSelect-icon': {
              color: (theme) => {
                const color = getStatusColor(application.status);
                if (
                  color === 'success' ||
                  color === 'info' ||
                  color === 'error'
                ) {
                  return theme.palette.common.white;
                }
                return theme.palette.text.primary;
              },
              fontSize: '1.2rem',
            },
          }}
        >
          <MenuItem value={JobApplicationStatusValues.APPLIED}>
            {getStatusDisplayName(JobApplicationStatusValues.APPLIED)}
          </MenuItem>
          <MenuItem value={JobApplicationStatusValues.INTERVIEW}>
            {getStatusDisplayName(JobApplicationStatusValues.INTERVIEW)}
          </MenuItem>
          <MenuItem value={JobApplicationStatusValues.OFFER}>
            {getStatusDisplayName(JobApplicationStatusValues.OFFER)}
          </MenuItem>
          <MenuItem value={JobApplicationStatusValues.ACCEPTED}>
            {getStatusDisplayName(JobApplicationStatusValues.ACCEPTED)}
          </MenuItem>
          <MenuItem value={JobApplicationStatusValues.REJECTED}>
            {getStatusDisplayName(JobApplicationStatusValues.REJECTED)}
          </MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        {moment
          .utc(application.dateApplied)
          .tz('Pacific/Auckland')
          .format('DD MMM YYYY - hh:mm A')}
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => onEdit(application.id)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => onDelete(application.id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationTableRow;
