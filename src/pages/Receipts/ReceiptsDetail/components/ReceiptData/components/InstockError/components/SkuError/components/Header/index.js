import React, { useEffect, useRef, useState } from 'react';
import style from '../../../../../InstockOrder/components/Error/index.less';
import { SkuResultSkuJsons } from '../../../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import { AddCircleOutline, CloseOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { PaperClipOutlined } from '@ant-design/icons';
import UploadFile from '../../../../../../../../../../components/Upload/UploadFile';
import { Button, Space, TextArea } from 'antd-mobile';
import Label from '../../../../../../../../../../components/Label';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { supplierBySku } from '../../../../../../../../../../Work/Customer/CustomerUrl';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import MyPicker from '../../../../../../../../../../components/MyPicker';
import MyCard from '../../../../../../../../../../components/MyCard';
import LinkButton from '../../../../../../../../../../components/LinkButton';
import { Message } from '../../../../../../../../../../components/Message';
import MyRemoveButton from '../../../../../../../../../../components/MyRemoveButton';

const Header = (
  {
    errors = [],
    type,
    forward,
    over,
    initialState,
    onClose = () => {
    },
    sku,
    setSku = () => {
    },
    saveRun = () => {
    },
    anomalyId,
    userInfo,
    loading,
    otherData,
    checkNumberTitle,
    inStockCustomers = () => {
    },
    permissions,
  },
) => {

  const [mediaIds, setMediaIds] = useState([]);
  const [note, setNote] = useState();

  const inStockNumber = sku.checkNumber - sku.needNumber;

  const skuResult = sku.skuResult || {};
  const spuResult = skuResult.spuResult || {};
  const unitName = ToolUtil.isObject(spuResult.unitResult).unitName;

  const checkUsers = ToolUtil.isArray(sku.checkUsers);

  const addFileRef = useRef();

  const state = initialState || {};
  const imgUrl = ToolUtil.isArray(skuResult.imgThumbUrls || skuResult.imgUrls)[0];

  const [customers, setCustomers] = useState([]);

  const noCheckCustomers = customers.filter(item => !item.checked);
  const checkCustomers = customers.filter(item => item.checked);

  const [visible, setVisible] = useState();

  const {
    loading: getCustomerLoading,
    run: getCustomer,
  } = useRequest(supplierBySku, {
    manual: true,
    onSuccess: (res) => {
      const customer = res || [];
      const newCustomers = customer.map(item => {
        const customerNums = sku.customerNums || [];
        const customerNum = customerNums.filter(numItem => numItem.customerId === item.customerId)[0] || {};
        return {
          value: customerNum.customerId || item.customerId,
          label: customerNum.customerName || item.customerName,
          checked: customer.length === 1 || Boolean(customerNum.customerId),
          number: customer.length === 1 ? 11 : (customerNum.num || 0),
        };
      });
      setCustomers(newCustomers);
      inStockCustomers(newCustomers.filter(item => item.checked && item.number > 0));
    },
  });

  useEffect(() => {
    if (sku.skuId && sku.confirm && inStockNumber > 0) {
      getCustomer({ data: { skuId: sku.skuId } });
    }
  }, [sku.skuId, sku.confirm]);

  const customersChange = (id, data = {}) => {
    const newCustomer = customers.map(item => {
      if (item.value === id) {
        return { ...item, ...data };
      }
      return item;
    });
    setCustomers(newCustomer);
    inStockCustomers(newCustomer.filter(item => item.checked && item.number > 0));
  };

  return <>
    <div className={style.header} hidden={forward} style={over ? { boxShadow: '0 1px 5px 0 rgb(0 0 0 / 30%)' } : {}}>

      {
        over ?
          <div className={style.skuShow}>
            <img src={imgUrl || state.imgLogo} width={30} height={30} alt='' />
            <div>
              <div className={style.smallSku} style={{ maxWidth: 210 }}>
                {SkuResultSkuJsons({ skuResult, spu: true })}
              </div>
              <div className={style.smallSku} style={{ maxWidth: 210 }}>
                {SkuResultSkuJsons({ skuResult, sku: true })}
              </div>
            </div>
          </div>
          :
          <div className={style.title}>异常处理</div>
      }
      <span onClick={() => {
        onClose();
      }}><CloseOutline /></span>
    </div>

    <div className={style.errorActionHeader}>
      <div className={style.skuItem} style={{ border: 'none' }}>
        <SkuItem
          skuResult={sku.skuResult}
          number={sku.needNumber}
          className={style.sku}
          extraWidth='64px'
          otherData={otherData}
        />
        <div className={style.showNumber}>
          <span
            className={style.through}
            hidden={(sku.confirm ? sku.checkNumber : sku.realNumber) === sku.needNumber}>× {sku.needNumber}
          </span>
          <span>× {sku.confirm ? sku.checkNumber : sku.realNumber}</span>
        </div>
      </div>
      <div className={style.verify} hidden={forward}>
        <div className={style.checkNumber}>
          <Label className={style.title}>{checkNumberTitle}：</Label>
          <ShopNumber show value={sku.realNumber} /> {unitName}
          <div style={{ padding: '0 8px' }}>({ToolUtil.isObject(sku.user).name || '-'})</div>
        </div>

        {checkUsers.map((item, index) => {
          const urls = ToolUtil.isArray(item && item.mediaUrls);
          return <div key={index} className={style.checkUser}>
            <div className={style.checkNumber}>
              <Label className={style.title}>复核数</Label>：
              <ShopNumber show value={item.number} /> {unitName}
              <div style={{ padding: '0 8px' }}>({item.name || ''})</div>
            </div>
            <div className={style.checkNumber} style={{ display: 'block' }}>
              <Label className={style.title}>附件 </Label>：{urls.length === 0 && '无'}
              <div hidden={urls.length === 0} style={{ paddingTop: 4 }}>
                <UploadFile refresh={loading} show value={urls.map(item => {
                  return { url: item };
                })} />
              </div>
            </div>
            <div className={style.checkNumber}>
              <Label className={style.title}>备注说明</Label>：{item.note || '无'}
            </div>
          </div>;
        })}

        <div hidden={sku.hidden} className={style.verifyAction}>
          <div className={style.checkNumber}>
            <Label className={style.title}>复核数</Label>：
            <Space align='center'>
              <ShopNumber
                min={1}
                value={sku.checkNumber}
                onChange={(checkNumber) => {
                  if (checkNumber < errors.length) {
                    Message.toast('不能小于异常数量！');
                    return;
                  }
                  setSku({ ...sku, checkNumber });
                }} />
              {unitName}
            </Space>
          </div>
          <div className={style.checkNumber}>
            <Label className={style.title}>上传附件</Label>：
            <div>
              <PaperClipOutlined onClick={() => {
                addFileRef.current.addFile();
              }} />
            </div>
          </div>
          <div hidden={mediaIds.length === 0}>
            {!loading && <UploadFile
              uploadId='verifyImg'
              noAddButton
              ref={addFileRef}
              onChange={(mediaIds) => {
                setMediaIds(mediaIds);
              }}
            />}
          </div>
          <div className={style.checkNumber}>
            <Label className={style.title}>添加备注</Label>：
            <TextArea
              rows={1}
              value={note}
              className={style.textArea}
              placeholder=''
              onChange={(value) => {
                setNote(value);
              }}
            />
          </div>
          <div className={style.checkNumber}>
            <div className={style.title} />
            <Button color='primary' fill='outline' onClick={() => {
              const param = {
                data: {
                  anomalyId,
                  checkNumber: JSON.stringify([...checkUsers, {
                    number: sku.checkNumber,
                    name: userInfo.name,
                    userId: userInfo.id,
                    mediaIds,
                    note,
                  }]),
                },
              };
              setMediaIds([]);
              setNote('');
              saveRun(param);
            }}>确认</Button>
          </div>
        </div>
      </div>
    </div>

    <MyCard
      title='盘盈物所属料供应商'
      hidden={type === 'InstockError' || forward || !sku.confirm || inStockNumber <= 0}
      className={style.customerList}
      extra={permissions && customers.length > 1 && <LinkButton
        disabled={noCheckCustomers.length === 0}
        onClick={() => setVisible(true)}
      >
        <AddCircleOutline />
      </LinkButton>}
    >
      {
        checkCustomers.map((item, index) => {
          return <div key={index} className={style.customer}>
            <div className={style.name}>{item.label}</div>
            <ShopNumber show={!permissions} value={item.number} onChange={(number) => {
              let total = 0;
              checkCustomers.forEach(customerItem => {
                if (customerItem.value === item.value) {
                  total += number;
                } else {
                  total += (customerItem.number || 0);
                }
              });
              if (total > inStockNumber) {
                Message.toast('不能超过入库数量！');
                return;
              }
              customersChange(item.value, { number });
            }} />
            {permissions && customers.length > 1 && <MyRemoveButton style={{ marginLeft: 8 }} onRemove={() => {
              customersChange(item.value, { checked: false });
            }} />}
          </div>;
        })
      }
    </MyCard>


    <MyPicker
      visible={visible}
      options={noCheckCustomers}
      onClose={() => setVisible(false)}
      onChange={(customer) => {
        let number = 0;
        checkCustomers.forEach(item => number += (item.number || 0));
        customersChange(customer.value, {
          checked: true,
          number: inStockNumber - number,
        });
      }}
    />

    {getCustomerLoading && <MyLoading />}
  </>;
};

export default Header;
