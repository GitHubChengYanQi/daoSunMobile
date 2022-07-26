import React, { useState } from 'react';
import style
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/index.less';
import { Button, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../../../components/ToolUtil';
import { LinkOutline } from 'antd-mobile-icons';
import { AddButton } from '../../../../../../../../../../../components/MyButton';
import ShopNumber from '../../../../../ShopNumber';
import MyRemoveButton from '../../../../../../../../../../../components/MyRemoveButton';
import Positions
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';

const FixedBrand = (
  {
    sku = {},
    storehouseId,
    value,
    onChange = () => {
    },
  },
) => {

  const brands = sku.brandResults || [];

  const [data, setData] = useState(brands);

  const [visible, setVisible] = useState({});

  const change = (newData) => {
    setData(newData);
    onChange(newData);
  };

  const dataChange = (params = {}, brandId) => {
    const newData = data.map(item => {
      if (item.brandId === brandId) {
        return { ...item, ...params };
      }
      return item;
    });
    change(newData);
  };


  const positionChange = (params = {}, brandId, positionIndex) => {
    const newData = data.map(item => {
      if (item.brandId === brandId) {
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

  return <div className={style.action} style={{ padding: 0 }}>
    {data.map((item, index) => {

      const positions = item.positions || [];

      return <div key={index}>
        <div>
          <Button
            className={ToolUtil.classNames(style.position, !item.show ? style.defaultPosition : '')}
            color={item.show ? 'primary' : 'default'}
            fill='outline'
            onClick={() => {
              dataChange({ show: !item.show }, item.brandId);
            }}
          >
            <LinkOutline /> {item.brandName}
          </Button>

        </div>

        <div hidden={!item.show} className={style.allBrands}>
          {
            positions.map((positionItem, positionIndex) => {

              return <div
                className={ToolUtil.classNames(style.brands, positionItem.checked && style.checked)}
                key={positionIndex}>
                <span onClick={() => {

                }}>{positionItem.name}</span>
                <div>
                  <ShopNumber
                    min={1}
                    value={positionItem.number || 0}
                    onChange={(number) => {
                      positionChange({ number }, item.brandId, positionIndex);
                    }} />
                </div>
                <MyRemoveButton onRemove={() => {
                  dataChange({ positions: positions.filter((item, posiIndex) => posiIndex !== positionIndex) }, item.brandId);
                }} />

              </div>;
            })
          }
          <AddButton width={40} height={24} onClick={() => setVisible(item)} />
        </div>
      </div>;
    })}

    <Popup
      visible={visible.brandId}
      destroyOnClose
      className={style.positionPopup}
      onMaskClick={() => setVisible({})}
    >
      <Positions
        storehouseId={storehouseId}
        onClose={() => setVisible({})}
        ids={visible.positions || []}
        onSuccess={(value = []) => {
          const newData = data.map(item => {
            if (item.brandId === visible.brandId) {
              return {
                ...item,
                positions: value.map(item => ({ ...item, number: item.number || 1 })),
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

export default FixedBrand;
