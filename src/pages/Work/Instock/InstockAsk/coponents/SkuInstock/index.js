import React, { useRef, useState } from 'react';
import style from '../ReceiptsInstock/index.less';
import { ToolUtil } from '../../../../../components/ToolUtil';
import SkuItem from '../../../../Sku/SkuItem';
import LinkButton from '../../../../../components/LinkButton';
import AddSku from './components/AddSku';
import SkuShop from './components/SkuShop';
import Icon from '../../../../../components/Icon';
import SkuList from '../../../../Sku/SkuList';

export const SkuContent = ({ data, checkSkuIds, addSku }) => {

  return <div className={style.skuList}>
    {
      data.map((item, index) => {
        return <div key={index} className={style.skuItem}>
          <div className={style.sku}>
            <SkuItem
              skuResult={item}
              imgSize={80}
              gap={10}
              extraWidth='60px'
              otherData={ToolUtil.isArray(item.brandResults).map(item => item.brandName).join(' / ')}
            />
          </div>
          {!checkSkuIds.includes(item.skuId) && <LinkButton onClick={() => {
            addSku.current.openSkuAdd(item);
          }}>
            <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
          </LinkButton>}
        </div>;
      })
    }
  </div>;
};

const SkuInstock = ({ searchValue }, ref) => {

  const addSku = useRef();

  const [skus, setSkus] = useState([]);

  const checkSkuIds = skus.map(item => item.skuId);


  return <>
    <SkuList
      skuClassName={style.skuContent}
      ref={ref}
      SkuContent={SkuContent}
      skuContentProps={{ checkSkuIds, addSku }}
      defaultParams={{ stockView: true }}
      open={{ time: true, user: true }}
    />
    <AddSku
      ref={addSku}
      onChange={(sku) => {
        setSkus([...skus, sku]);
      }}
    />

    <SkuShop skus={skus} setSkus={setSkus} />


  </>;
};

export default React.forwardRef(SkuInstock);
