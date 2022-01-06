import React, { useEffect, useRef } from 'react';
import { useRequest } from '../../../../util/Request';
import { storehousePositionsTreeView } from '../../../Scan/Url';
import { Skeleton } from 'weui-react-v2';
import MyEmpty from '../../../components/MyEmpty';
import { List, Space } from 'antd-mobile';
import LinkButton from '../../../components/LinkButton';
import { history } from 'umi';
import Html2Canvas from '../../../Html2Canvas';

const StoreHousePositions = (props) => {

  const { id } = props.location.query;

  const ref = useRef();

  const { loading, data, run } = useRequest(storehousePositionsTreeView, { manual: true });

  const {run:getCode} = useRequest(
    {
      url: '/storehousePositions/positionsResultById',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: (res) => {
        ref.current.setTemplete(res.printTemplateResult.templete);
        ref.current.setCodeId(true);
      }
    });

  useEffect(() => {
    if (id)
      run({ params: { ids: id } });
  }, []);

  if (loading)
    return <Skeleton loading={loading} />;

  if (!data || data.length <= 0)
    return <MyEmpty height='100vh' />;

  const storehousePositions = (values) => {
    return <List
    style={{
      '--border-inner':'none',
      '--border-top':'none',
      '--border-bottom':'none',
    }}
    >
      {values.map((items, index) => {
        return <List.Item
          key={index}
          title={items.title}
          extra={items.children.length <= 0 && <Space>
            <LinkButton onClick={() => {
              getCode({
                params: {
                  id:items.key,
                }
              });
            }} title='打印二维码' />
            <LinkButton onClick={() => {
              history.push(`/Work/Stock/StockDetails?storehousePositionsId=${items.key}`);
            }} title='查看库存' />
          </Space>}
          >
          {
            items.children && storehousePositions(items.children)
          }
        </List.Item>;
      })}
    </List>;
  };

  return <>
    {storehousePositions(data)}
    <Html2Canvas ref={ref} />
  </>
};

export default StoreHousePositions;
