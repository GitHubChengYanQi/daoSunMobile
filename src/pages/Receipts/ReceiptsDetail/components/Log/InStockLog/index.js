import React, { useEffect, useState } from 'react';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import style from './index.less';
import MyEmpty from '../../../../../components/MyEmpty';
import { ToolUtil } from '../../../../../components/ToolUtil';
import { MyDate } from '../../../../../components/MyDate';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import ShopNumber from '../../../../../Work/AddShop/components/ShopNumber';
import LinkButton from '../../../../../components/LinkButton';
import { ScanIcon } from '../../../../../components/Icon';
import { useHistory } from 'dva';
import { SystemQRcodeOutline } from 'antd-mobile-icons';
import MySearch from '../../../../../components/MySearch';

export const logList = { url: '/instockLogDetail/timeHistory', method: 'POST' };

const InStockLog = (
  {
    instockOrderId,
  },
) => {

  const history = useHistory();

  const { loading, data, run } = useRequest(logList, { manual: true });

  const [searchValue, setSearchValue] = useState();

  const submit = (skuName) => {
    run({ data: { instockOrderId, skuName } });
  };

  useEffect(() => {
    if (instockOrderId) {
      submit();
    }
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!instockOrderId) {
    return <MyEmpty />;
  }

  return <>
    <MySearch
      onChange={setSearchValue}
      value={searchValue}
      onClear={() => submit()}
      onSearch={(value) => {
        submit(value);
      }}
    />
    {ToolUtil.isArray(data).length === 0 && <MyEmpty />}
    {
      ToolUtil.isArray(data).map((item, index) => {
        const error = item.type === 'error';

        const storehousePositionsResult = item.storehousePositionsResult || {};

        return <div key={index}>
          <div className={style.skuItem}>
            <div className={style.sku}>
              <div className={style.item}>
                <SkuItem
                  skuResult={item.skuResult}
                  extraWidth='90px'
                  otherData={[
                    ToolUtil.isObject(item.customer).customerName,
                    ToolUtil.isObject(item.brandResult).brandName || '无品牌',
                  ]}
                />
              </div>
              <div className={style.errorData}>
                <span hidden={!error} className={style.error}>异常未入库</span>
                <div hidden={error}><LinkButton onClick={() => {
                  history.push({
                    pathname: '/Work/Inkind/InkindList',
                    query: {
                      inkindIds: ToolUtil.isArray(item.inkindIds).toString(),
                    },
                  });
                }}><SystemQRcodeOutline /></LinkButton></div>
                <ShopNumber textAlign='right' show value={item.number} />
              </div>
            </div>

            <div hidden={error} className={style.log} key={index}>
              <div className={style.data}>
                <div className={style.left}>库位：{storehousePositionsResult.name}</div>
                <div>{ToolUtil.isObject(item.user).name} / {MyDate.Show(item.createTime)}</div>
              </div>
            </div>
          </div>
        </div>;
      })
    }

  </>;
};

export default InStockLog;
