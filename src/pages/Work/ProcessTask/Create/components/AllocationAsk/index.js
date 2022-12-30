import React, { useEffect, useState } from 'react';
import MyAntPopup from '../../../../../components/MyAntPopup';
import style from '../Inventory/index.less';
import { Button, Picker } from 'antd-mobile';
import { useRequest } from '../../../../../../util/Request';
import { storeHouseSelect } from '../../../../Quality/Url';
import { MyLoading } from '../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../util/ToolUtil';
import BottomButton from '../../../../../components/BottomButton';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../../Receipts';

const AllocationAsk = (
  {
    open,
    onClose = () => {

    },
  },
) => {

  const [visible, setVisible] = useState();

  const [selectStores, setSelectStores] = useState();

  const [storeHouse, setStoreHouse] = useState({});

  const { loading, data, run } = useRequest(storeHouseSelect, {
    manual: true, onSuccess: () => {
      setSelectStores(true);
    },
  });

  useEffect(() => {
    setVisible(open);
  }, [open]);

  return <div>
    <MyAntPopup title='请选择调入仓库' onClose={() => {
      onClose();
      setVisible(false);
    }} visible={visible}>
      <div className={style.body}>
        <div className={style.item}>
          <div>调入仓库 <span>*</span>：</div>
          <Button color='primary' fill='outline' onClick={() => {
            run();
          }}>{storeHouse.value ? storeHouse.label : '请选择仓库'}</Button>
        </div>
      </div>
      <BottomButton rightDisabled={!storeHouse.value} rightOnClick={()=>{
        history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.allocation}&storehouseId=${storeHouse.value}`);
      }} />
    </MyAntPopup>

    <Picker
      destroyOnClose
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[data || []]}
      visible={selectStores}
      onClose={() => {
        setSelectStores(false);
      }}
      value={[storeHouse.value]}
      onConfirm={(value, options) => {
        const storeHouse = ToolUtil.isArray(options.items)[0] || {};
        setStoreHouse(storeHouse);
      }}
    />


    {loading && <MyLoading />}
  </div>;
};

export default AllocationAsk;
