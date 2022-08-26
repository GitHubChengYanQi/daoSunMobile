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

  const open = (skuInfo = {}) => {
    setActionVisible(true);
    setSkuInfo({ ...skuInfo, storehousePositionsId: skuInfo.positionId });
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
      addInkind={addInkind}
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
      onClose={() => setSearchVisible(false)}
      skuInfo={skuInfo}
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
