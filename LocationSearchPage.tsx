import { useState } from 'react';

import { useQuery } from '@connectrpc/connect-query';
import { List, Pagination, styled } from '@mui/material';

// Note: LoadingSpinner and SearchInput are internal components from the host application.
// In this excerpt they are used as drop-in replacements for any spinner/search input component.
// import { LoadingSpinner, SearchInput } from '@cubular/core';

import { PracticeListItem } from './PracticeListItem';
import { MapPage } from './MapPage';
import { locationProps } from './MapPage';

import { PublicService } from '@/api/gatewaypb/gateway_public_connect';

const SEARCH_BAR_WIDTH = '100%';
const Container = styled('div')({});

export const LocationSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<locationProps>();
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    ...PublicService.methods.getBluedentaMapLocations,
    service: { typeName: PublicService.typeName },
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData =
    data?.locations?.filter(
      (item) =>
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.streetNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.postalCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const paginationSettings = {
    itemsCount: filteredData.length,
    itemsPerPage: 5,
  };

  const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  };

  const pageCount = Math.ceil(paginationSettings.itemsCount / paginationSettings.itemsPerPage);
  const paginatedData = paginate(filteredData, paginationSettings.itemsPerPage, page);

  const handleLocationClick = (location) => {
    if (selectedLocation?.displayName === location.displayName) {
      setSelectedLocation(undefined);
    } else {
      setSelectedLocation({ ...location });
    }
  };

  if (isPending) {
    return <div>Loading...</div>; // Replace with your own loading component
  }

  return (
    <Container sx={{ p: 1, display: 'flex', maxHeight: 'calc(100vh - 92px)' }}>
      <Container
        sx={{
          overflow: 'scroll',
          mr: 2,
          height: 'calc(100vh - 108px)',
          width: 370,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Replace with your own search input component */}
        <input
          style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}
          onChange={(e) => handleSearch(e)}
          placeholder="Search"
          value={searchQuery}
        />
        <List sx={{ flexGrow: '1' }}>
          {paginatedData.map((location) => (
            <PracticeListItem
              key={location.displayName}
              location={location}
              onClick={() => handleLocationClick(location)}
              isSelected={selectedLocation?.displayName === location.displayName}
            />
          ))}
        </List>
        <Container
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'sticky',
            bottom: '0px',
          }}
        >
          <Pagination
            sx={{ mt: 1, zIndex: 1 }}
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Container>
      </Container>
      <Container sx={{ width: '100%' }}>
        <MapPage selectedLocation={selectedLocation} locations={filteredData} />
      </Container>
    </Container>
  );
};
