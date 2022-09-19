import React, { useEffect, useState } from 'react';
import MyEmpty from '../../../../../components/MyEmpty';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../components/ToolUtil';
import style from '../InStockLog/index.less';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import LinkButton from '../../../../../components/LinkButton';
import { SystemQRcodeOutline } from 'antd-mobile-icons';
import ShopNumber from '../../../../../Work/AddShop/components/ShopNumber';
import { MyDate } from '../../../../../components/MyDate';
import MySearch from '../../../../../components/MySearch';
import { useHistory } from 'react-router-dom';

export const logList = { url: '/instockLogDetail/getOutStockLogs', method: 'POST' };

const OutStockLog = (
  {
    outstockOrderId,
  },
) => {

  const history = useHistory();

  const { loading, data, run } = useRequest(logList, { manual: true });

  const [searchValue, setSearchValue] = useState();

  const submit = (skuName) => {
    run({ data: { sourceId: outstockOrderId, skuName } });
  };

  useEffect(() => {
    if (outstockOrderId) {
      submit();
    }
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!outstockOrderId) {
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
        const storehousePositionsResult = item.storehousePositionsResult || {};
        return <div key={index}>
          <div className={style.skuItem}>
            <div className={style.sku}>
              <div className={style.item}>
                <SkuItem
                  skuResult={item.skuResult}
                  extraWidth='90px'
                  otherData={[
                    ToolUtil.isObject(item.brandResult).brandName || '任意品牌',
                  ]}
                />
              </div>
              <div className={style.errorData}>
                <div>
                  <LinkButton onClick={() => {
                    history.push({
                      pathname: '/Work/Inkind/InkindList',
                      query: {
                        inkindIds: ToolUtil.isArray(item.inkindIds).toString(),
                      },
                    });
                  }}><SystemQRcodeOutline /></LinkButton>
                </div>
                <ShopNumber show value={item.number} />
              </div>
            </div>

            <div className={style.log} key={index}>
              <div className={style.data}>
                <div className={style.left}>库位：{storehousePositionsResult.name || '无'}</div>
                <div>{ToolUtil.isObject(item.user).name} / {MyDate.Show(item.createTime)}</div>
              </div>
            </div>
          </div>
        </div>;
      })
    }
  </>;
};

export default OutStockLog;
