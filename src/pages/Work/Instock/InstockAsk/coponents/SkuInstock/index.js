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
import MyCheck from '../../../../../components/MyCheck';
import { ERPEnums } from '../../../../Stock/ERPEnums';

export const SkuContent = (
  {
    data,
    addSku,
    batch,
    onCheck = () => {
    },
    checkSkus = [],
    skus = [],
    type,
  }) => {

  const skuIds = checkSkus.map(item => item.skuId);
  const shopSkuIds = skus.map(item => item.skuId);

  return <div className={style.skuList}>
    {
      data.map((item, index) => {
        const checked = skuIds.includes(item.skuId);
        const isShop = shopSkuIds.includes(item.skuId);
        let buttonHidden = false;
        switch (type) {
          case 'stocktaking':
            buttonHidden = isShop;
            break;
          default:
            break;
        }
        return <div key={index} className={style.skuItem}>
          {batch &&
          <MyCheck disabled={buttonHidden} checked={checked} fontSize={20} className={style.check} onChange={() => {
            onCheck(checked ? checkSkus.filter(sku => sku.skuId !== item.skuId) : [...checkSkus, item]);
          }} />}
          <div className={style.sku}>
            <SkuItem
              skuResult={item}
              imgSize={80}
              gap={8}
              extraWidth='60px'
              otherData={ToolUtil.isArray(item.brandResults).map(item => item.brandName).join(' / ')}
            />
          </div>
          {buttonHidden ? '已添加' : (!batch && <LinkButton onClick={() => {
            addSku.current.openSkuAdd(item);
          }}>
            <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
          </LinkButton>)}
        </div>;
      })
    }
  </div>;
};

const SkuInstock = ({ type, title, judge }) => {

  const addSku = useRef();

  const ref = useRef();

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
        searchIcon={<ScanningOutline />}
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
        openBatch={type ===  ERPEnums.stocktaking}
        noSort
        batch={batch}
        onBatch={setBatch}
        numberTitle='品类'
        skuClassName={style.skuContent}
        ref={ref}
        SkuContent={SkuContent}
        skuContentProps={{
          addSku,
          checkSkus,
          skus,
          onCheck: (skus) => {
            setCheckSkus(skus);
          },
          type,
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
