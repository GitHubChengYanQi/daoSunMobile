import React from 'react';
import { Space, SwipeAction, Toast } from 'antd-mobile';
import MyEmpty from '../../../../../components/MyEmpty';
import MyEllipsis from '../../../../../components/MyEllipsis';
import { SkuResultSkuJsons } from '../../../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../../../components/Label';
import { useRequest } from '../../../../../../util/Request';
import { productionPickListsCartDelete } from '../../../components/Url';
import { MyLoading } from '../../../../../components/MyLoading';
import BottomButton from '../../../../../components/BottomButton';
import Icon from '../../../../../components/Icon';
import { history } from 'umi';

const Carts = (
  {
    ids,
    data,
    onSuccess = () => {
    },
  }) => {

  const { loading, run } = useRequest(productionPickListsCartDelete, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '移出成功！',
        position: 'bottom',
      });
      onSuccess();
    },
  });

  if (!Array.isArray(data) || data.length === 0) {
    return <MyEmpty />;
  }

  return <>
    {loading && <MyLoading />}
    <div style={{marginBottom:70}}>
      {
        data.map((item, index) => {
          const skuResult = item.skuResult || {};
          return <div key={index} style={{ borderBottom: 'solid #eee 1px',marginBottom:8,paddingBottom:8 }}>
            <SwipeAction
              rightActions={[
                {
                  key: 'delete',
                  text: '移出',
                  color: 'danger',
                  onClick: () => {
                    run({
                      data: {
                        pickListsCart: item.pickListsCart,
                      },
                    });
                  },
                },
              ]}
            >
              <div style={{ display: 'flex', padding: '0 8px' }}>
                <div style={{ flexGrow: 1 }}>
                  <MyEllipsis>{SkuResultSkuJsons({ skuResult })}</MyEllipsis>
                  <div style={{ display: 'flex',fontSize:'4vw' }}>
                    <Label>描述：</Label>
                    <MyEllipsis width='60%'>
                      {SkuResultSkuJsons({ skuResult ,describe:true})}</MyEllipsis>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  × {item.number}
                </div>
              </div>
            </SwipeAction>
          </div>;
        })
      }
    </div>

    <BottomButton
      only
      text={<Space><Icon type='icon-chuku' />备料完成</Space>}
      onClick={() => {
        history.push(`/Work/Production/PickOutStock?ids=${ids}`);
      }}
    />
  </>;
};

export default Carts;
