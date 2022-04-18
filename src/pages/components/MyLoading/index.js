import { Dialog, DotLoading } from 'antd-mobile';

export const MyLoading = ({ title }) => {

  return <Dialog
    visible
    style={{zIndex:10001}}
    content={<div style={{textAlign:'center'}}>{title || '拼命加载中'}<DotLoading /></div>}
  />;
};
