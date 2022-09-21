import React, { useState } from 'react';
import styles from '../../index.less';
import LinkButton from '../../../../../components/LinkButton';
import { RightOutline } from 'antd-mobile-icons';
import { classNames, isArray, isObject } from '../../../../../components/ToolUtil';
import MyCard from '../../../../../components/MyCard';
import { Space } from 'antd-mobile';
import MyAntPopup from '../../../../../components/MyAntPopup';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import MyList from '../../../../../components/MyList';

export const supplyList = { url: '/supply/list', method: 'POST' };

const Supply = ({ skuId }) => {

  const { loading, data:skuSupplys } = useRequest({ ...supplyList, data: { skuId }, params: { limit: 2, page: 1 } });

  const [visible, setVisible] = useState(false);

  const [data, setData] = useState([]);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (isArray(skuSupplys).length === 0) {
    return <></>;
  }

  return <>
    <div className={styles.supply}>
      <div className={styles.title}>
        供应商(2)
        <span className={styles.extra}><LinkButton onClick={() => {
          setVisible(true);
        }}>查看更多<RightOutline /></LinkButton></span>
      </div>
      {
        skuSupplys.map((item, index) => {
          return <div key={index} className={classNames(styles.flexCenter, styles.supplyItem)}>
            <div className={styles.flexGrow}>{isObject(item.customerResult).customerName}</div>
            <span>交货期：30 天</span>
          </div>;
        })
      }
    </div>

    <MyAntPopup
      visible={visible}
      title='供应商'
      onClose={() => setVisible('')}
    >
      <div style={{ padding: 12 }}>
        <MyList noTips api={supplyList} data={data} getData={setData} params={{ skuId }}>
          {
            data.map((item, index) => {
              return <MyCard
                className={styles.supplyCard}
                key={index}
                titleBom={isObject(item.customerResult).customerName}
                extra='交货期：30天'
                bodyClassName={styles.supplyContent}
                headerClassName={styles.supplyHeader}
              >
                <Space wrap>
                  {
                    [item.brandResult].map((item, index) => {
                      return <div className={styles.brands} key={index}>
                        {item.brandName || '无品牌'}
                      </div>;
                    })
                  }
                </Space>
              </MyCard>;
            })
          }
        </MyList>
      </div>
    </MyAntPopup>
  </>;
};

export default Supply;
