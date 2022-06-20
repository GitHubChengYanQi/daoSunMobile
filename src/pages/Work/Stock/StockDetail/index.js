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
import { useRequest } from '../../../../util/Request';
import { judgeLoginUser } from '../../Instock/InstockAsk/Submit/components/InstockSkus';
import { MyLoading } from '../../../components/MyLoading';

export const SkuContent = (
  {
    data,
    openTask = () => {
    },
    checkSkuIds,
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
    task,
    setTask = () => {
    },
    skus = [],
    setSkus = () => {
    },
  }) => {

  const ref = useRef();

  const addSku = useRef();

  const [skuName, setSkuName] = useState('');

  const [visible, setVisible] = useState();

  const [judge, setJudge] = useState(false);

  const { loading: judgeLoading, data: judgeData } = useRequest(judgeLoginUser);

  return <>
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
      ref={ref}
      defaultParams={{ stockView: true, openPosition: true, storehousePositionsId }}
      SkuContent={SkuContent}
      skuContentProps={{
        openTask: (item) => {
          if (task) {
            addSku.current.openSkuAdd(item);
          } else {
            setVisible(item);
          }
        },
      }}
      open={{ bom: true, position: true, state: true, number: true }}
    />

    <AddSku
      judge={judge}
      skus={skus}
      ref={addSku}
      type={task}
      onChange={(sku) => {
        setSkus([...skus, sku]);
      }}
    />

    <ActionSheet
      className={style.action}
      cancelText='取消'
      visible={visible}
      actions={[
        { text: '出库任务', key: 'outStock' },
        { text: '入库任务', key: 'inStock' },
        { text: '盘点任务', key: 'stocktaking' },
        { text: '调拨任务', key: 'allocation' },
        { text: '养护任务', key: 'curing' },
      ]}
      onClose={() => {
        setTask(null);
        setVisible(false);
      }}
      onAction={(action) => {
        let judge = false;
        switch (action.key) {
          case 'inStock':
            judge = judgeData;
            setJudge(judgeData);
            break;
          default:
            setJudge(false);
            break;
        }
        setTask(action.key, judge);
        addSku.current.openSkuAdd(visible);
        setVisible(false);
      }}
    />

    {judgeLoading && <MyLoading />}

  </>;
};

export default StockDetail;
