import React, { useRef, useState } from 'react';
import style from '../ReceiptsInstock/index.less';
import { ToolUtil } from '../../../../../components/ToolUtil';
import SkuItem from '../../../../Sku/SkuItem';
import LinkButton from '../../../../../components/LinkButton';
import AddSku from './components/AddSku';
import SkuShop from './components/SkuShop';
import Icon from '../../../../../components/Icon';
import SkuList from '../../../../Sku/SkuList';
import { ScanningOutline } from 'antd-mobile-icons';
import MySearch from '../../../../../components/MySearch';
import MyNavBar from '../../../../../components/MyNavBar';
import { ERPEnums } from '../../../../Stock/ERPEnums';
import { useLocation } from 'react-router-dom';

export const SkuContent = (
  {
    query,
    data,
    addSku,
  }) => {

  return <div className={style.skuList}>
    {
      data.map((item, index) => {
        return <div key={index} className={style.skuItem}>
          <div className={style.sku}>
            <SkuItem
              skuResult={item}
              imgId={`stocktakingImg${index}`}
              imgSize={80}
              gap={8}
              extraWidth='60px'
              otherData={[ToolUtil.isArray(item.brandResults).map(item => item.brandName).join(' / ')]}
            />
          </div>
          <LinkButton onClick={() => {
            addSku.current.openSkuAdd({ ...item, imgId: `stocktakingImg${index}`, storehouseId: query.storehouseId });
          }}>
            <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
          </LinkButton>
        </div>;
      })
    }
  </div>;
};

const SkuInstock = ({ type, title, judge }) => {

  const addSku = useRef();

  const ref = useRef();

  const { query } = useLocation();

  const [skus, setSkus] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [batch, setBatch] = useState();

  const [checkSkus, setCheckSkus] = useState([]);

  const [skuData, setSkuData] = useState([]);

  const shopSkuIds = skus.map(item => item.skuId);

  const newCheckSkus = skuData.filter(item => {
    return !shopSkuIds.includes(item.skuId);
  });

  const checked = checkSkus.length === newCheckSkus.length;

  return <div className={style.skuInStock}>
    <MyNavBar title={title} />
    <div className={style.content}>
      <MySearch
        historyType={type}
        value={searchValue}
        placeholder={`请输入相关物料信息`}
        onChange={setSearchValue}
        onSearch={(value) => {
          ref.current.submit({ skuName: value });
        }}
        onClear={() => {
          ref.current.submit({ skuName: '' });
        }}
      />
      <SkuList
        openBatch={type === ERPEnums.stocktaking}
        noSort
        batch={batch}
        onBatch={setBatch}
        numberTitle='品类'
        skuClassName={style.skuContent}
        ref={ref}
        SkuContent={SkuContent}
        skuContentProps={{
          query,
          addSku,
        }}
        defaultParams={{ stockView: true }}
        open={{ time: true, user: true }}
        onChange={setSkuData}
      />
    </div>


    <AddSku
      judge={judge}
      skus={skus}
      ref={addSku}
      type={type}
      onChange={(sku) => {
        setSkus([...skus, sku]);
      }}
      setSkus={setSkus}
    />

    <SkuShop
      checked={checked}
      checkSkus={checkSkus}
      batch={batch}
      judge={judge}
      skus={skus}
      setSkus={setSkus}
      type={type}
      onClear={() => {
        setSkus([]);
      }}
      selectAll={() => {
        if (checked) {
          return setCheckSkus([]);
        }
        setCheckSkus(newCheckSkus);
      }}
      onCancel={() => {
        setCheckSkus([]);
      }}
    />

  </div>;
};

export default SkuInstock;
