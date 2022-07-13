import React, { useEffect, useState } from 'react';
import MaintenanceAction from './components/MaintenanceAction';

const Maintenance = (
  {
    permissions,
    receipts,
    getAction = () => {
      return {};
    },
    refresh,
  },
) => {

  const actionPermissions = getAction('maintenanceing').id && permissions;

  const [data, setData] = useState([]);

  useEffect(() => {
    const detailResultsByPositions = receipts.detailResultsByPositions || [];
    setData(detailResultsByPositions);
  }, [receipts.detailResultsByPositions]);


  return <MaintenanceAction
      data={data}
      setData={setData}
      actionPermissions={actionPermissions}
      maintenanceId={receipts.maintenanceId}
      refresh={refresh}
    />
};

export default Maintenance;
