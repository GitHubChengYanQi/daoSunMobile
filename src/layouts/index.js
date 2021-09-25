import { useState } from 'react';
import { useRequest } from '../util/Request';
import { Flex, FlexItem, SafeArea } from 'weui-react-v2';
import { WechatOutlined } from '@ant-design/icons';
import { Affix, Menu } from 'antd';
import { router } from 'umi';

function BasicLayout(props) {

  let [isNotLogin, setIsNotLogin] = useState(true);

  const { run: refreshToken } = useRequest({
    url: '/login/refreshToken',
    method: 'POST',
  }, {
    manual: true,
  }, false);

  const { error, run } = useRequest({
    url: '/login/miniprogram/code2session',
    method: 'POST',
  }, {
    onError() {
      /**
       * TODO 判断error 存在就显示登录失败的提示
       */
      console.log('登录失败');
      // Taro.hideLoading();
    },
    manual: true,
  });

  const { error: codeError, run: codeRun } = useRequest({
    url: '/login/oauth/wxMp',
    method: 'GET',
  }, {
    manual: true,
  });

  const { error: tokenError, run: tokenRun } = useRequest({
    url: '/login/mp/loginByCode',
    method: 'GET',
  }, {
    manual: true,
    onError: () => {
      // wxLogin();
    },
  });

  return (
    <div>
      <SafeArea style={{minHeight: '100vh', backgroundColor: '#f4f4f4'}}>
      {props.children}
      </SafeArea>
      <Affix offsetBottom={0}>
        <Flex type='flex' style={{backgroundColor:'#fff',cursor:'pointer'}} justify='space-around'>
          <FlexItem>
            <div onClick={()=>{
              router.push('/Home');
            }} style={{ textAlign: 'center', padding: 16 }}><WechatOutlined />
              <div>首页</div>
            </div>
          </FlexItem>
          <FlexItem>
            <div onClick={()=>{
              router.push('/Notice');
            }} style={{ textAlign: 'center', padding: 16 }}>
              {/*<GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>微信</GridItem>*/}
              <WechatOutlined />
              <div>通知</div>
            </div>
          </FlexItem>
          <FlexItem>
            <div onClick={()=>{
              router.push('/Work');
            }} style={{ textAlign: 'center', padding: 16 }}><WechatOutlined />
              <div>工作</div>
            </div>
          </FlexItem>
          <FlexItem>
            <div onClick={()=>{
              router.push('/Report');
            }} style={{ textAlign: 'center', padding: 16 }}><WechatOutlined />
              <div>报表</div>
            </div>
          </FlexItem>
          <FlexItem>
            <div onClick={()=>{
              router.push('/User');
            }} style={{ textAlign: 'center', padding: 16 }}><WechatOutlined />
              <div>我的</div>
            </div>
          </FlexItem>
        </Flex>
      </Affix>
    </div>
  );
}

export default BasicLayout;
