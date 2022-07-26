import React, { useEffect, useState } from 'react';
import style from './index.less';
import Positions
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import { Button, Popup } from 'antd-mobile';
import { AddButton } from '../../../../../../../../../../../components/MyButton';
import ShopNumber from '../../../../../ShopNumber';
import MyRemoveButton from '../../../../../../../../../../../components/MyRemoveButton';
import { ToolUtil } from '../../../../../../../../../../../components/ToolUtil';

const AllBrands = (
  {
    positionsResult = [],
    out,
    skuId,
    stotrhouseId,
    onChange = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  const [positions, setPositions] = useState([]);

  const change = (newPositions) => {
    setPositions(newPositions);
    onChange(newPositions.filter(item => item.id && item.number));
  };

  const positionChange = (data = {}, currenIndex) => {
    const newPositions = positions.map((item, index) => {
      if (index === currenIndex) {
        return { ...item, number: item.number || 1, ...data };
      }
      return item;
    });
    change(newPositions);
  };

  useEffect(() => {
    if (!out) {
      const newPositions = positionsResult.map(item => ({
        id: item.storehousePositionsId,
        name: item.name,
        number: 1,
        storehouseId: item.storehouseId,
      }));
      change(newPositions);
    }
  }, []);

  return <>

    {
      positions.map((item, index) => {
        return <div key={index} className={style.positionItem}>
          <div className={style.position}>
            调{out ? '出' : '入'}库位
            <Button color='primary' fill='outline'>
              {
                item.name ? <>{item.name} <span hidden={!out}>({item.maxNumber})</span></> : '请选择库位'
              }
            </Button>
          </div>
          <div hidden={!item.id} className={style.number}>
            数量
            <ShopNumber max={out ? item.maxNumber : undefined} min={1} value={item.number || 1} onChange={(number) => {
              positionChange({ number }, index);
            }} />
          </div>
          <MyRemoveButton onRemove={() => {
            const newPositions = positions.filter((item, currenIndex) => currenIndex !== index);
            change(newPositions);
          }} />
        </div>;
      })
    }

    <div style={{ paddingTop: 24 }}>
      <AddButton width={40} height={24} onClick={() => {
        setVisible(true);
      }} />
    </div>

    <Popup
      visible={visible}
      destroyOnClose
      className={style.positionPopup}
      onMaskClick={() => setVisible(false)}
    >
      <Positions
        checkShow={(item) => {
          return (!out || item.num > 0) && ToolUtil.isArray(item.loops).length === 0;
        }}
        skuId={out ? skuId : undefined}
        storehouseId={stotrhouseId}
        ids={positions}
        onClose={() => setVisible(false)}
        onSuccess={(value = []) => {
          change(value.map(item => ({ ...item, number: item.number || 1, maxNumber: item.number || 1 })));
          setVisible(false);
        }} />
    </Popup>
  </>;
};

export default AllBrands;
