import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  // Track the SpeedDial open state only so we can hide the main tooltip while
  // the actions are showing. The SpeedDial itself stays uncontrolled so its
  // native hover/focus behavior (menu items appear on hover) keeps working.
  const [dialOpen, setDialOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const actions = [
    { icon: <DashboardIcon />, name: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <GroupAddIcon />, name: 'Add Employee', onClick: () => navigate('/add-employee') },
    { icon: <ApartmentIcon />, name: 'Add Department', onClick: () => navigate('/add-department') },
  ];

  const handleAction = onClick => {
    setHovered(false);
    onClick();
  };

  return (
    <Tooltip
      title="Quick actions"
      // Show the label only when the menu is closed, and never on focus —
      // otherwise it stays stuck on the FAB after opening/closing the items.
      open={hovered && !dialOpen}
      onOpen={() => setHovered(true)}
      onClose={() => setHovered(false)}
      disableFocusListener
    >
      <SpeedDial
        ariaLabel="Quick actions"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }}
        icon={<SpeedDialIcon openIcon={<AddIcon />} />}
        onOpen={() => setDialOpen(true)}
        onClose={() => setDialOpen(false)}
      >
        {actions.map(action => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => handleAction(action.onClick)} />
        ))}
      </SpeedDial>
    </Tooltip>
  );
};

export default QuickActions;
