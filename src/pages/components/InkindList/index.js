import React, { useImperativeHandle, useState } from 'react';
import Actions from './components/Actions';
import SearchInkind from './components/SearchInkind';

const InkindList = (
  {
    onSuccess = () => {
    },
    addInkind = () => {
    },
    searchDisabled,
    add,
  }, ref) => {

  const [actionVisible, setActionVisible] = useState();

  const [searchVisible, setSearchVisible] = useState();

  const [skuInfo, setSkuInfo] = useState({});

  const open = (
    {
      skuId,
      brandId,
      positionId,
      skuResult,
      maintenanceId,
    }) => {
    setActionVisible(true);
    setSkuInfo({ skuId, brandId, storehousePositionsId: positionId, skuResult, maintenanceId });
  };

  const close = () => {
    setActionVisible(false);
    setSearchVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return <>
    <Actions
      searchDisabled={searchDisabled}
      skuInfo={skuInfo}
      visible={actionVisible}
      setVisible={setActionVisible}
      search={() => setSearchVisible(true)}
      onSuccess={(inkinds) => {
        setActionVisible(false);
        onSuccess(inkinds);
      }}
    />
    <SearchInkind
      skuInfo={skuInfo}
      setVisible={setSearchVisible}
      visible={searchVisible}
      onSuccess={(inkinds) => {
        setSearchVisible(false);
        onSuccess(inkinds);
      }}
      add={add}
      addInkind={addInkind}
    />
  </>;
};

export default React.forwardRef(InkindList);
