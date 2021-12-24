import React, { useState } from 'react';
import { Button } from 'weui-react-v2';
import { UploadOutlined } from '@ant-design/icons';
import { Space, Upload } from 'antd';
import { useRequest } from '../../../../util/Request';
import { Toast } from 'antd-mobile';
import { useDebounceEffect } from 'ahooks';

const CustomerUpload = ({ customerId }) => {

  const [oss, setOss] = useState({});

  const [file, setFile] = useState();


  const { run } = useRequest({
    url: '/media/getToken',
    method: 'GET',
  }, {
    manual: true,
    formatResult: (e) => {
      return e;
    },
    onSuccess: (res) => {
      if (res.errCode === 0) {
        oss.key = res.data.key;
        oss.host = res.data.host;
        oss.policy = res.data.policy;
        oss.Signature = res.data.Signature;
        oss.mediaId = res.data.mediaId;
        oss.OSSAccessKeyId = res.data.OSSAccessKeyId;
        setOss({ ...oss });
      }
    },
  });
  const { run: runFile } = useRequest({
    url: '/customerFile/add',
    method: 'POST',
  }, { manual: true });
  const { run: runDeleteFile } = useRequest({
    url: '/customerFile/delete',
    method: 'POST',
  }, { manual: true });
  const { run: runListFile, refresh } = useRequest({
    url: '/customerFile/list?',
    method: 'POST',
    data: { customerId: customerId },
  }, {
    manual: true, onSuccess: async (res) => {
      const fileList = await res && res.data ? res.data.map((items, index) => {
        return {
          uid: items.uid,
          name: items.name,
          url: items.url,
        };
      }) : [];
      setFile(fileList);
    },
  });

  useDebounceEffect(() => {
    runListFile({
      params: {
        limit: 20,
        page: 1,
      },
    });
  }, [], {
    wait: 0,
  });


  return (
    <Space direction='vertical' style={{ width: '100%' }} size='large'>
      <Upload
        style={{ width: '100%' }}
        className='avatar-uploader'
        data={oss}
        action={oss.host}
        listType='picture'
        fileList={file}
        beforeUpload={(file) => {
          const type = file.type.split('/')[1];
          if (type) {
            return new Promise((resolve) => {
              run({ params: { type } }).then(res => {
                resolve();
              });
            });
          } else {
            Toast.show({
              content: '附件类型不正确',
              position: 'bottom',
            });
            refresh();
          }
        }}
        onChange={async ({ file, fileList }) => {
          console.log(file.status);
          switch (file.status) {
            case 'done':
              await runFile({
                data: {
                  url: `${oss && oss.host}/${oss && oss.key}`,
                  customerId,
                  uid: file.uid,
                  name: file.name,
                },
              });
              refresh();
              break;
            case 'uploading':
              break;
            case 'error':
              refresh();
              break;
            case 'removed':
              await runDeleteFile({
                data: {
                  uid: file.uid,
                },
              });
              await refresh();
              break;
            default:
              break;
          }
          setFile(fileList);
        }}
      >
        <Button icon={<UploadOutlined />}>上传附件</Button>
      </Upload>
    </Space>
  );
};

export default CustomerUpload;
