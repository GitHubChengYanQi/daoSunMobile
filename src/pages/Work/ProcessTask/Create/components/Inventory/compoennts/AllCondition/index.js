import React, { useEffect, useState } from 'react';
import { Picker, Popup } from 'antd-mobile';
import { useRequest } from '../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { brandListSelect } from '../../../../../../Sku/SkuList/components/SkuScreen/components/Url';
import Positions
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { Message } from '../../../../../../../components/Message';

export const materialListSelect = {
  url: '/material/listSelect',
  method: 'POST',
  rowKey: 'materialId',
};

const AllCondition = (
  {
    conditionVisible,
    onChange = () => {
    },
    onSuccess = () => {
    },
    value = {},
  },
) => {

  const [visible, setVisible] = useState();

  const sys = [
    { label: '全BOM', value: 'bom' },
    { label: '全局盘点', value: 'all' },
  ];

  const { loading: materialLoading, data: materalData, run: materalRun } = useRequest(materialListSelect, {
    manual: true,
    onSuccess: (res) => {
      if (ToolUtil.isArray(res).length === 0) {
        Message.errorToast('请添加材质！', () => {
          onSuccess();
        });
      } else {
        setVisible('material');
      }
    },
  });

  const { loading: brandLoading, data: brandData, run: brandRun } = useRequest(brandListSelect, {
    manual: true,
    onSuccess: (res) => {
      if (ToolUtil.isArray(res).length === 0) {
        Message.errorToast('请添加品牌！',()=>{
          onSuccess();
        });
      } else {
        setVisible('brand');
      }

    },
  });

  useEffect(() => {
    if (conditionVisible) {
      switch (conditionVisible) {
        case 'sys':
        case'position':
          setVisible(conditionVisible);
          break;
        case'material':
          materalRun();
          break;
        case'brand':
          brandRun();
          break;
        default:
          break;
      }
    }
  }, [conditionVisible]);

  const options = () => {
    switch (visible) {
      case 'sys':
        return sys;
      case 'material':
        return materalData || [];
      case 'brand':
        return brandData || [];
      case 'position':
        return [];
      default:
        return [];
    }
  };

  if (materialLoading || brandLoading) {
    return <MyLoading />;
  }

  return <>
    <Picker
      destroyOnClose
      value={[value.key]}
      columns={[options()]}
      visible={visible && options().length > 0}
      onClose={() => setVisible(false)}
      onConfirm={(value, options) => {
        const item = options.items[0] || {};
        onChange({ title: item.label, key: item.value });
      }}
    />

    <Popup visible={visible === 'position'} destroyOnClose>
      <Positions
        showAll
        single
        ids={[{ name: value.title, id: value.key }]}
        onClose={() => setVisible(false)}
        onSuccess={(value = []) => {
          const positions = value[0] || {};
          onChange({ title: positions.name, key: positions.id });
          setVisible(false);
        }} />
    </Popup>
  </>;
};

export default AllCondition;
