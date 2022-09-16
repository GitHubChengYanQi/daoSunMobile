import React, { useRef, useState } from 'react';
import { ToolUtil } from '../../../../../components/ToolUtil';
import MyList from '../../../../../components/MyList';
import style from '../../ReceiptData/components/Stocktaking/index.less';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import Icon from '../../../../../components/Icon';
import { UserName } from '../../../../../components/User';
import { MyDate } from '../../../../../components/MyDate';
import { Button, Popup } from 'antd-mobile';
import Error from '../../ReceiptData/components/InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../index';
import MySearch from '../../../../../components/MySearch';

export const historyList = { url: '/instockLogDetail/list', method: 'POST' };

const StocktaskingLog = ({ detail = {} }) => {

  const ref = useRef();

  const [data, setData] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const submit = (skuName) => {
    ref.current.submit({ sourceId: detail.inventoryTaskId, skuName });
  };
  const [visible, setVisible] = useState({});

  const showStock = detail.method === 'OpenDisc';

  const dataList = () => {
    return data.map((skuItem, skuIndex) => {
      const text = skuItem.type === 'error' ? '异常' : '正常';
      const color = skuItem.type === 'error' ? 'var(--adm-color-danger)' : '#257BDE';

      return <div key={skuIndex} className={style.positionItem}>
        <div className={style.skus}>
          <div
            className={style.sku}
            key={skuIndex}
            style={{ border: 'none' }}>
            <div className={style.skuItem} onClick={() => {

            }}>
              <SkuItem
                skuResult={skuItem.skuResult}
                extraWidth='100px'
                hiddenNumber={!showStock}
                number={skuItem.number}
                otherData={[
                  ToolUtil.isObject(skuItem.brandResult).brandName || '无品牌',
                  ToolUtil.isObject(skuItem.storehousePositionsResult).name,
                ]}
              />
            </div>
            <div className={style.info} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ color }} className={style.actionStatus}>
                <Icon type='icon-dian' /> {text}
              </div>
              {skuItem.type === 'error' && <Button className={style.inventoryButton} onClick={() => {
                setVisible({ ...skuItem, type: ReceiptsEnums.stocktaking, number: skuItem.stockNumber });
              }}>查看</Button>}
            </div>
          </div>
          <div className={style.update}>
            <div className={style.time}>{MyDate.Show(skuItem.createTime)}</div>
            <div><UserName user={skuItem.user} /></div>
          </div>
        </div>

        <div className={style.space} />
      </div>;
    });
  };

  return <div className={style.stocktaking}>
    <MySearch
      onChange={setSearchValue}
      value={searchValue}
      onClear={() => submit()}
      onSearch={(value) => {
        submit(value);
      }}
    />
    <MyList
      ref={ref}
      api={historyList}
      params={{ sourceId: detail.inventoryTaskId }}
      data={data}
      getData={setData}>
      {dataList()}
    </MyList>

    <Popup visible={visible.anomalyId} onMaskClick={() => setVisible({})} destroyOnClose>
      <Error
        title='盘点记录'
        noDelete
        showStock
        onClose={() => setVisible({})}
        id={visible.anomalyId}
        showError
        type={visible.type}
        skuItem={visible}
      />
    </Popup>
  </div>;
};

export default StocktaskingLog;
