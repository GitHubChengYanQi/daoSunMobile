import React from 'react';
import { request } from '../../../util/Request';
import { Dialog, Toast } from 'antd-mobile';
import wx from 'populee-weixin-js-sdk';
import LinkButton from '../../components/LinkButton';
import { ScanOutlined } from '@ant-design/icons';

const testCodeId = '1468041636521299970';

const ScanCodeBind = (
  {
    batchComplete,
    complete,
    bind,
    items,
    onBind,// 绑定成功
    onCodeId, // 已经绑定
  }) => {

  // 判断二维码状态
  const code = async (codeId, items) => {

    const isBind = await request(
      {
        url: '/orCode/isNotBind',
        method: 'POST',
        data: {
          codeId: codeId,
        },
      },
    );
    // 判断是否是未绑定过的码
    if (isBind) {
      //如果已绑定
      typeof onCodeId === 'function' && onCodeId(codeId);
    } else {
      //如果未绑定，提示用户绑定
      if (complete){
        Toast.show({
          content:'已经全部质检完成！，不能继续绑定空码啦！'
        });
      }else {
        if (!bind){
          codeBind(codeId, items);
        }else {
          Toast.show({
            content:'该物料已绑定！',
          });
        }
      }

    }
  };

  // 开启扫码
  const scan = async (items) => {
    if (items) {
      if (process.env.NODE_ENV === 'development') {
        code(testCodeId, items);
      } else {
        await wx.ready(async () => {
          await wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
            success: (res) => {
              if (res.resultStr.indexOf('https') !== -1) {
                const param = res.resultStr.split('=');
                if (param && param[1]) {
                  code(param[1], items);
                }
              } else {
                code(res.resultStr, items);
              }
            },
            error: (res) => {
              alert(res);
              if (res.errMsg.indexOf('function_not_exist') > 0) {
                // alert('版本过低请升级');
              }
            },
          });
        });
      }
    }
  };

  // 绑定二维码
  const codeBind = (codeId, items) => {
    Dialog.show({
      content: `是否绑定此二维码？`,
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {

          await request({
            url: '/orCode/backCode',
            method: 'POST',
            data: {
              codeId: codeId,
              source: 'item',
              ...items,
              id: items.skuId,
              number: 1,
              inkindType: '质检',
            },
          }).then(async (res) => {
            if (typeof res === 'string') {

              typeof onBind === 'function' && onBind(res);

              Toast.show({
                content: '绑定成功！',
              });
            }
          });

        }

      },
      actions: [
        [
          {
            key: 'ok',
            text: '是',
          },
          {
            key: 'no',
            text: '否',
          },
        ],
      ],
    });
  };

  return <LinkButton onClick={() => {
    if (batchComplete){
      Toast.show({
        content:'该物料已经全部质检完成！'
      });
    }else {
      scan(items);
    }
  }} title={<ScanOutlined />} />;


};

export default ScanCodeBind;
