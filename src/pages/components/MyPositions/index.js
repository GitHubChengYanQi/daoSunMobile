import React from 'react';
import style
  from '../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/index.less';
import Positions
  from '../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import MyAntPopup from '../MyAntPopup';

const MyPositions = (
  {
    title,
    visible,
    onClose = () => {
    },
    afterClose = () => {
    },
    onSuccess = () => {
    },
    checkShow,
    skuId,
    storehouseId,
    value = [],
    verification,
    single,
    showAll,
    maxNumber,
    empty,
  },
) => {


  return <>
    <MyAntPopup
      afterClose={afterClose}
      title={title || '所有库位'}
      visible={visible}
      destroyOnClose
      className={style.positionPopup}
      onClose={onClose}
    >
      <Positions
        empty
        verification={verification}
        skuId={skuId}
        checkShow={checkShow}
        storehouseId={storehouseId}
        onClose={onClose}
        ids={value}
        onSuccess={onSuccess}
        single={single}
        showAll={showAll}
        maxNumber={maxNumber}
      />
    </MyAntPopup>
  </>;
};

export default MyPositions;
