import React, { useRef, useState } from 'react';
import style from './index.less';
import MySearch from '../../../../components/MySearch';
import Icon from '../../../../components/Icon';
import SkuList from '../../../Sku/SkuList';
import MyAntList from '../../../../components/MyAntList';
import { List } from 'antd-mobile';
import SkuItem from '../../../Sku/SkuItem';
import MyEllipsis from '../../../../components/MyEllipsis';

export const SkuContent = ({ data }) => {

  const positionResult = (data) => {

    if (!data) {
      return '';
    }

    if (!data.supper) {
      return data.name;
    }

    return `${positionResult(data.supper)}-${data.name}`;
  };

  return <MyAntList>
    {
      data.map((item, index) => {

        const positions = item.positionsResult || [];

        const spuResult = item.spuResult || {};
        const unit = spuResult.unitResult || {};

        return <List.Item key={index} className={style.listItem}>
          <SkuItem
            extraWidth='24px'
            number={item.stockNumber}
            unitName={unit.unitName}
            skuResult={item}
            otherData={positions.length > 0 && <MyEllipsis width='100%'>
              {
                positions.map((item) => {
                  return positionResult(item);
                }).join(' / ')
              }
            </MyEllipsis>}
          />
        </List.Item>;
      })
    }
  </MyAntList>;
};

const StockDetail = () => {

  const ref = useRef();

  const [skuName, setSkuName] = useState('');


  return <>
    <div className={style.search}>
      <MySearch
        historyType='stock'
        extraIcon={<Icon type='icon-lingdang' style={{ fontSize: 20 }} />}
        placeholder='请输入关键词搜索'
        onSearch={(value) => {
          ref.current.submit({ skuName: value });
        }}
        onChange={setSkuName}
        value={skuName}
        onClear={() => {
          ref.current.submit({ skuName: null });
        }}
      />
    </div>

    <SkuList
      ref={ref}
      defaultParams={{ stockView: true, openBom: true, openPosition: true }}
      SkuContent={SkuContent}
      open={{ bom: true, position: true, state: true }}
    />

  </>;
};

export default StockDetail;
