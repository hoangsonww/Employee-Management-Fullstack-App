import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const actions = [
    { icon: <DashboardIcon />, name: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <GroupAddIcon />, name: 'Add Employee', onClick: () => navigate('/add-employee') },
    { icon: <ApartmentIcon />, name: 'Add Department', onClick: () => navigate('/add-department') },
  ];

  const closeAll = () => {
    setOpen(false);
    setTooltipOpen(false);
  };

  const handleAction = onClick => {
    closeAll();
    onClick();
  };

  return (
    <Tooltip
      title="Quick actions"
      // Only show the FAB tooltip while the SpeedDial is collapsed, otherwise
      // it stays stuck on screen once the actions are opened/closed.
      open={tooltipOpen && !open}
      onOpen={() => setTooltipOpen(true)}
      onClose={() => setTooltipOpen(false)}
    >
      <SpeedDial
        ariaLabel="Quick actions"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }}
        icon={<SpeedDialIcon openIcon={<AddIcon />} />}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={closeAll}
      >
        {actions.map(action => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => handleAction(action.onClick)} />
        ))}
      </SpeedDial>
    </Tooltip>
  );
};

export default QuickActions;
