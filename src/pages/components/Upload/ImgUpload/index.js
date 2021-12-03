import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { MultiUpload } from 'weui-react-v2';
import { useBoolean } from 'ahooks';
import { Loading } from 'antd-mobile';

const ImgUpload = ({ value = [], onChange, disabled, loading }) => {

  const [oss, setOss] = useState({}); // OSS上传所需参数

  const [state, { setTrue,setFalse }] = useBoolean();

  const getSTSToken = {
    url: '/media/getToken', // 获取OSS凭证接口
    data: {},
  };

  // 获取OSS配置
  const { run: getOssObj } = useRequest(getSTSToken, {
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
        oss.mediaId = res.data.mediaId;
        setOss({ ...oss });
        typeof onChange === 'function' && onChange([...value, {
          url: `${oss.host}/${oss.key}`,
          id: res.data.mediaId,
        }]);
      }
    },
  });

  const beforUpLoad = (imgType) => {
    return new Promise((resolve) => {
      getOssObj({ params: { type: imgType } }).then(res => {
        resolve();
      });
    });
  };

  useEffect(()=>{
    setTrue();
    setTimeout(()=>{
      setFalse();
    },100);
  },[loading, setFalse, setTrue])

  if (state){
    return <Loading />
  }

  return <MultiUpload
    value={value && value.map((items)=>{
      return items.url;
    })}
    disabled={disabled}
    length={3}
    action='https://gpkx.oss-cn-beijing.aliyuncs.com'
    // action={oss.host}
    data={oss}
    beforeUpload={(file) => {
      return beforUpLoad(file.type.split('/')[1]);
    }}
    onImageRemove={(remove) => {
      const removeImg = value;
      removeImg.splice(remove, 1);
      typeof onChange === 'function' && onChange(removeImg);
    }}
  />;
};

export default ImgUpload;
