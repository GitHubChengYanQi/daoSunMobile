import React, { useRef, useState } from 'react';
import { ToolUtil } from '../../../../../components/ToolUtil';
import MyList from '../../../../../components/MyList';
import style from '../../ReceiptData/components/Stocktaking/index.less';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import { UserName } from '../../../../../components/User';
import { MyDate } from '../../../../../components/MyDate';
import ShopNumber from '../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import LinkButton from '../../../../../components/LinkButton';
import SearchInkind from '../../../../../components/InkindList/components/SearchInkind';
import MySearch from '../../../../../components/MySearch';

export const maintenanceLogList = { url: '/maintenanceLog/list', method: 'POST' };

const MaintenanceLog = ({ detail = {} }) => {

  const ref = useRef();

  const [data, setData] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const submit = (skuName) => {
    ref.current.submit({ sourceId: detail.inventoryTaskId, skuName });
  };

  const [visible, setVisible] = useState();

  const dataList = () => {
    return data.map((skuItem, skuIndex) => {
      return <div key={skuIndex} className={style.positionItem}>
        <div className={style.skus}>
          <div
            className={style.sku}
            key={skuIndex}
            style={{ border: 'none' }}>
            <div className={style.skuItem} onClick={() => {

            }}>
              <SkuItem
                skuResult={skuItem.skuResult}
                extraWidth='100px'
                number={skuItem.number}
                otherData={[
                  ToolUtil.isObject(skuItem.brandResult).brandName || '无品牌',
                  ToolUtil.isObject(skuItem.storehousePositionsResult).name,
                ]}
              />
            </div>
            <div className={style.info} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ShopNumber show value={skuItem.number || 0} />
              <LinkButton onClick={() => {
                setVisible({
                  skuId: item.skuId,
                  skuResult: item,
                  brandId: 0,
                  positionId: 0,
                });
              }}>查看实物</LinkButton>
            </div>
          </div>
          <div className={style.update}>
            <div className={style.time}>{MyDate.Show(skuItem.createTime)}</div>
            <div><UserName user={skuItem.user} /></div>
          </div>
        </div>

        <div className={style.space} />
      </div>;
    });
  };

  return <div className={style.stocktaking}>
    <MySearch
      onChange={setSearchValue}
      value={searchValue}
      onClear={() => submit()}
      onSearch={(value) => {
        submit(value);
      }}
    />
    <MyList
      ref={ref}
      api={maintenanceLogList}
      params={{ sourceId: detail.inventoryTaskId }}
      data={data}
      getData={setData}>
      {dataList()}
    </MyList>

    <SearchInkind
      noActions
      skuInfo={visible}
      onClose={() => setVisible()}
      visible={visible}
    />
  </div>;
};

export default MaintenanceLog;
