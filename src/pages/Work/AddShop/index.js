import React, { useRef, useState } from 'react';
import style from '../Instock/InstockAsk/coponents/ReceiptsInstock/index.less';
import { ToolUtil } from '../../components/ToolUtil';
import SkuItem from '../Sku/SkuItem';
import LinkButton from '../../components/LinkButton';
import AddSku from './components/AddSku';
import SkuShop from './components/SkuShop';
import Icon from '../../components/Icon';
import SkuList from '../Sku/SkuList';
import MySearch from '../../components/MySearch';
import MyNavBar from '../../components/MyNavBar';
import { ERPEnums } from '../Stock/ERPEnums';
import { useLocation } from 'react-router-dom';
import KeepAlive from '../../../components/KeepAlive';

export const SkuContent = (
  {
    query,
    data,
    addSku,
    type,
    shopSkuIds = [],
  }) => {


  return <div className={style.skuList}>
    {
      data.map((item, index) => {

        let hidden = false;

        switch (type) {
          case ERPEnums.allocation:
            hidden = shopSkuIds.includes(item.skuId);
            break;
          default:
            break;
        }

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
          <div hidden={hidden}>
            <LinkButton onClick={() => {
              addSku.current.openSkuAdd({ ...item, imgId: `stocktakingImg${index}`, storehouseId: query.storehouseId });
            }}>
              <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
            </LinkButton>
          </div>

        </div>;
      })
    }
  </div>;
};

export const AddShopContent = (
  {
    title = '入库申请',
    type = 'inStock',
    judge,
  },
) => {

  const addSku = useRef();

  const ref = useRef();

  const { query } = useLocation();

  const [skus, setSkus] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [batch, setBatch] = useState();

  const [checkSkus, setCheckSkus] = useState([]);

  const [skuData, setSkuData] = useState([]);

  const [scrollTop, setScrollTop] = useState(0);

  const shopSkuIds = skus.map(item => item.skuId);

  const newCheckSkus = skuData.filter(item => {
    return !shopSkuIds.includes(item.skuId);
  });

  const checked = checkSkus.length === newCheckSkus.length;

  const shopRef = useRef();

  return <div className={style.skuInStock} style={{
    scrollMarginTop: scrollTop,
  }}>
    <MyNavBar title={title} />
    <div
      id='content'
      className={style.content}
      onScroll={(event) => {
        setScrollTop(event.target.scrollTop);
      }}
    >
      <MySearch
        historyType={type}
        value={searchValue}
        placeholder={`请输入物料相关信息`}
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
          shopSkuIds,
          type,
        }}
        defaultParams={{ stockView: true, openPosition: true }}
        open={{ bom: true, position: true, state: true, number: true }}
        onChange={setSkuData}
      />
    </div>


    <AddSku
      shopRef={shopRef}
      judge={judge}
      skus={skus}
      ref={addSku}
      type={type}
      onChange={(sku) => {
        shopRef.current.jump(() => {
          setSkus([...skus, sku]);
        }, null);
      }}
      setSkus={setSkus}
    />

    <SkuShop
      shopRef={shopRef}
      skus={skus}
      setSkus={setSkus}
      type={type}
      onClear={() => {
        setSkus([]);
      }}
    />

  </div>;
};


const AddShop = (props) => {
  return <KeepAlive id='addShop' contentId='content'>
    <AddShopContent {...props} />
  </KeepAlive>;
};

export default AddShop;
