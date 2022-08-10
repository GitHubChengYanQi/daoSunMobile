import React, { useEffect, useState } from 'react';
import { AddButton } from '../../../../../../../../../../../components/MyButton';
import ShopNumber from '../../../../../ShopNumber';
import { ToolUtil } from '../../../../../../../../../../../components/ToolUtil';
import MyCheck from '../../../../../../../../../../../components/MyCheck';
import style
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/index.less';
import MyPositions from '../../../../../../../../../../../components/MyPositions';

const AllBrands = (
  {
    storehouseName,
    outPositionData = [],
    positionsResult = [],
    out,
    skuId,
    stotrhouseId,
    onChange = () => {
    },
    value = [],
  },
) => {

  const [visible, setVisible] = useState();

  const [positions, setPositions] = useState([]);

  const change = (newPositions) => {
    setPositions(newPositions);
    onChange(newPositions);
  };

  const positionChange = (data = {}, currenIndex) => {
    const newPositions = positions.map((item, index) => {
      if (index === currenIndex) {
        return { ...item, ...data };
      }
      return item;
    });
    change(newPositions);
  };

  useEffect(() => {
    if (value.length > 0){
      setPositions(value[0].positions);
      return;
    }
    if (out) {
      const newPositions = [];
      outPositionData.forEach(item => {
        const positions = item.positionsResults || [];
        positions.forEach(item => {
          newPositions.push({
            id: item.storehousePositionsId,
            name: item.name,
            number: item.number,
            outStockNumber: item.number,
            storehouseId: item.storehouseId,
          });
        });
      });
      setPositions(newPositions);
    } else {
      const newPositions = positionsResult.map(item => ({
        id: item.storehousePositionsId,
        name: item.name,
        number: 1,
        outStockNumber: 1,
        storehouseId: item.storehouseId,
      }));
      setPositions(newPositions);
    }
  }, []);

  return <>

    <div className={style.allBrands} style={{padding:0}}>
      {
        positions.map((positionItem, positionIndex) => {

          return <div
            className={ToolUtil.classNames(style.brands, positionItem.checked && style.checked)}
            key={positionIndex}>
            <div className={style.positionName} onClick={() => {
              if (!positionItem.checked) {
                const num = positionItem.number;
                positionChange({ checked: true, outStockNumber: out ? num : 1 }, positionIndex);
              } else {
                positionChange({ checked: false, outStockNumber: 0 }, positionIndex);
              }
            }}>
              <MyCheck checked={positionItem.checked} />
              <span>{positionItem.name} ({positionItem.number})</span>
            </div>

            <div hidden={!positionItem.checked}>
              <ShopNumber
                max={out ? positionItem.number : undefined}
                value={positionItem.outStockNumber || 0}
                onChange={(num) => {
                  positionChange({ outStockNumber: num }, positionIndex);
                }} />
            </div>

          </div>;
        })
      }
    </div>

    {!out && <AddButton className={style.addButton} width={40} height={24} onClick={() => setVisible(true)} />}

    <MyPositions
      title={storehouseName}
      visible={visible}
      checkShow={(item) => {
        return (!out || item.num > 0) && ToolUtil.isArray(item.loops).length === 0;
      }}
      skuId={out ? skuId : undefined}
      storehouseId={stotrhouseId}
      value={positions}
      onClose={() => setVisible(false)}
      onSuccess={(value = []) => {
        change(value.map(item => ({ ...item, number: 1, outStockNumber: 1, checked: true })));
        setVisible(false);
      }} />
  </>;
};

export default AllBrands;
