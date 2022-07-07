import React, { useEffect, useRef, useState } from 'react';
import style from '../../../InstockOrder/components/Error/index.less';
import { CloseOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { Button, TextArea } from 'antd-mobile';
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
import { SkuResultSkuJsons } from '../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import { FormOutlined } from '@ant-design/icons';
import MyCard from '../../../../../../../../components/MyCard';

export const save = { url: '/anomaly/dealWithError', method: 'POST' };
export const edit = { url: '/anomalyDetail/edit', method: 'POST' };

const SkuError = (
  {
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

      const checkUsers = res.checkNumber ? JSON.parse(res.checkNumber) : [];

      const details = ToolUtil.isArray(res.details);

      let errorNumber = 0;
      let termination = 0;
      details.map(item => {
        errorNumber += item.number;
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
        confirm,
        hidden,
        allowNumber: allowNumber < 0 ? 0 : allowNumber,
        instockNumber: instockNumber < 0 ? 0 : instockNumber,
        errorNumber: termination,
        checkNumber: checkNum,
        checkUsers: checkUsers,
        realNumber: res.realNumber,
        needNumber: res.needNumber,
        skuResult: res.skuSimpleResult,
        customerResult: res.customer,
        user: res.user,
        type: res.type,
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
    onError: () => {

    },
  });

  const { loading: saveLoading, run: saveRun } = useRequest(save, {
    manual: true,
    onSuccess: () => {
      Message.successToast('保存成功!', () => {
        refresh();
      });
    },
    onError: () => {
      Message.errorToast('保存失败！');
    },
  });

  const { loading: editLoading, run: editRun } = useRequest(edit, {
    manual: true,
    onSuccess: () => {
      Message.successToast('操作成功!', () => {
        refresh();
      });

    },
    onError: () => {
      Message.errorToast('操作失败！', () => {
        refresh();
      });
    },
  });


  const skuResult = sku.skuResult || {};
  const spuResult = skuResult.spuResult || {};
  const unitName = ToolUtil.isObject(spuResult.unitResult).unitName;

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

  const checkUsers = ToolUtil.isArray(sku.checkUsers);

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
          showAction: <>
            {item.status === -1 && <span className={style.prohibit}>· 禁止入库</span>}
            {item.status === 1 && <span className={style.allow}>· 允许入库</span>}
          </>,
          actions: <>
            <Button color='danger' fill='outline' onClick={() => {
              itemChange(index, { status: -1 });
              action(item, -1);
            }}>终止入库</Button>
            <Button className={style.ok} color='primary' fill='outline' onClick={() => {
              action(item, 1);
            }}>允许入库</Button>
          </>,
          bottom: <div className={style.bottomAction} hidden={forward}>
            <div className={style.action}>
              <div>终止入库数量：{sku.errorNumber} </div>
              <div
                className={style.instockNumber}>
                入库数量：
                <ShopNumber
                  min={0}
                  max={sku.allowNumber}
                  value={sku.instockNumber}
                  onChange={(number) => {
                    setSku({ ...sku, instockNumber: number });
                  }} />
              </div>
            </div>

            <Button disabled={!handle} color='primary' onClick={() => {
              const param = {
                data: {
                  anomalyId,
                  instockNumber: sku.instockNumber,
                },
              };
              saveRun(param).then(() => {
                onSuccess();
              });
            }}>确定</Button>
          </div>,
        };
      case 'StocktakingError':
        return {
          showAction: <>
            {item.status === -1 && <span className={style.allow}>· 维修</span>}
            {item.status === 1 && <span className={style.prohibit}>· 忽略异常</span>}
            {item.status === 2 && <span className={style.allow}>· 报损</span>}
          </>,
          actions: <>
            <Button className={style.ok} color='primary' fill='outline' onClick={() => {
              action(item, 1);
            }}>维修</Button>
            <Button color='danger' fill='outline' onClick={() => {
              itemChange(index, { status: -1 });
              action(item, -1);
            }}>忽略异常</Button>
            <Button className={style.ok} color='primary' fill='outline' onClick={() => {
              action(item, 2);
            }}>报损</Button>
          </>,
          bottom: !forward && <BottomButton disabled={!handle} only onClick={() => {
            const param = { data: { anomalyId } };
            saveRun(param).then(() => {
              onSuccess();
            });
          }} />,
        };
      default:
        return {};
    }
  };

  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  return <div className={style.error} style={{ maxHeight: height, margin: forward && 0 }} id='errors'>

    <MyCard noHeader className={style.cardStyle} bodyClassName={style.bodyStyle}>
      <div className={style.header} hidden={forward}>

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

      <div className={style.skuItem} style={{ border: 'none' }}>
        <SkuItem
          skuResult={sku.skuResult}
          className={style.sku}
          extraWidth='64px'
          otherData={[
            ToolUtil.isObject(sku.customerResult).customerName,
            ToolUtil.isObject(sku.brandResult).brandName || '无品牌',
          ]}
        />
        <div className={style.showNumber}>
          <span className={style.through}
                hidden={(sku.confirm ? sku.checkNumber : sku.realNumber) === sku.needNumber}>× {sku.needNumber}</span>
          <span>× {sku.confirm ? sku.checkNumber : sku.realNumber}</span>
        </div>
      </div>

      <div className={style.verify} hidden={forward}>
        <span>到货数：<ShopNumber show
                              value={sku.realNumber} /> {unitName} ({ToolUtil.isObject(sku.user).name || '-'})</span>
        {
          checkUsers.map((item, index) => {
            if (index < checkUsers.length - 2) {
              return null;
            }
            return <span key={index}>复核数：
            <ShopNumber show value={item.number} /> {unitName} ({item.name || ''})
          </span>;
          })
        }
        <div hidden={sku.hidden} className={style.checkNumber}>
        <span>复核数：<ShopNumber value={sku.checkNumber} onChange={(checkNumber) => {
          setSku({ ...sku, checkNumber });
        }} /> {unitName}</span>
          <Button color='primary' fill='outline' onClick={() => {
            const param = {
              data: {
                anomalyId,
                checkNumber: JSON.stringify([...checkUsers, {
                  number: sku.checkNumber,
                  name: userInfo.name,
                  userId: userInfo.id,
                }]),
              },
            };

            saveRun(param);
          }}>确认</Button>
        </div>

      </div>
    </MyCard>

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
            key={index}
            titleBom={<div className={style.inkind}>
              <div className={style.index}>{index + 1}</div>
              <span>{inkindId.substring(inkindId.length - 6, inkindId.length)}</span>
              <span className={style.inkindNumber}>× {item.number}</span>
              <div hidden={item.status === 0}>
                {errorTypeData(item, index).showAction}
              </div>
            </div>}
            extra={<>
              {confirm && (item.status === 0 || item.userId === userInfo.id) && <LinkButton onClick={() => {
                if (item.userId) {
                  return;
                }
                userRef.current.open({ detailId: item.detailId });
              }}>
                {item.userId ? `已转交：${item.userName}` : '转交处理'}
              </LinkButton>}
              {item.status !== 0 && <LinkButton style={{ marginLeft: 8 }} onClick={() => {
                action(item, 0);
              }}>
                <FormOutlined />
              </LinkButton>}
            </>}
          >
            <div className={style.careful} style={{ padding: '12px 0' }}>
              异常原因：{ToolUtil.isArray(item.notices).map((item, index) => {
              return <div key={index} className={style.notices}>
                {item}
              </div>;
            })}
            </div>
            <div style={{ padding: '8px 0' }}>
              异常描述：{item.description || '无'}
            </div>
            <div>
              <UploadFile
                show
                value={item.media}
                imgSize={36}
              />
            </div>
            <div className={style.opinion}>
              <span>处理意见：</span>
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

            <div hidden={handle} className={style.actions}>
              {errorTypeData(item, index).actions}
            </div>
          </MyCard>;
        })
      }
    </div>

    <CheckUser ref={userRef} onChange={(id, name, param) => {
      editRun({
        data: {
          anomalyOrderId,
          detailId: param.detailId,
          userId: id,
        },
      });
    }} />

    {errorTypeData().bottom}

    {(saveLoading || detailLoading || editLoading) && <MyLoading />}

  </div>;
};

export default SkuError;
