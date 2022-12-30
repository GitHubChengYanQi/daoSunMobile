import React, { useState } from 'react';
import styles from '../../index.less';
import LinkButton from '../../../../../components/LinkButton';
import { RightOutline } from 'antd-mobile-icons';
import { classNames, isArray } from '../../../../../../util/ToolUtil';
import MyAntPopup from '../../../../../components/MyAntPopup';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import MyList from '../../../../../components/MyList';
import SkuItem from '../../../SkuItem';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import { partsList } from '../../../SkuList/components/SkuScreen/components/Url';
import { SkuResultSkuJsons } from '../../../../../Scan/Sku/components/SkuResult_skuJsons';
import { MyDate } from '../../../../../components/MyDate';

const Doms = ({ skuId }) => {

  const { loading, data: boms = {} } = useRequest({
    ...partsList,
    data: { skuId },
    params: { limit: 2, page: 1 },
  }, {
    response: true,
  });

  const [visible, setVisible] = useState(false);

  const [data, setData] = useState([]);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (isArray(boms.data).length === 0) {
    return <></>;
  }

  return <>
    <div className={styles.bom}>
      <div className={styles.title}>
        关联物料清单 {boms.length > 1 ? `(${boms.length})` : ''}
        <span className={styles.extra}><LinkButton onClick={() => {
          setVisible(true);
        }}>查看更多<RightOutline /></LinkButton></span>
      </div>
      {
        boms.data.map((item, index) => {
          return <div key={index} className={classNames(styles.flexCenter, styles.bomItem)}>
            <SkuItem
              hiddenNumber
              extraWidth='100px'
              skuResult={item.skuResult}
              title={SkuResultSkuJsons({ skuResult: item.skuResult })}
              className={styles.flexGrow}
              oneRow
              otherData={[
                `版本号：${item.name || '无'}`,
                `创建时间：${MyDate.Show(item.createTime)}`,
                item.note || '无备注',
              ]}
            />
            <ShopNumber show value={20} />
          </div>;
        })
      }
    </div>
    <MyAntPopup
      visible={visible}
      title='关联物料清单'
      onClose={() => setVisible('')}
    >
      <div style={{ padding: 12 }}>
        <MyList noTips api={partsList} data={data} getData={setData} params={{ skuId }}>
          {
            data.map((item, index) => {
              return <div key={index} className={classNames(styles.flexCenter, styles.bomItem)}>
                <SkuItem
                  hiddenNumber
                  extraWidth='100px'
                  skuResult={item.skuResult}
                  title={SkuResultSkuJsons({ skuResult: item.skuResult })}
                  className={styles.flexGrow}
                  oneRow
                  otherData={[
                    `版本号：${item.name || '无'}`,
                    `创建时间：${MyDate.Show(item.createTime)}`,
                    item.note || '无备注',
                  ]}
                />
                <ShopNumber show value={20} />
              </div>;
            })
          }
        </MyList>
      </div>
    </MyAntPopup>
  </>;
};

export default Doms;
