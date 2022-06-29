import React, { useRef, useState } from 'react';
import style from './index.less';
import MySearch from '../../../components/MySearch';
import Icon from '../../../components/Icon';
import SkuList from '../../Sku/SkuList';
import MyAntList from '../../../components/MyAntList';
import { ActionSheet, List } from 'antd-mobile';
import SkuItem from '../../Sku/SkuItem';
import MyEllipsis from '../../../components/MyEllipsis';
import LinkButton from '../../../components/LinkButton';
import AddSku from '../../Instock/InstockAsk/coponents/SkuInstock/components/AddSku';
import CreateInStock from '../../ProcessTask/Create/components/CreateInStock';
import { ToolUtil } from '../../../components/ToolUtil';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { ERPEnums } from '../ERPEnums';

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

  return <MyAntList>
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
                extraWidth='84px'
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
            </div>
            <div>
              {buttonHidden ? <span style={{ fontSize: 14 }}>已添加</span> : <LinkButton onClick={() => {
                openTask(item);
              }}>
                <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
              </LinkButton>}
            </div>
          </div>
        </List.Item>;
      })
    }
  </MyAntList>;
};

const StockDetail = (
  {
    storehousePositionsId,
    setTask = () => {
    },
    stockDetail = {},
    setSkus = () => {
    },
  }) => {


  const ref = useRef();

  const addSku = useRef();

  const [skuName, setSkuName] = useState('');

  const [visible, setVisible] = useState();

  const [skuItem, setSkuItem] = useState();

  const [taskVisible, setTaskVisible] = useState();

  const tasks = [
    { text: '出库任务', key: ERPEnums.outStock },
    { text: '入库任务', key: ERPEnums.inStock },
    { text: '盘点任务', key: ERPEnums.stocktaking },
    { text: '调拨任务', key: ERPEnums.allocation },
    // { text: '养护任务', key: ERPEnums.curing },
  ];

  const { loading: getDefaultShop } = useRequest({
    ...shopCartShow,
    data: { types: tasks.map(item => item.key) },
  }, {
    onSuccess: (res) => {
      if (ToolUtil.isArray(res).length > 0) {
        setTask(res[0]);
      }
    },
  });

  return <>

    {getDefaultShop && <MyLoading />}

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
      stock
      ref={ref}
      defaultParams={{ stockView: true, openPosition: true, storehousePositionsId }}
      SkuContent={SkuContent}
      skuContentProps={{
        type: stockDetail.task,
        skus: stockDetail.skus,
        openTask: (item) => {
          if (stockDetail.task) {
            addSku.current.openSkuAdd(item);
          } else {
            setVisible(true);
            setSkuItem(item);
          }
        },
      }}
      open={{ bom: true, position: true, state: true, number: true }}
    />

    <AddSku
      judge={stockDetail.judge}
      skus={stockDetail.skus}
      ref={addSku}
      type={stockDetail.task}
      onChange={(sku, type) => {
        setSkus([...ToolUtil.isArray(stockDetail.skus), sku],type);
      }}
      onClose={() => {
        setTask(null);
      }}
    />

    <ActionSheet
      className={style.action}
      cancelText='取消'
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
