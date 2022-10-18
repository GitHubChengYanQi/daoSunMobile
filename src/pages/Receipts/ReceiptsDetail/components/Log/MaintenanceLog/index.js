import React, { useRef, useState } from 'react';
import { isObject, ToolUtil } from '../../../../../components/ToolUtil';
import MyList from '../../../../../components/MyList';
import style from '../../ReceiptData/components/Stocktaking/index.less';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import { UserName } from '../../../../../components/User';
import { MyDate } from '../../../../../components/MyDate';
import ShopNumber from '../../../../../Work/AddShop/components/ShopNumber';
import LinkButton from '../../../../../components/LinkButton';
import SearchInkind from '../../../../../components/InkindList/components/SearchInkind';
import MySearch from '../../../../../components/MySearch';

export const maintenanceLogList = { url: '/maintenanceLog/list', method: 'POST' };

const MaintenanceLog = ({ detail = {} }) => {

  const ref = useRef();

  const [data, setData] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const submit = (skuName) => {
    ref.current.submit({ maintenanceId: detail.inventoryTaskId, skuName });
  };

  const [visible, setVisible] = useState();

  const dataList = () => {
    return data.map((skuItem, skuIndex) => {
      const inkindResult = skuItem.inkindResult || {};
      const detailResults = skuItem.detailResults || [];
      const brandNames = [];
      let number = 0;
      detailResults.map(item => {
        number += item.number;
        const brandName = isObject(item.brandResult).brandName;
        if (!brandNames.includes(brandName || '无品牌')) {
          brandNames.push(brandName || '无品牌');
        }
      });
      return <div key={skuIndex} className={style.positionItem}>
        <div className={style.skus}>
          <div
            className={style.sku}
            key={skuIndex}
            style={{ border: 'none' }}>
            <div className={style.skuItem} onClick={() => {

            }}>
              <SkuItem
                skuResult={inkindResult.skuResult}
                extraWidth='100px'
                otherData={[
                  brandNames.join('、'),
                  ToolUtil.isObject(inkindResult.storehousePositionsResult).name,
                ]}
              />
            </div>
            <div className={style.info} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ShopNumber show value={number || 0} />
              <LinkButton onClick={() => {
                setVisible({
                  skuId: inkindResult.skuId,
                  skuResult: inkindResult.skuResult,
                  brandId: 0,
                  positionId: 0,
                });
              }}>查看实物</LinkButton>
            </div>
          </div>
          <div className={style.update}>
            <div className={style.time}>{MyDate.Show(skuItem.createTime)}</div>
            <div><UserName user={skuItem.createUserResult} /></div>
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
      params={{ maintenanceId: detail.maintenanceId }}
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
