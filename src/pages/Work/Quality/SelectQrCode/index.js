import React from 'react';
import { List, SearchBar } from 'antd-mobile';
import { request, useRequest } from '../../../../util/Request';
import { Spin } from 'antd';
import { history } from 'umi';

const SelectQrCode = (props) => {

  const state = props.location.state;
  const codeIds = state && state.qrCodeIds;

  const { loading, data, run } = useRequest({
    url: '/orCode/list?limit=10',
    method: 'POST',
  }, {
    manual: true,
  });

  const inkindType = (codeId, data) => {
    switch (data.source) {
      case '质检':
        history.push({
          pathname: '/Work/Quality/QualityTask',
          state: {
            items: {
              ...data.taskDetail,
              skuResult: data.skuResult,
              brand: data.brand,
            },
            codeId,
          },
        });
        break;
      default:
        break;
    }
  };

  const codeType = (codeId, res) => {
    switch (res.type) {
      case 'item':
        inkindType(codeId, res.inkindResult);
        break;
      case 'instock':
      case 'outstock':
      case 'storehousePositions':
      case 'spu':
      case 'storehouse':
      case 'stock':
        history.push(`/OrCode?id=${codeId}`);
        break;
      default:
        break;
    }
  };

  return <>
    <SearchBar
      placeholder='请输入二维码'
      showCancelButton
      style={{
        '--border-radius': '100px',
        '--background': '#ffffff',
      }}
      onChange={(value) => {
        if (value) {
          run({
            data: {
              orCodeId: value,
            },
          });
        }
      }}
    />
    {
      loading
        ?
        <div style={{textAlign:'center',padding:16}}>
          <Spin />
        </div>
        :
        (data
          &&
          <List>
            {
              data.map((items, index) => {
                const ids = codeIds && codeIds.filter((value) => {
                  return items.orCodeId === value;
                });
                if (ids && ids.length > 0) {
                  return <List.Item
                    // extra={codeTypeName(items.type)}
                    key={index}
                    onClick={async () => {
                      const res = await request({
                        url: '/orCode/backObject',
                        method: 'GET',
                        params: {
                          id: items.orCodeId,
                        },
                      });
                      codeType(items.orCodeId, res);
                    }}>{items.orCodeId}</List.Item>;
                } else {
                  return null;
                }

              })
            }
          </List>)}
  </>;
};

export default SelectQrCode;
