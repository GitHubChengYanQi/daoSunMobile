import React, { useState } from 'react';
import MySearch from '../../../../../../components/MySearch';
import styles from './index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyList from '../../../../../../components/MyList';
import { productionPlanList } from '../../../../components/Url';
import { Button } from 'antd-mobile';
import Label from '../../../../../../components/Label';
import { orderList } from '../../../../../Order/Url';
import { isArray } from '../../../../../../../util/ToolUtil';
import MyEllipsis from '../../../../../../components/MyEllipsis';
import { SkuResultSkuJsons } from '../../../../../../Scan/Sku/components/SkuResult_skuJsons';

const History = (
  {
    onChange = () => {
    },
  },
) => {

  const [key, setKey] = useState();

  const [list, setList] = useState([]);

  return <>
    <MySearch />
    <div className={styles.header} onClick={() => {
      setKey(key === 0 ? null : 0);
    }}>
      <div>历史计划</div>
      {key === 0 ? <DownOutline /> : <UpOutline />}
    </div>
    {key === 0 && <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
      <MyList pullDisabled api={productionPlanList} data={list} getData={setList}>
        {
          list.map((item, index) => {
            return <div
              key={index}
              className={styles.item}
            >
              <div className={styles.title}>
                <div className={styles.status}>
                  <div className={styles.theme}>{item.theme || '无主题'}</div>
                </div>
                <Button color='primary' fill='outline' onClick={() => {
                  onChange(isArray(item.planDetailResults).map(item => ({
                    ...item,
                    number: item.planNumber,
                    partsId: item.partsId,
                    name: item.partsResult?.name,
                  })));
                }}>添加</Button>
              </div>
              <div className={styles.row}>
                {
                  isArray(item.planDetailResults).map((item, index) => {
                    return <div key={index} className={styles.spuItem}>
                      <div className={styles.sku}>
                        <MyEllipsis maxWidth={300}>{SkuResultSkuJsons({ skuResult: item.skuResult })}</MyEllipsis>
                      </div>
                      <div>× {item.planNumber}</div>
                    </div>;
                  })
                }
              </div>
              <div className={styles.row}>
                <Label className={styles.label}>完成时间</Label>：{item.updateTime || ''}
              </div>
            </div>;
          })
        }
      </MyList>
    </div>}
    <div className={styles.space} />
    <div className={styles.header} onClick={() => {
      setKey(key === 1 ? null : 1);
    }}>
      <div>历史订单</div>
      {key === 1 ? <DownOutline /> : <UpOutline />}
    </div>

    {key === 1 && <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
      <MyList pullDisabled api={orderList} params={{ type: 2 }} getData={setList} data={list}>
        {
          list.map((item, index) => {
            let numner = 0;
            isArray(item.detailResults).forEach(item => numner += (item.purchaseNumber || 0));
            return <div key={index} className={styles.orderItem}>
              <div className={styles.orderInfo}>
                <div>
                  <Label className={styles.label}>国家</Label>：无
                </div>
                <div>
                  <Label className={styles.label}>订单编号</Label>：{item.coding}
                </div>
                <div>
                  <Label className={styles.label}>产品数量</Label>：{numner}
                </div>
                <div>
                  <Label className={styles.label}>交货期</Label>：{item.leadTime || 0}天
                </div>
              </div>
              <Button color='primary' fill='outline' onClick={() => {
                onChange(isArray(item.detailResults).map(item => ({
                  ...item,
                  number: item.purchaseNumber,
                  partsId: item.skuResult?.partsId,
                  name: item.skuResult?.partsResult?.name,
                })));
              }}>添加</Button>
            </div>;
          })
        }
      </MyList>
    </div>}
  </>;
};

export default History;
