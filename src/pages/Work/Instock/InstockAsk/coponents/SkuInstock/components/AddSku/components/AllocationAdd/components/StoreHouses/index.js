import React, { useState } from 'react';
import { useRequest } from '../../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../../components/MyLoading';
import { Button, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../../../components/ToolUtil';
import { LinkOutline } from 'antd-mobile-icons';
import ShopNumber from '../../../../../ShopNumber';
import style
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/index.less';
import { AddButton } from '../../../../../../../../../../../components/MyButton';
import Positions
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import MyRemoveButton from '../../../../../../../../../../../components/MyRemoveButton';

export const storehouse = { url: '/stockDetails/getStockNumberBySkuId', method: 'GET' };

const StoreHouses = (
  {
    skuId,
    value = [],
    onChange = () => {
    },
    out,
    stotrhouseId,
  },
) => {

  const [data, setData] = useState([]);

  const [visible, setVisible] = useState({});

  const change = (newData = []) => {
    setData(newData);
    onChange(newData.filter(item => item.show));
  };

  const { loading } = useRequest({ ...storehouse, params: { skuId } }, {
    onSuccess: (res) => {
      const stores = res || [];
      change(stores.map(item => {
        const storehouse = item.storehouseResult || {};
        return {
          number: out ? 1 : item.number,
          maxNumber: item.number,
          id: storehouse.storehouseId,
          name: storehouse.name,
        };
      }));
    },
  });

  const dataChange = (params = {}, id) => {
    const newData = data.map(item => {
      if (item.id === id) {
        return { ...item, ...params };
      }
      return item;
    });
    change(newData);
  };


  const positionChange = (params = {}, id, positionIndex) => {
    const newData = data.map(item => {
      if (item.id === id) {
        const newPositions = item.positions.map((item, index) => {
          if (index === positionIndex) {
            return { ...item, ...params };
          }
          return item;
        });
        return { ...item, positions: newPositions };
      }
      return item;
    });
    change(newData);
  };

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <div className={style.action} style={{ padding: 0 }}>
    {data.map((item, index) => {

      const positions = item.positions || [];

      return <div key={index}>
        <div className={style.storeItem}>
          <Button
            disabled={out ? false : item.maxNumber === 0}
            className={ToolUtil.classNames(style.position, !item.show ? style.defaultPosition : '')}
            color={item.show ? 'primary' : 'default'}
            fill='outline'
            onClick={() => {
              dataChange({ show: !item.show }, item.id);
            }}
          >
            <LinkOutline /> {item.name} <span hidden={out}>({item.number})</span>
          </Button>
          <div hidden={!item.show}>
            {stotrhouseId === item.id ?
              <AddButton width={40} height={24} onClick={() => setVisible(item)} /> :
              <ShopNumber min={1} max={out ? undefined : item.maxNumber} value={item.number} />}
          </div>
        </div>

        <div hidden={!(item.show && stotrhouseId === item.id)} className={style.allBrands}>
          {
            positions.map((positionItem, positionIndex) => {

              return <div
                className={ToolUtil.classNames(style.brands, positionItem.checked && style.checked)}
                key={positionIndex}>
                <span onClick={() => {

                }}>{positionItem.name} {!out && `(${positionItem.maxNumber || 0})`}</span>
                <div>
                  <ShopNumber
                    max={!out ? positionItem.maxNumber : undefined}
                    min={1}
                    value={positionItem.number || 0}
                    onChange={(number) => {
                      positionChange({ number }, item.id, positionIndex);
                    }} />
                </div>
                <MyRemoveButton onRemove={() => {
                  dataChange({ positions: positions.filter((item, posiIndex) => posiIndex !== positionIndex) }, item.id);
                }} />

              </div>;
            })
          }
        </div>
      </div>;
    })}

    <Popup
      visible={visible.id}
      destroyOnClose
      className={style.positionPopup}
      onMaskClick={() => setVisible({})}
    >
      <Positions
        skuId={out ? undefined : skuId}
        checkShow={(item) => {
          return (out || item.num > 0) && ToolUtil.isArray(item.loops).length === 0;
        }}
        storehouseId={visible.id}
        onClose={() => setVisible({})}
        ids={visible.positions || []}
        onSuccess={(value = []) => {
          const newData = data.map(item => {
            if (item.id === visible.id) {
              return {
                ...item,
                positions: value.map(item => ({ ...item, number: item.number || 1, maxNumber: item.number })),
              };
            }
            return item;
          });
          change(newData);
          setVisible({});
        }} />
    </Popup>
  </div>;
};

export default StoreHouses;
