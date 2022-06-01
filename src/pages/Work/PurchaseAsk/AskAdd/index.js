import React, { useRef } from 'react';
import { Button, Form, Space, TextArea, Toast } from 'antd-mobile';
import MyCoding from '../../../components/MyCoding';
import MyAntPicker from '../../../components/MyAntPicker';
import AddSku from '../components/AddSku';
import MyNavBar from '../../../components/MyNavBar';
import Process from '../components/Process';
import { useRequest } from '../../../../util/Request';
import { purchaseAskAdd } from '../components/Url';
import { history } from 'umi';
import MyBottom from '../../../components/MyBottom';
import { MyLoading } from '../../../components/MyLoading';

const AskAdd = () => {

  const { loading, run } = useRequest(purchaseAskAdd,
    {
      manual: true,
      onSuccess: () => {
        Toast.show({
          content: '申请成功！',
          position: 'bottom',
        });
        history.push('/Work/PurchaseAsk');
      },
    });

  const ref = useRef();

  return <>
    <MyNavBar title='创建采购申请' />
    <MyBottom
      buttons={<Space>
        <Button
          loading={loading}
          color='primary'
          onClick={() => {
            ref.current.submit();
          }}>提交申请</Button>
      </Space>}
    >
      <Form
        ref={ref}
        onFinish={(value) => {

          if (!value.purchaseListings || value.purchaseListings.length === 0) {
            return Toast.show({
              content: '物料、申请数量为必填项！',
              position: 'bottom',
            });
          }

          const required = value.purchaseListings.filter((items) => {
            return !items.skuId || !items.applyNumber;
          });

          const skuBrands = value.purchaseListings.map((items) => {
            return `${items.skuId}${items.brandId}`;
          });

          const sname = skuBrands.filter((item) => {
            const array = skuBrands.filter((value) => {
              return value === item;
            });
            return array.length > 1;
          });

          if (required.length > 0) {
            Toast.show({
              content: '物料、申请数量为必填项！',
              position: 'bottom',
            });
            return false;
          } else if (sname.length > 0) {
            Toast.show({
              content: '物料和品牌不能重复！',
              position: 'bottom',
            });
            return false;
          } else {
            return run({
              data: value,
            });
          }

        }}
      >
        <Form.Item
          name='coding'
          label='采购编码'
          rules={[{ required: true, message: '编码不能为空' }]}
        >
          <MyCoding module={5} />
        </Form.Item>
        <Form.Item
          name='type'
          label='采购类型'
          rules={[{ required: true, message: '类型不能为空' }]}
        >
          <MyAntPicker
            title='请选择采购类型'
            options={[
              {
                value: 0,
                label: '生产采购',
              },
              {
                value: 1,
                label: '库存采购',
              },
              {
                value: 2,
                label: '行政采购',
              },
              {
                value: 3,
                label: '销售采购',
              },
              {
                value: 4,
                label: '紧急采购',
              },
            ]} />
        </Form.Item>

        <Form.Item
          name='purchaseListings'
          label='采购清单'
        >
          <AddSku />
        </Form.Item>

        <Form.Item
          name='note'
          label='备注'
        >
          <TextArea placeholder='请输入备注' />
        </Form.Item>

      </Form>

      <Process type='purchaseAsk' />

      {loading && <MyLoading />}

    </MyBottom>
  </>;
};

export default AskAdd;
