import React, { useState } from 'react';
import MySearch from '../../../../../components/MySearch';
import MyCard from '../../../../../components/MyCard';
import SkuItem from '../../../../Sku/SkuItem';
import styles from './index.less';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import LinkButton from '../../../../../components/LinkButton';
import MyAntPopup from '../../../../../components/MyAntPopup';
import { Tabs } from 'antd-mobile';
import { Space } from 'antd';
import { useHistory } from 'react-router-dom';
import MyList from '../../../../../components/MyList';

export const workOrderList = { url: '/productionWorkOrder/list', method: 'POST' };

const Details = ({ productionPlanId }) => {

  const [detail, setDetail] = useState();

  const [data, setData] = useState([]);

  const history = useHistory();

  return <>
    <MySearch className={styles.search} />
    <MyList
      api={workOrderList}
      getData={setData}
      data={data}
      params={{ source: 'productionPlan', sourceId: productionPlanId }}
    >
      {
        data.map((item, index) => {
          return <div key={index} className={styles.item}>
            <MyCard
              className={styles.card}
              headerClassName={styles.header}
              title={`部件${index + 1}`}
              extra={<div>
                <span>已投产：{item.toDoNum}</span>
                <span style={{ paddingLeft: 12 }}>可投产：{item.count - item.toDoNum}</span>
              </div>}
            >
              <div className={styles.flexCenter}>
                <SkuItem imgSize={48} className={styles.flexGrow} skuResult={item.skuResult} />
                <ShopNumber show value={item.planNumber} />
              </div>
              <div className={styles.ships}>
                <div key={index} className={styles.flexCenter}>
                  <div className={styles.flexGrow}>工序：{item.setpSetResult.shipSetpResult.shipSetpName}</div>
                  8/8
                </div>
              </div>
            </MyCard>
            <div className={styles.buttons}>
              <LinkButton onClick={() => setDetail(item)}>生产详情</LinkButton>
              <div className={styles.space} />
              <LinkButton
                onClick={() => history.push({
                  pathname: '/Work/Production/ProductionDetail/ApplyProduction',
                })}>申请投产</LinkButton>
            </div>
          </div>;
        })
      }
    </MyList>


    <MyAntPopup
      title='生产物料详情'
      visible={detail}
      onClose={() => setDetail()}
    >
      <MyCard
        className={styles.card}
        headerClassName={styles.header}
        title='部件'
        extra={<div>
          <span>已投产：10</span>
          <span style={{ paddingLeft: 12 }}>可投产：1</span>
        </div>}
      >
        <div className={styles.flexCenter}>
          <SkuItem imgSize={56} className={styles.flexGrow} skuResult={detail?.skuResult} />
          <ShopNumber show value={detail?.planNumber} />
        </div>
      </MyCard>

      <MyCard
        className={styles.card}
        headerClassName={styles.header}
        title='配套产品'
        extra={<Tabs defaultActiveKey='1' className={styles.tabs}>
          {
            [1, 2, 3, 4, 5].map((item, index) => {
              return <Tabs.Tab title={`产品${index + 1}`} key={index} />;
            })
          }
        </Tabs>}
      >
        <div className={styles.flexCenter}>
          <SkuItem imgSize={56} className={styles.flexGrow} skuResult={detail?.skuResult} />
          <ShopNumber show value={detail?.planNumber} />
        </div>
      </MyCard>

      <MyCard
        titleBom={<div className={styles.tabDiv}>工序</div>}
        className={styles.card}
        headerClassName={styles.tabDivHeader}
        extra='床身装配序'
      >
        <Space size={24}>
          <div>需求数量：6</div>
          <div>已投产：6</div>
          <div>可投产：6</div>
        </Space>
      </MyCard>

      <MyCard
        titleBom={<div className={styles.tabDiv}>产品编号</div>}
        className={styles.card}
        headerClassName={styles.tabDivHeader}
      >
        {
          [1, 2].map((item, index) => {
            return <div key={index} className={styles.customer}>
              <div className={styles.customerContract}>
                客户/合同：危地马拉/HGLSI038852
              </div>
              {
                [1, 2, 3].map((item, index) => {
                  return <div key={index} className={styles.coding}>
                    <div>0HT00000000001</div>
                    <LinkButton>导出</LinkButton>
                  </div>;
                })
              }
            </div>;
          })
        }
      </MyCard>
    </MyAntPopup>
  </>;
};

export default Details;
