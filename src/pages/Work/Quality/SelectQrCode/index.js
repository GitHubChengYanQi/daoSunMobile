import React, { useRef } from 'react';
import { Card, List, SearchBar } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import { Spin } from 'antd';
import { history } from 'umi';
import LinkButton from '../../../components/LinkButton';
import MyEmpty from '../../../components/MyEmpty';
import GoToQualityTask from '../GoToQualityTask';

const SelectQrCode = (props) => {

  const state = props.location.state;
  const codeIds = state && state.qrCodeIds;

  const ref = useRef();

  const { loading, data, run } = useRequest({
    url: '/orCode/list?limit=10',
    method: 'POST',
  });

  if (!codeIds) {
    return <MyEmpty />;
  }
  return <Card title='查找二维码' extra={<LinkButton title='返回' onClick={() => history.goBack()} />}>
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
        <div style={{ textAlign: 'center', padding: 16 }}>
          <Spin />
        </div>
        :
        (data
          &&
          <List>
            {
              data.map((items, index) => {
                if (codeIds && codeIds.includes(items.orCodeId)) {
                  return <List.Item
                    extar={<LinkButton>点击进入</LinkButton>}
                    key={index}
                    onClick={async () => {
                      ref.current.goToQualityTask(items.orCodeId);
                    }}>{items.orCodeId}</List.Item>;
                } else {
                  return null;
                }

              })
            }
          </List>)}
    <GoToQualityTask ref={ref} />
  </Card>;
};

export default SelectQrCode;
