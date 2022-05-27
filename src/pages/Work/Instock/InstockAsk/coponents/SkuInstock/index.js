import React, { useImperativeHandle, useRef, useState } from 'react';
import style from '../ReceiptsInstock/index.less';
import { ToolUtil } from '../../../../../components/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { Tabs } from 'antd-mobile';
import { useBoolean } from 'ahooks';
import { useRequest } from '../../../../../../util/Request';
import { spuClassList } from '../../../Url';
import MyList from '../../../../../components/MyList';
import SkuItem from '../../../../Sku/SkuItem';
import { skuList } from '../../../../../Scan/Url';
import { AddSquareOutline } from 'antd-mobile-icons';
import LinkButton from '../../../../../components/LinkButton';
import AddSku from './components/AddSku';
import SkuShop from './components/SkuShop';
import { MyLoading } from '../../../../../components/MyLoading';
import Icon from '../../../../../components/Icon';

const SkuInstock = ({ searchValue }, ref) => {

  const [screen, { setTrue, setFalse }] = useBoolean();

  const [skuClass, setSkuClass] = useState('all');

  const { loading, data: skuClassData } = useRequest(spuClassList);

  const [number, setNumber] = useState(0);

  const [data, setData] = useState([]);

  const [skus, setSkus] = useState([]);

  const checkSkuIds = skus.map(item => item.skuId);

  const skuRef = useRef();

  const addSku = useRef();

  const submit = (data) => {
    skuRef.current.submit({ skuName: searchValue, spuClass: skuClass === 'all' ? null : skuClass, ...data });
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  if (loading) {
    return <MyLoading />;
  }

  return <div>
    <div className={style.top}>
      <div className={style.screen}>
        <div className={style.stockNumber}>品类：<span>{number}</span></div>
        <div
          className={ToolUtil.classNames(style.screenButton, screen ? style.checked : '')}
          onClick={() => {
            if (screen) {
              setFalse();
            } else {
              setTrue();
            }
          }}>
          筛选 {screen ? <CaretUpFilled /> : <CaretDownFilled />}
        </div>
      </div>
      <Tabs activeKey={skuClass} onChange={(key) => {
        submit({ spuClass: key === 'all' ? null : key });
        setSkuClass(key);
      }} className={style.tab}>
        <Tabs.Tab title='全部' key='all' />
        {
          ToolUtil.isArray(skuClassData).map((item) => {
            return <Tabs.Tab title={item.name} key={item.spuClassificationId} />;
          })
        }
      </Tabs>
    </div>

    <div className={style.skuList}>
      <MyList
        ref={skuRef}
        api={skuList}
        response={(res) => {
          setNumber(res.count);
        }}
        data={data}
        getData={setData}
      >
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
      </MyList>
    </div>

    <AddSku
      ref={addSku}
      onChange={(sku) => {
        setSkus([...skus, sku]);
      }}
    />

    <SkuShop skus={skus} setSkus={setSkus} />

  </div>;
};

export default React.forwardRef(SkuInstock);
