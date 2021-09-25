import React from 'react';
import { Button, Preview, PreviewItem } from 'weui-react-v2';


const User = () => {

  return (
    <Preview align="left">
      <PreviewItem title="程彦祺"> <Button type="primary">主按钮</Button></PreviewItem>
      <PreviewItem title="年龄"><div>666</div></PreviewItem>
      <PreviewItem title="喜好"><div>很长很长的名字很长很长的名字很长很长的名字很长很长的名字很长很长的名字</div></PreviewItem>
    </Preview>
  );
};

export default User;
