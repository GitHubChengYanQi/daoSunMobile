import { Dialog, DotLoading } from 'antd-mobile';

export const MyLoading = ({ title }) => {

  return <Dialog
    visible
    content={<div style={{textAlign:'center'}}>{title || 'Loading'}<DotLoading /></div>}
  />;
};
