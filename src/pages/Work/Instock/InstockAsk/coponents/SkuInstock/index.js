import React, { useEffect, useRef, useState } from 'react';
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
import { useRequest } from '../../../../../../util/Request';
import { judgeLoginUser } from '../../Submit/components/InstockSkus';

export const SkuContent = ({ data, addSku }) => {

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
          <LinkButton onClick={() => {
            addSku.current.openSkuAdd(item);
          }}>
            <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
          </LinkButton>
        </div>;
      })
    }
  </div>;
};

const SkuInstock = ({ numberTitle, type, title }) => {

  const addSku = useRef();

  const ref = useRef();

  const [skus, setSkus] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [judge, setJudge] = useState();

  const { run: judgeStock } = useRequest(judgeLoginUser, {
    manual: true,
    onSuccess: (res) => {
      setJudge(false);
    },
  });

  useEffect(() => {
    switch (type) {
      case 'inStock':
        judgeStock();
        break;
      default:
        break;
    }
  }, []);

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
        numberTitle='品类'
        skuClassName={style.skuContent}
        ref={ref}
        SkuContent={SkuContent}
        skuContentProps={{ addSku }}
        defaultParams={{ stockView: true }}
        open={{ time: true, user: true }}
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
      judge={judge}
      skus={skus}
      setSkus={setSkus}
      numberTitle={numberTitle}
      type={type}
      onClear={() => {
        setSkus([]);
      }} />

  </div>;
};

export default SkuInstock;
