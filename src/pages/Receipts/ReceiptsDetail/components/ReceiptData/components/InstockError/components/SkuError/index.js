import React, { useEffect, useRef, useState } from 'react';
import style from '../../../InstockOrder/components/Error/index.less';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { Button, Space, TextArea } from 'antd-mobile';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import { useRequest } from '../../../../../../../../../util/Request';
import { instockErrorDetail } from '../../../InstockOrder/components/Error';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import LinkButton from '../../../../../../../../components/LinkButton';
import CheckUser from '../../../../../../../../components/CheckUser';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Message } from '../../../../../../../../components/Message';
import { useModel } from 'umi';
import BottomButton from '../../../../../../../../components/BottomButton';
import { FormOutlined } from '@ant-design/icons';
import MyCard from '../../../../../../../../components/MyCard';
import Header from './components/Header';
import Label from '../../../../../../../../components/Label';

export const save = { url: '/anomaly/dealWithError', method: 'POST' };
export const edit = { url: '/anomalyDetail/edit', method: 'POST' };

const SkuError = (
  {
    permissions,
    onClose = () => {
    },
    anomalyOrderId,
    anomalyId,
    height = '100%',
    onSuccess = () => {
    },
    forward,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = ToolUtil.isObject(initialState).userInfo || {};

  const [sku, setSku] = useState({});

  const [errorItems, setErrorItems] = useState([]);

  const inStockNumber = sku.checkNumber - sku.needNumber;

  const [inStockCustomers, setInStockCustomers] = useState([]);

  let inStockCustomersNumber = 0;
  inStockCustomers.forEach(item => inStockCustomersNumber += item.number);

  const [over, setOver] = useState();

  const handle = (errorItems.filter(item => item.status !== 0).length === errorItems.length) && sku.confirm;

  const userRef = useRef();

  const itemChange = (currentIindex, data) => {
    const newItems = errorItems.map((item, index) => {
      if (currentIindex === index) {
        return { ...item, ...data };
      }
      return item;
    });
    setErrorItems(newItems);
  };

  const { loading: detailLoading, run: detailRun, refresh } = useRequest(instockErrorDetail, {
    manual: true,
    onSuccess: (res) => {

      const checkUsers = res.checkNumbers || [];

      const details = ToolUtil.isArray(res.details);

      let termination = 0;
      details.map(item => {
        if (item.stauts === -1) {
          termination += item.number;
        }
        return null;
      });

      let confirm = false;
      let hidden = false;

      if (res.needNumber === res.realNumber) {
        confirm = true;
        hidden = true;
      }
      if (!confirm && checkUsers.length > 0) {
        if (ToolUtil.isObject(checkUsers[checkUsers.length - 1]).number === (ToolUtil.isObject(checkUsers[checkUsers.length - 2]).number || res.realNumber)) {
          confirm = true;
          hidden = true;
        } else if (ToolUtil.isObject(checkUsers[checkUsers.length - 1]).userId === userInfo.id) {
          // hidden = true;
        }
      }

      let checkNum = res.realNumber;
      checkUsers.map((item, index) => {
        if (index === checkUsers.length - 1) {
          checkNum = item.number;
        }
        return null;
      });

      const instockNumber = res.instockNumber || (checkNum - termination);
      const allowNumber = checkNum - termination;

      setSku({
        ...res,
        confirm,
        hidden,
        customerNums: res.customerNums,
        allowNumber: allowNumber < 0 ? 0 : allowNumber,
        instockNumber: instockNumber < 0 ? 0 : instockNumber,
        errorNumber: termination,
        checkNumber: checkNum,
        checkUsers: checkUsers,
        realNumber: res.realNumber,
        needNumber: res.needNumber,
        skuResult: res.skuResult,
        customerResult: res.customer,
        user: res.user,
        type: res.type,
        status: res.status,
      });

      setErrorItems(details.map((item) => {
        const imgs = item.reasonImg ? ToolUtil.isArray(JSON.parse(item.reasonImg)) : [];
        return {
          detailId: item.detailId,
          status: item.stauts,
          opinion: item.opinion,
          userId: item.userId,
          userName: ToolUtil.isObject(item.user).name,
          inkindId: item.inkindId,
          description: item.description,
          mediaIds: item.reasonImg,
          number: item.number,
          media: imgs.map((mediaId, index) => {
            return {
              url: ToolUtil.isArray(item.reasonUrls)[index],
              mediaId: mediaId,
              type: 'image',
            };
          }),
          notices: ToolUtil.isArray(item.announcements).map((item) => {
            return item.content;
          }),
        };
      }));
    },
  });

  const { loading: saveLoading, run: saveRun } = useRequest(save, {
    manual: true,
    onSuccess: () => {
      Message.successToast('保存成功!', () => {
        refresh();
      });
    },
  });

  const { loading: editLoading, run: editRun } = useRequest(edit, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  useEffect(() => {
    if (anomalyId) {
      detailRun({
        data: {
          anomalyId,
        },
      });
    }
    const errors = document.getElementById('errors');

    if (errors) {
      errors.addEventListener('scroll', (event) => {
        const scrollTop = event.target.scrollTop;
        if (scrollTop > 90) {
          setOver(true);
        } else {
          setOver(false);
        }
      });
    }
  }, []);

  const action = (item, stauts) => {
    editRun({
      data: {
        anomalyOrderId,
        detailId: item.detailId,
        stauts,
        opinion: item.opinion,
      },
    });
  };

  const errorTypeData = (item = {}, index) => {
    switch (sku.type) {
      case 'InstockError':
        return {
          checkNumberTitle: '到货数',
          otherData: [
            ToolUtil.isObject(sku.customerResult).customerName,
            ToolUtil.isObject(sku.brandResult).brandName || '无品牌',
          ],
          showAction: <>
            {item.status === -1 && <span className={style.prohibit}>· 终止入库</span>}
            {item.status === 1 && <span className={style.allow}>· 允许入库</span>}
          </>,
          actions: <>
            <Button color='danger' fill='outline' onClick={() => {
              itemChange(index, { status: -1 });
              action(item, -1);
            }}>终止入库</Button>
            <Button color='primary' fill='outline' onClick={() => {
              action(item, 1);
            }}>允许入库</Button>
          </>,
          bottom: <div style={{ minHeight: 40 }} hidden={forward}>
            <div className={style.bottomAction}>
              <div className={style.action}>
                <div hidden={!sku.errorNumber}>终止入库 × {sku.errorNumber} </div>
                <div
                  className={style.instockNumber}>
                  入库数量：
                  <ShopNumber
                    min={0}
                    show={!permissions}
                    max={sku.allowNumber}
                    value={sku.instockNumber}
                    onChange={(number) => {
                      setSku({ ...sku, instockNumber: number });
                    }} />
                </div>
              </div>

              {permissions && <Button disabled={!handle} color='primary' onClick={() => {
                const param = {
                  data: {
                    anomalyId,
                    instockNumber: sku.instockNumber,
                    status: 90,
                  },
                };
                saveRun(param).then(() => {
                  onSuccess();
                });
              }}>确定</Button>}
            </div>
          </div>,
        };
      case 'StocktakingError':
      case 'timelyInventory':
        return {
          checkNumberTitle: '盘点数',
          otherData: [
            ToolUtil.isObject(sku.brand).brandName || '无品牌',
            ToolUtil.isObject(sku.positionsResult).name,
          ],
          showAction: <>
            {item.status === 3 && <span className={style.allow}>· 继续使用</span>}
            {item.status === 4 && <span className={style.allow}>· 维修</span>}
            {item.status === 2 && <span className={style.prohibit}>· 报损</span>}
          </>,
          actions: <>
            <Button color='primary' fill='outline' onClick={() => {
              action(item, 4);
            }}>维修</Button>
            <Button color='primary' fill='outline' onClick={() => {
              itemChange(index, { status: -1 });
              action(item, 3);
            }}>继续使用</Button>
            <Button color='danger' fill='outline' onClick={() => {
              action(item, 2);
            }}>报损</Button>
          </>,
          bottom: permissions && !forward && <div style={{ minHeight: 60 }}>
            <BottomButton
              disabled={!handle || !(inStockNumber > 0 ? inStockNumber === inStockCustomersNumber : true)}
              only
              onClick={() => {
                const param = {
                  data: {
                    anomalyId,
                    status: 90,
                    customerNums: inStockCustomers.map(item => ({
                      customerId: item.value,
                      customerName: item.label,
                      num: item.number,
                    })),
                  },
                };
                saveRun(param).then(() => {
                  onSuccess();
                });
              }} />
          </div>,
        };
      default:
        return {};
    }
  };

  const errorItemsChange = (data = {}, currentIndex) => {
    const newErrorItems = errorItems.map((item, index) => {
      if (currentIndex === index) {
        return { ...item, ...data };
      }
      return item;
    });
    setErrorItems(newErrorItems);
  };


  return <div className={style.error} style={{ maxHeight: height, margin: forward && 0 }} id='errors'>

    <Header
      permissions={permissions}
      inStockCustomers={setInStockCustomers}
      checkNumberTitle={errorTypeData().checkNumberTitle}
      otherData={errorTypeData().otherData}
      setSku={setSku}
      sku={sku}
      anomalyId={anomalyId}
      onClose={onClose}
      forward={forward}
      over={over}
      loading={saveLoading}
      initialState={initialState}
      saveRun={(params) => {
        setSku({ ...sku, checkUsers: [] });
        saveRun(params);
      }}
      userInfo={userInfo}
    />

    <div className={style.errors}>
      {
        errorItems.map((item, index) => {

          const inkindId = item.inkindId || '';

          const confirm = sku.confirm;

          const handle = !confirm || item.status !== 0 || (item.userId && (item.userId !== userInfo.id));

          if (forward && item.userId !== userInfo.id) {
            return null;
          }

          return <MyCard
            className={style.inKindCard}
            headerClassName={style.headerStyle}
            key={index}
            titleBom={<div className={style.inkind}>
              异常编码
              <div className={style.index}>{index + 1}</div>
              <span>{inkindId.substring(inkindId.length - 6, inkindId.length)}</span>
              <span className={style.inkindNumber}>× {item.number}</span>
              <div hidden={item.status === 0}>
                {errorTypeData(item, index).showAction}
              </div>
            </div>}
            extra={<>
              <Space>
                {
                  (item.userId && (item.userId !== userInfo.id)) ?
                    `已转交：${item.userName}`
                    :
                    (permissions
                      &&
                      item.status !== 0
                      &&
                      <LinkButton style={{ marginLeft: 8 }} onClick={() => {
                        errorItemsChange({ status: 0 }, index);
                      }}>
                        <FormOutlined />
                      </LinkButton>)
                }
              </Space>
            </>}
          >
            <div className={ToolUtil.classNames(style.careful, style.inkindFiled)}>
              <Label className={style.inkindTitle}>原因</Label>：
              {ToolUtil.isArray(item.notices).map((item, index) => {
                return <div key={index} className={style.notices} style={{ margin: index === 0 && 0 }}>
                  {item}
                </div>;
              })}
            </div>
            <div className={ToolUtil.classNames(style.inkindFiled)}>
              <Label className={style.inkindTitle}>描述</Label>：
              {item.description || '无'}
            </div>
            <div hidden={ToolUtil.isArray(item.media).length === 0} className={ToolUtil.classNames(style.inkindFiled)}>
              <UploadFile
                show
                value={item.media}
                imgSize={36}
              />
            </div>
            <div className={ToolUtil.classNames(style.opinion, style.inkindFiled)}>
              <Label className={style.inkindTitle}>意见</Label>：
              {!handle ? <TextArea
                className={style.textArea}
                rows={1}
                placeholder='请填写处理意见'
                value={item.opinion}
                onChange={(opinion) => {
                  itemChange(index, { opinion });
                }}
              /> : (item.opinion || '无')}
            </div>

            <div hidden={handle || !permissions} className={style.actions}>
              <div className={style.actionButton}>{errorTypeData(item, index).actions}</div>
              {confirm && (item.status === 0 || item.userId === userInfo.id) && <LinkButton onClick={() => {
                if (item.userId) {
                  return;
                }
                userRef.current.open({ detailId: item.detailId });
              }}>
                {item.userId ? `已转交：${item.userName}` : '转交处理'}
              </LinkButton>}
            </div>
          </MyCard>;
        })
      }
    </div>

    <CheckUser hiddenCurrentUser ref={userRef} onChange={(users, param) => {
      const user = users[0] || {};
      editRun({
        data: {
          anomalyOrderId,
          detailId: param.detailId,
          userId: user.id,
          stauts: 0,
        },
      });
    }} />

    {errorTypeData().bottom}

    {(saveLoading || detailLoading || editLoading) && <MyLoading />}

  </div>;
};

export default SkuError;
