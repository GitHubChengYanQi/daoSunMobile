import React from 'react';
import { useRequest } from '../../../../util/Request';
import { Space } from 'antd-mobile';
import LinkButton from '../../../components/LinkButton';
import { history } from 'umi';
import PrintCode from '../../../components/PrintCode';
import MyNavBar from '../../../components/MyNavBar';
import { ToolUtil } from '../../../components/ToolUtil';
import Positions
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';

const StoreHousePositions = (props) => {

  const { id } = props.location.query;

  const { run: getCode } = useRequest(
    {
      url: '/storehousePositions/positionsResultById',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: (res) => {
        PrintCode.print([res.printTemplateResult.templete], 0);
      },
    });

  const extra = (item) => {
    return <Space>
      <LinkButton onClick={() => {
        getCode({
          params: {
            id: item.key,
          },
        });
      }}>
        打印二维码
      </LinkButton>
      <LinkButton onClick={() => {
        history.push(`/Work/Stock?storehousePositionsId=${item.key}`);
      }}>
        查看库存
      </LinkButton>
    </Space>;
  };

  return <div style={{ backgroundColor: '#fff' }}>
    <MyNavBar title='库位信息' />
    <Positions
      height='100vh'
      hiddenButton
      storehouseId={id}
      extra={extra}
    />
  </div>;
};

export default StoreHousePositions;
