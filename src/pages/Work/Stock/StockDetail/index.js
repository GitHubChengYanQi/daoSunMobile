import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import MySearch from '../../../components/MySearch';
import Icon from '../../../components/Icon';
import SkuList from '../../Sku/SkuList';
import MyAntList from '../../../components/MyAntList';
import { List } from 'antd-mobile';
import SkuItem from '../../Sku/SkuItem';
import LinkButton from '../../../components/LinkButton';
import AddSku from '../../AddShop/components/AddSku';
import CreateInStock from '../../ProcessTask/Create/components/CreateInStock';
import { ToolUtil } from '../../../components/ToolUtil';
import { ERPEnums } from '../ERPEnums';
import MyActionSheet from '../../../components/MyActionSheet';
import { useLocation } from 'react-router-dom';

export const shopCartShow = { url: '/shopCart/backType', method: 'POST' };

export const SkuContent = (
  {
    data,
    openTask = () => {
    },
    skus = [],
    type,
  }) => {

  const positionResult = (data) => {

    if (!data) {
      return '';
    }

    if (!data.supper) {
      return data.name;
    }

    return `${positionResult(data.supper)}-${data.name}`;
  };

  const shopSkuIds = skus.map(item => item.skuId);

  return <>
    <MyAntList>
      {
        data.map((item, index) => {

          const isShop = shopSkuIds.includes(item.skuId);

          const positions = item.positionsResult || [];

          const spuResult = item.spuResult || {};
          const unit = spuResult.unitResult || {};

          let buttonHidden = false;
          switch (type) {
            case ERPEnums.stocktaking:
              buttonHidden = isShop;
              break;
            default:
              break;
          }

          return <List.Item key={index} className={style.listItem}>
            <div className={style.skuItem}>
              <div className={style.sku}>
                <SkuItem
                  textView
                  imgId={`skuImg${index}`}
                  extraWidth='84px'
                  unitName={unit.unitName}
                  skuResult={item}
                  otherData={[
                    positions.map((item) => {
                      return positionResult(item);
                    }).join(' / '),
                  ]}
                />
              </div>
              <div>
                {buttonHidden ? <span style={{ fontSize: 14 }}>已添加</span> : <LinkButton onClick={() => {
                  openTask({ ...item, imgId: `skuImg${index}` });
                }}>
                  <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
                </LinkButton>}
              </div>
            </div>
          </List.Item>;
        })
      }
    </MyAntList>
  </>;
};

const StockDetail = (
  {
    setTask = () => {
    },
    stockDetail = {},
    setSkus = () => {
    },
    tasks,
    refreshTask = () => {

    },
  }) => {


  const ref = useRef();

  const addSku = useRef();

  const [skuName, setSkuName] = useState('');

  const [visible, setVisible] = useState();

  const [skuItem, setSkuItem] = useState();

  const [taskVisible, setTaskVisible] = useState();

  const { query } = useLocation();

  useEffect(()=>{
    if (query.storehousePositionsId){
      ref.current.submit({storehousePositionsId: query.storehousePositionsId});
    }
  },[query.storehousePositionsId])

  return <>

    <div className={style.search}>
      <MySearch
        historyType='stock'
        placeholder='请输入物料相关信息'
        onSearch={(value) => {
          ref.current.submit({ skuName: value });
        }}
        onChange={(value)=>{
          ref.current.submit({ skuName: value });
          setSkuName(value);
        }}
        value={skuName}
        onClear={() => {
          ref.current.submit({ skuName: null });
        }}
      />
    </div>

    <SkuList
      debounceInterval={300}
      stock
      ref={ref}
      defaultParams={{ stockView: true, openPosition: true }}
      SkuContent={SkuContent}
      skuContentProps={{
        type: stockDetail.task,
        skus: stockDetail.skus,
        openTask: (item) => {
          if (stockDetail.task) {
            addSku.current.openSkuAdd(item, stockDetail.task);
          } else {
            setVisible(true);
            setSkuItem(item);
          }
        },
      }}
      open={{ bom: true, position: true, state: true, number: true }}
    />

    <AddSku
      skus={stockDetail.skus}
      ref={addSku}
      type={stockDetail.task}
      onChange={(sku, type) => {
        setSkus([...ToolUtil.isArray(stockDetail.skus), sku], type);
      }}
      onClose={() => {
        refreshTask();
      }}
    />

    <MyActionSheet
      visible={visible}
      actions={tasks}
      onClose={() => {
        setTask(null);
        setVisible(false);
      }}
      onAction={(action) => {
        switch (action.key) {
          case ERPEnums.inStock:
            setTaskVisible(action.key);
            break;
          default:
            setTask(action.key);
            addSku.current.openSkuAdd(skuItem, action.key);
            setSkuItem(null);
            break;
        }
        setVisible(false);
      }}
    />

    <CreateInStock
      open={taskVisible === ERPEnums.inStock}
      onClose={() => setTaskVisible(false)}
      submit={() => {
        setTask(ERPEnums.inStock, false);
        addSku.current.openSkuAdd(skuItem, ERPEnums.inStock);
        setSkuItem(null);
        setTaskVisible(false);
        return true;
      }}
      directInStock={() => {
        setTask(ERPEnums.directInStock, true);
        addSku.current.openSkuAdd(skuItem, ERPEnums.directInStock);
        setSkuItem(null);
        setTaskVisible(false);
        return true;
      }}
    />

  </>;
};

export default StockDetail;
