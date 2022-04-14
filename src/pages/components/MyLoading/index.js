import { Dialog, DotLoading } from 'antd-mobile';

export const MyLoading = ({ title }) => {

  return <Dialog
    style={{zIndex:9999}}
    visible
    content={<div style={{textAlign:'center'}}>{title || '拼命加载中'}<DotLoading /></div>}
  />;
};
