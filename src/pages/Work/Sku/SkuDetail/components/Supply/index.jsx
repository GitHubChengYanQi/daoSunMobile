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

export const supplyList = { url: '/supply/bindList', method: 'POST' };

const Supply = ({ skuId }) => {

  const [data, setData] = useState([]);

  const { loading } = useRequest({ ...supplyList, data: { skuId } }, {
    onSuccess: (res) => {
      const newData = [];
      isArray(res).forEach(item => {
        const customerIds = newData.map(item => item.customerId);
        const customerIndex = customerIds.indexOf(item.customerId);
        const brandResult = item.brandResult || {};
        if (customerIndex === -1) {
          newData.push({ ...item, brandNames: [brandResult.brandName] });
        } else {
          const customer = newData[customerIndex];
          newData[customerIndex] = { ...customer, brandNames: [...customer.brandNames, brandResult.brandName] };
        }
      });
      setData(newData);
    },
  });
  const [visible, setVisible] = useState(false);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (isArray(data).length === 0) {
    return <></>;
  }

  return <>
    <div className={styles.supply}>
      <div className={styles.title}>
        供应商{data.length > 1 ? `(${data.length})` : ''}
        <span className={styles.extra}><LinkButton onClick={() => {
          setVisible(true);
        }}>查看更多<RightOutline /></LinkButton></span>
      </div>
      {
        data.filter((item, index) => index < 2).map((item, index) => {
          return <div key={index} className={classNames(styles.flexCenter, styles.supplyItem)}>
            <div className={styles.flexGrow}>{isObject(item.customerResult).customerName}</div>
            {/*<span>交货期：30 天</span>*/}
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
        {
          data.map((item, index) => {
            return <MyCard
              className={styles.supplyCard}
              key={index}
              titleBom={isObject(item.customerResult).customerName}
              // extra='交货期：30天'
              bodyClassName={styles.supplyContent}
              headerClassName={styles.supplyHeader}
            >
              <Space wrap>
                {
                  isArray(item.brandNames).map((item, index) => {
                    return <div className={styles.brands} key={index}>
                      {item || '无品牌'}
                    </div>;
                  })
                }
              </Space>
            </MyCard>;
          })
        }
      </div>
    </MyAntPopup>
  </>;
};

export default Supply;
