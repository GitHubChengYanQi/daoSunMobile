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

export const shopCartShow = { url: '/shopCart/backType', method: 'POST' };

export const SkuContent = (
  {
    data,
    openTask = () => {
    },
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

  return <MyAntList>
    {
      data.map((item, index) => {

        const positions = item.positionsResult || [];

        const spuResult = item.spuResult || {};
        const unit = spuResult.unitResult || {};

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
              <LinkButton onClick={() => {
                openTask(item);
              }}>
                <Icon type='icon-jiahao' style={{ fontSize: 20 }} />
              </LinkButton>
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
    { text: '出库任务', key: 'outStock' },
    { text: '入库任务', key: 'inStock' },
    { text: '盘点任务', key: 'stocktaking' },
    { text: '调拨任务', key: 'allocation' },
    { text: '养护任务', key: 'curing' },
  ];

  const { loading: getDefaultShop } = useRequest({
    ...shopCartShow,
    data: { types: tasks.map(item => item.key) },
  }, {
    onSuccess: (res) => {
      if (ToolUtil.isArray(res).length > 0){
        setTask(res[0])
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
      onChange={(sku) => {
        setSkus([...ToolUtil.isArray(stockDetail.skus), sku]);
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
          case 'inStock':
            setTaskVisible(action.key);
            break;
          default:
            setTask(action.key);
            addSku.current.openSkuAdd(skuItem);
            setSkuItem(null);
            break;
        }
        setVisible(false);
      }}
    />

    <CreateInStock
      open={taskVisible === 'inStock'}
      onClose={() => setTaskVisible(false)}
      submit={() => {
        setTask('inStock', false);
        addSku.current.openSkuAdd(skuItem);
        setSkuItem(null);
        setTaskVisible(false);
        return true;
      }}
      directInStock={() => {
        setTask('directInStock', true);
        addSku.current.openSkuAdd(skuItem);
        setSkuItem(null);
        setTaskVisible(false);
        return true;
      }}
    />

  </>;
};

export default StockDetail;
