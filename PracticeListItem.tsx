import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

import { locationProps } from './MapPage';

interface PracticeListItemProps {
  isSelected: boolean;
  location: locationProps;
  onClick: () => void;
}

export const PracticeListItem = ({ isSelected, location, onClick }: PracticeListItemProps) => {
  return (
    <>
      <ListItem sx={{ px: 0 }} divider>
        <ListItemButton onClick={onClick} selected={isSelected}>
          <ListItemText
            primary={location.displayName}
            primaryTypographyProps={{ fontSize: 16, fontWeight: 800 }}
            secondary={
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                  {location.street + location.streetNumber}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                  {location.postalCode} {location.city}
                </Typography>
              </>
            }
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};
