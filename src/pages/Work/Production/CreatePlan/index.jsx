import React, { useRef, useState } from 'react';
import { isArray } from '../../../components/ToolUtil';
import MyNavBar from '../../../components/MyNavBar';
import FormLayout from '../../../components/FormLayout';
import { ReceiptsEnums } from '../../../Receipts';
import MyCard from '../../../components/MyCard';
import Title from '../../../components/Title';
import styles from '../../Order/CreateOrder/index.less';
import { Input, Space, TextArea } from 'antd-mobile';
import StartEndDate from '../CreateTask/components/StartEndDate';
import User from '../../CreateTask/components/User';
import ShopNumber from '../../AddShop/components/ShopNumber';
import { useRequest } from '../../../../util/Request';
import { Message } from '../../../components/Message';
import { useHistory, useLocation } from 'react-router-dom';
import CheckSpu from '../../Sku/CheckSpu';
import LinkButton from '../../../components/LinkButton';
import MyPicker from '../../../components/MyPicker';
import { PaperClipOutlined } from '@ant-design/icons';
import UploadFile from '../../../components/Upload/UploadFile';
import PlanDetail from './components/PlanDetail';

export const createProductionPlan = {
  url: '/productionPlan/add',
  method: 'POST',
};


const CreatePlan = () => {

  const history = useHistory();

  const file = useRef();

  const { state = {} } = useLocation();

  const [data, setData] = useState({ type: 'MarketingPresupposition', typeName: '营销预设' });

  const [visible, setVisible] = useState(false);

  const { loading, run } = useRequest(createProductionPlan, { manual: true });

  const [contracts, setContracts] = useState(state.contracts || [{}]);

  const [cardCoding, setCardCoding] = useState({});

  const contractsChange = (data = {}, key) => {
    const newContracts = contracts.map((item, index) => {
      if (index === key) {
        return { ...item, ...data };
      }
      return item;
    });
    if (data.coding && !contracts[key + 1]) {
      setContracts([...newContracts, {}]);
    } else {
      setContracts(newContracts);
    }
  };

  return <>
    <MyNavBar title='创建计划' />
    <FormLayout
      data={{
        ...data,
        cardCoding: cardCoding.fixedCoding && cardCoding.total && cardCoding.startNum,
        orderDetailParams: contracts,
      }}
      loading={loading}
      onSave={async (complete) => {

        const orderDetailParams = [];
        contracts.forEach(contractsItem => {
          const details = contractsItem.details || [];
          details.forEach(item => {
            orderDetailParams.push({
              contractCoding: contractsItem.coding, ...item,
              purchaseNumber: item.purchaseNumber || 1,
            });
          });
        });

        let success;
        await run({
          data: {
            ...data,
            cardCoding,
            executionTime: data.time && data.time[0],
            endTime: data.time && data.time[1],
            orderDetailParams,
          },
        }).then(() => {
          success = true;
          if (complete) {
            Message.successDialog({
              content: '创建计划成功！',
              only: true,
              onConfirm: () => history.goBack(),
            });
          }
        }).catch(() => {
          Message.errorToast('保存失败！');
          success = false;
        });
        return success;
      }}
      formType={ReceiptsEnums.production}
      fieldRender={(item) => {
        const required = item.required;
        let extra;
        let content;
        switch (item.key) {
          case 'coding':
            extra = <Input
              value={data[item.key]}
              className={styles.input}
              placeholder={`请输入${item.filedName}`}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'theme':
            extra = <Input
              value={data[item.key]}
              className={styles.input}
              placeholder={`请输入${item.filedName}`}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'type':
            extra = <div onClick={() => setVisible('type')}>
              {data[item.key] ? data.typeName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'time':
            extra = <StartEndDate
              placeholder=''
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'userId':
            return <User
              noRequired={!required}
              value={data.userId ? [{
                id: data.userId,
                name: data.userName,
                avatar: data.avatar,
              }] : []}
              onChange={(users) => {
                const { id, name, avatar } = users[0] || {};
                setData({ ...data, userId: id, userName: name, avatar });
              }}
              title={item.filedName}
            />;
          case 'remark':
            content = <TextArea
              rows={3}
              autoSize
              style={{ '--font-size': '14px' }}
              placeholder={`请输入${item.filedName}`}
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'files':
            extra = !data[item.key] && <LinkButton onClick={() => {
              file.current.addFile();
            }}>
              <PaperClipOutlined />
            </LinkButton>;
            content = <UploadFile
              file
              uploadId='contractFile'
              ref={file}
              files={data[item.key] ? [{ mediaId: data[item.key], filedName: data.filedName, url: data.filedUrl }] : []}
              onChange={(medias = []) => {
                setData({
                  ...data,
                  [item.key]: medias[0]?.mediaId,
                  filedName: medias[0]?.filedName,
                  filedUrl: medias[0]?.url,
                });
              }} />;
            break;
          case 'cardCoding':
            content = <Space>
              <Input
                value={cardCoding.fixedCoding || ''}
                className={styles.coding}
                placeholder='固定编号'
                onChange={(value) => {
                  setCardCoding({ ...cardCoding, fixedCoding: value });
                }}
              />
              <ShopNumber
                value={cardCoding.total}
                number
                placeholder='流水号位数'
                onChange={(value) => {
                  setCardCoding({ ...cardCoding, total: value });
                }} />
              <ShopNumber
                number
                value={cardCoding.startNum}
                placeholder='起始值'
                onChange={(value) => {
                  setCardCoding({ ...cardCoding, startNum: value });
                }} />
            </Space>;
            break;
          case 'orderDetailParams':
            return <PlanDetail
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
              type={data.type}
              filedName={item.filedName}
              required={required}
            />;
          default:
            break;
        }
        return <MyCard
          titleBom={required && <Title className={styles.title}>{item.filedName}<span>*</span></Title>}
          title={item.filedName}
          extra={extra}
        >
          {content}
        </MyCard>;
      }}
    />

    <CheckSpu
      // open={visible}
      close={() => setVisible(false)}
      onChange={(sku) => {
        const details = isArray(contracts[visible?.index]?.details);
        contractsChange({ details: [...details, sku] }, visible?.index);
        setVisible(false);
      }}
    />

    <MyPicker
      onClose={() => setVisible()}
      visible={visible === 'type'}
      options={[
        { label: '营销预设', value: 'MarketingPresupposition' },
        { label: '合同订单', value: 'ContractOrder' },
      ]}
      onChange={(option) => {
        setData({ ...data, type: option.value, typeName: option.label });
      }}
    />

  </>;
};

export default CreatePlan;
