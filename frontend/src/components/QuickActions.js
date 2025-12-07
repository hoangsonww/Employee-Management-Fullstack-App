import React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    { icon: <DashboardIcon />, name: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <GroupAddIcon />, name: 'Add Employee', onClick: () => navigate('/add-employee') },
    { icon: <ApartmentIcon />, name: 'Add Department', onClick: () => navigate('/add-department') },
  ];

  return (
    <Tooltip title="Quick actions">
      <SpeedDial ariaLabel="Quick actions" sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }} icon={<SpeedDialIcon openIcon={<AddIcon />} />}>
        {actions.map(action => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={action.onClick} />
        ))}
      </SpeedDial>
    </Tooltip>
  );
};

export default QuickActions;
