
import { useRequest } from '../../../../util/Request';
import { Button, Card, Form, Selector, TextArea, Toast } from 'antd-mobile';
import { FormItem } from 'antd-mobile/es/components/form/form-item';
import { Input } from 'weui-react-v2';

import { history } from 'umi';

import MySelector from '../../../components/MySelector';

const DataAdd = () => {




  const { data } = useRequest({
    url: '/items/listSelect',
    method: 'POST',
  });
  const { data:dataClassification }=useRequest({
    url:'/dataClassification/listSelect',
    method: 'POST',
  });
  const { run } = useRequest(
    {
      url: '/data/add', method: 'POST',
    }, {
      manual: true,
      onSuccess: (res) => {
        Toast.show({
          content:"保存成功",
          position: 'bottom',
        })
        history.goBack();
      },
    },
  );

  console.log({dataClassification});
  return (
    <div>
      <Form
        labelWidth="20vw"

        onFinish={(value)=>{
          run(
            {
              data: { ...value },
            },
          );
        }}
      >

        <Card title="添加资料">
          <FormItem label='资料名称' name='name' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='请输入资料名称' />
          </FormItem>
          <FormItem label="资料内容" name='content' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <TextArea placeholder="请填写你所需要的资料内容" />
          </FormItem>
          <FormItem label="产品" name="itemId" rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Selector
              style={{ '--checked-color': '#ffe2e5' }}
              options={data || []}
              multiple={true}
            />
          </FormItem>
          <FormItem label="资料分类" name="dataclassId" rules={[{ required: false, message: '该字段是必填字段！' }]}>
          <MySelector api={dataClassification} />
          </FormItem>
        </Card>
        <div style={{"text-align":'center'}} >

          <div style={{ textAlign: 'center', margin: 8 }}>
            <Button color='primary' type='submit' style={{ width: '20%', marginRight: '5%' }}>保存</Button>
            <Button color='default' style={{ width: '20%', marginRight: '5%' }} onClick={() => {
              history.goBack();
            }}>返回</Button>
          </div>


        </div>
      </Form>

    </div>
  );
};
export default DataAdd;
