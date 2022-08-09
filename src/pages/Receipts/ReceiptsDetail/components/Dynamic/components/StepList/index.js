import React from 'react';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import style from '../../index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import LinkButton from '../../../../../../components/LinkButton';
import { useModel } from 'umi';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import { Avatar } from 'antd-mobile';

const StepList = (
  {
    remarks = [],
    onChange = () => {
    },
    addComments = () => {
    },
    imgHidden,
    nameHidden,
    className,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = initialState.userInfo || {};

  const getContent = (item) => {
    switch (item.type) {
      case 'audit':
        switch (item.status) {
          case 1:
            return <div>
              同意了审批
              <div style={{ padding: '4px 0' }}>
                {item.content}
              </div>
            </div>;
          case 0:
            return <div>
              拒绝了审批
              <div>
                {item.content}
              </div>
            </div>;
          default:
            return '';
        }
      default:
        return item.content;
    }
  };

  return <div className={style.log}>
    {
      remarks.map((item, index) => {

        const permissions = userInfo.id === item.createUser;

        const replys = item.childrens || [];

        const user = ToolUtil.isObject(item.user);

        const imgs = item.photoId ? item.photoId.split(',').map(item => {
          return { url: item };
        }) : [];

        return <div key={index} className={ToolUtil.classNames(style.dynamic,className)} style={{ borderTop: index === 0 && 'none' }}>

          <div className={style.avatar} hidden={imgHidden}>
            <Avatar src={user.avatar} style={{'--size':'32px'}} />
          </div>

          <div>
            <div className={style.name} hidden={nameHidden || !user.name}>
              {user.name}
            </div>
            <div className={style.description}>
              <div className={style.content}>
                {getContent(item)}
              </div>
              <div className={style.photos} hidden={imgs.length === 0}>
                <UploadFile show value={imgs} />
              </div>
              <div className={style.time}>
                {ToolUtil.timeDifference(item.createTime)}
              </div>
              <div hidden={replys.length === 0} className={style.reply}>
                <div onClick={() => {
                  const newRemakes = remarks.map((item, currentIndex) => {
                    if (index === currentIndex) {
                      return { ...item, down: !item.down };
                    }
                    return item;
                  });
                  onChange(newRemakes);
                }}>{item.down ? <DownOutline /> : <UpOutline />} 回复
                </div>
                {
                  !item.down && replys.map((item, index) => {
                    return <div key={index} className={style.replyItem}>
                      <div className={style.name}>
                        {ToolUtil.isObject(item.user).name}
                        <span>{item.createTime}</span>
                      </div>
                      <div className={style.description}>
                        {item.content}
                      </div>
                    </div>;
                  })
                }
              </div>
              <div hidden={true || item.type !== 'comments'} className={style.actions}>
                <LinkButton onClick={() => {
                  addComments(item.remarksId);
                }}>回复</LinkButton>
                <LinkButton>置顶</LinkButton>
                {permissions && <LinkButton>编辑</LinkButton>}
                {permissions && <LinkButton color='danger'>删除</LinkButton>}
              </div>
            </div>
          </div>

        </div>;
      })
    }
  </div>;
};

export default StepList;
