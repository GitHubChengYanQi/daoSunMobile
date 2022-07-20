import React, { useState } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { Divider, Selector, Toast } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useRequest } from '../../../../../../../../../util/Request';
import { announcementsAdd, announcementsListSelect } from '../../../../../../Url';
import { useBoolean } from 'ahooks';
import FocusInput from './components/FocusInput';

const Careful = (
  {
    show,
    type,
    value = [],
    onChange = () => {
    },
  }) => {

  const { loading: listLoading, data: announcemens, refresh } = useRequest({
    ...announcementsListSelect,
    data: { type },
  },{
    onSuccess:()=>{

    }
  });

  const { loading: addLoading, run: add } = useRequest(announcementsAdd, {
    manual: true,
    onSuccess: (res) => {
      openAddOther();
      refresh();
      onChange([...value, res.noticeId]);
    },
  });

  const [allCareful, { toggle: carefulToggle }] = useBoolean();

  const [addOther, { toggle: openAddOther }] = useBoolean();

  const [content, setContent] = useState('');

  return <>
    <div className={style.carefulData} id='careful'>
      <Selector
        disabled={show}
        value={value}
        className={style.selector}
        options={[...ToolUtil.isArray(announcemens).filter((item, index) => allCareful || index < 6), {
          label: '其他',
          value: 'other',
        }]}
        multiple={true}
        onChange={(noticeIds) => {
          if (noticeIds.includes('other')) {
            setContent('');
            openAddOther();
          }
          onChange(noticeIds.filter(item => item !== 'other'));
        }}
      />
      {addOther && <div className={style.addCareful}>
        <FocusInput onChange={setContent} />
        <div className={style.actions}>
          <div className={style.closeButton} onClick={() => {
            openAddOther();
          }}>取消
          </div>
          <div className={style.split} />
          <div className={style.button} onClick={() => {
            if (content) {
              add({ data: { content, type } });
            } else {
              Toast.show({ content: '请输入事项名称！', position: 'bottom' });
            }
          }}>保存
          </div>
        </div>

      </div>}
    </div>
    {ToolUtil.isArray(announcemens).length > 6 && <Divider className={style.allSku}>
      <div onClick={() => {
        carefulToggle();
      }}>
        {
          allCareful ?
            <UpOutline />
            :
            <DownOutline />
        }
      </div>
    </Divider>}

    {(addLoading || listLoading) && <MyLoading />}
  </>;
};

export default Careful;
