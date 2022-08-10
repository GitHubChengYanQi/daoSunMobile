import React, { useEffect } from 'react';
import { useRequest } from '../../../../util/Request';
import { storehousePositionsTreeView } from '../../../Scan/Url';
import { Skeleton } from 'weui-react-v2';
import MyEmpty from '../../../components/MyEmpty';
import { Dialog, List, Space } from 'antd-mobile';
import LinkButton from '../../../components/LinkButton';
import { history } from 'umi';
import { AppstoreOutline } from 'antd-mobile-icons';
import PrintCode from '../../../components/PrintCode';
import MyNavBar from '../../../components/MyNavBar';
import { ToolUtil } from '../../../components/ToolUtil';

const StoreHousePositions = (props) => {

  const { id } = props.location.query;

  const { loading, data, run } = useRequest(storehousePositionsTreeView, { manual: true });

  const { run: getCode } = useRequest(
    {
      url: '/storehousePositions/positionsResultById',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: (res) => {
        PrintCode.print([res.printTemplateResult.templete],0)
      },
    });

  useEffect(() => {
    if (id){
      run({ params: { ids: id } });
    }
  }, [id]);

  const action = (items) => {
    return items.children.length === 0 && <LinkButton title={<AppstoreOutline />} onClick={()=>{
      Dialog.show({
        content: items.title,
        closeOnAction: true,
        onAction: (action) => {
          if (action.key === 'print') {
            getCode({
              params: {
                id: items.key,
              },
            });
          } else if (action.key === 'see') {
            history.push(`/Work/Stock?storehousePositionsId=${items.key}`);
          }
        },
        actions: [
          {
            key: 'print',
            text: '打印二维码',
            display:ToolUtil.isQiyeWeixin(),
          },
          {
            key: 'see',
            text: '查看库存',
          },
          {
            key: 'close',
            text: '取消',
          },
        ],
      });
    }} />
  }

  if (loading)
    return <Skeleton loading={loading} />;

  if (!data || data.length <= 0)
    return <MyEmpty height='100vh' />;

  const storehousePositions = (values) => {
    return <List
      style={{
        '--border-inner': 'none',
        '--border-top': 'none',
        '--border-bottom': 'none',
      }}
    >
      {values.map((items, index) => {
        return <List.Item
          key={index}
          title={<Space>{items.title}{action(items)}</Space>}
        >
          {
            items.children && storehousePositions(items.children)
          }
        </List.Item>;
      })}
    </List>;
  };

  return <>
    <MyNavBar title='库位信息' />
    {storehousePositions(data)}
  </>;
};

export default StoreHousePositions;
