import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  // The SpeedDial stays UNCONTROLLED so its native hover-to-open behavior keeps
  // working (menu items appear on hover). We only mirror its open state to know
  // when to suppress the main "Quick actions" tooltip.
  const [dialOpen, setDialOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const actions = [
    { icon: <DashboardIcon />, name: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <GroupAddIcon />, name: 'Add Employee', onClick: () => navigate('/add-employee') },
    { icon: <ApartmentIcon />, name: 'Add Department', onClick: () => navigate('/add-department') },
  ];

  // Whenever the dial closes (click toggle, click-away, mouse leave, escape) we
  // also drop `hovered`. Otherwise the tooltip reappears the moment the menu
  // collapses, because the pointer is still sitting on the button.
  const handleDialClose = () => {
    setDialOpen(false);
    setHovered(false);
  };

  const handleAction = onClick => {
    handleDialClose();
    onClick();
  };

  return (
    <Tooltip
      title="Quick actions"
      open={hovered && !dialOpen}
      onOpen={() => setHovered(true)}
      onClose={() => setHovered(false)}
      disableFocusListener
      disableTouchListener
      disableInteractive
    >
      <SpeedDial
        ariaLabel="Quick actions"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }}
        icon={<SpeedDialIcon openIcon={<AddIcon />} />}
        onOpen={() => setDialOpen(true)}
        onClose={handleDialClose}
      >
        {actions.map(action => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => handleAction(action.onClick)} />
        ))}
      </SpeedDial>
    </Tooltip>
  );
};

export default QuickActions;
