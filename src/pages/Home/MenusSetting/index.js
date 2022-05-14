import React, { useEffect, useState } from 'react';
import style from './index.less';
import { Badge, Card, Grid, Toast } from 'antd-mobile';
import Menus from '../component/Menus';
import { AddOutline, DownOutline, MinusOutline, SetOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import LinkButton from '../../components/LinkButton';
import { Sortable } from '../../components/DndKit/Sortable';
import { Handle } from '../../components/DndKit/Item';
import { useModel } from 'umi';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import MyNavBar from '../../components/MyNavBar';
import { connect } from 'dva';
import DefaultMenus from '../component/DefaultMenus';


const menusAddApi = { url: '/mobelTableView/add', method: 'POST' };

const MenusSetting = (props) => {

  const { initialState } = useModel('@@initialState');

  const userInfo = initialState.userInfo || {};

  const userMenus = props.data.userMenus;

  const [commonlyMenus, setCommonlyMenus] = useState([]);

  const [show, { toggle: showToggle }] = useBoolean();

  const [menuSys, { toggle }] = useBoolean();

  const [refresh, { toggle: sortToggle }] = useBoolean();

  const { loading: addLoading, run: addRun } = useRequest(menusAddApi, {
    manual: true,
    onSuccess: () => {
      toggle();
      props.dispatch({
        type: 'data/getUserMenus',
      });
      Toast.show({ content: '保存成功！', position: 'bottom' });
    },
  });

  const sysMenus = userInfo.menus || [];

  console.log(sysMenus);

  useEffect(() => {
    setCommonlyMenus(DefaultMenus({ userMenus, sysMenus }));
  }, [userMenus]);

  useEffect(() => {
    if (!userMenus) {
      props.dispatch({
        type: 'data/getUserMenus',
      });
    }
  }, []);

  const menus = (item, shake) => {
    return <Menus
      textOverflow={70}
      module={module}
      code={item.code}
      name={item.name}
      shake={shake}
      disabled={menuSys}
      fontSize={34}
    />;
  };

  const addAction = async (data) => {
    await setCommonlyMenus([...commonlyMenus, data]);
    sortToggle();
  };

  const remove = async (code) => {
    const newMenus = commonlyMenus.filter(item => item.code !== code);
    if (newMenus.length === 0) {
      return Toast.show({ content: '最少保留1个常用功能！' });
    }
    await setCommonlyMenus(newMenus);
    sortToggle();
  };

  const Item = (props) => {

    const { value, item, index, ...other } = props;

    if (!menuSys) {
      return menus(item);
    }

    let shake = '';

    switch (index % 3) {
      case 0:
        shake = style.shake0;
        break;
      case 1:
        shake = style.shake1;
        break;
      case 2:
        shake = style.shake2;
        break;
      default:
        break;
    }

    return <div className={shake}>
      <Badge className={style.badge} content={<div className={style.removeContent}>
        <MinusOutline onClick={() => {
          remove(item.code);
        }} />
      </div>}>
        <Handle {...other} >
          {menus(item, true)}
        </Handle>
      </Badge>

    </div>;
  };

  const addButton = (code, name) => {
    const commonly = commonlyMenus.map(item => item.code);
    return (menuSys && !commonly.includes(code)) ?
      <div className={style.addContent}>
        <AddOutline onClick={() => {
          if (commonlyMenus.length >= 8) {
            return Toast.show({ content: '最多添加8个常用功能！' });
          }
          addAction({ code, name });
        }} />
      </div> : null;
  };

  return <div>
    <MyNavBar title='所有功能' />
    <div className={style.menuSetting}>
      <Card
        className={style.card}
        title={<div className={style.cardTitle}>常用功能</div>}
        extra={<LinkButton
          className={style.menuSys}
          onClick={() => {
            if (menuSys) {
              const details = commonlyMenus.map((item, index) => {
                return {
                  ...item,
                  sort: index,
                };
              });
              addRun({
                data: { details },
              });
              return;
            }
            toggle();
          }}
        >
          {
            !menuSys
              ?
              <>
                管理<SetOutline style={{ marginLeft: 5 }} />
              </>
              :
              '保存'
          }
        </LinkButton>}
        bodyClassName={(show || menuSys) ? style.commonlyOpen : style.cardBody}
        headerClassName={style.cardHeader}
      >
        {
          (show || menuSys)
            ?
            <Sortable
              refresh={refresh}
              handle={!menuSys}
              style={{ display: 'block' }}
              definedItem={Item}
              Container={(props) => {
                if (props.children.length === 0) {
                  return <div style={{ padding: '16px 21px' }}>请添加应用</div>;
                }
                return <Grid columns={4} gap={0}>
                  {props.children.map((item, index) => {
                    return <Grid.Item className={style.menus} key={index}>
                      {item}
                    </Grid.Item>;
                  })}
                </Grid>;
              }}
              liBorder
              items={commonlyMenus.map(item => {
                return { key: item.code, ...item };
              })}
              onDragEnd={(value) => {
                setCommonlyMenus(value);
              }}
            />
            :
            <div className={style.commonlyClose} onClick={() => {
              showToggle();
            }}>
              <div className={style.commonlyLeft}>
                已收起{commonlyMenus.length}个应用
              </div>
              <div className={style.commonlyRight}>
                {
                  commonlyMenus.map((item, index) => {
                    if (index < 5) {
                      return <Menus code={item.code} key={index} onlyIcon />;
                    }
                    return null;
                  })
                }
                <DownOutline className={style.commonlyIcon} />
              </div>
            </div>
        }
      </Card>


      {
        sysMenus.map((item, index) => {
          const subMenus = item.subMenus || [];
          const otherMenus = [];
          switch (item.id) {
            case 'ERP':
              otherMenus.push({ name: '自由入库', code: 'freeInstock' });
              otherMenus.push({ name: '自由出库', code: 'freeOutStock' });
              break;
            case 'production':
              otherMenus.push({ name: '生产任务', code: 'productionTask' });
              otherMenus.push({ name: '领料管理', code: 'pickLists' });
              otherMenus.push({ name: '我的领料', code: 'myCart' });
              break;
            case 'REPAIR':
              otherMenus.push({ name: '工单管理', code: 'Repair' });
              otherMenus.push({ name: '创建报修', code: 'CreateRepair' });
              break;
            default:
              break;
          }

          return <Card
            key={index}
            className={style.card}
            title={<div className={style.cardTitle}>
              {item.name}
              {addButton(item.id, item.name)}
            </div>}
            bodyClassName={style.menuCardBody}
            headerClassName={style.cardHeader}
          >
            <Grid columns={4} gap={0}>
              {
                subMenus.concat(otherMenus).map((item, index) => {
                  return <Grid.Item className={style.menus} key={index}>
                    <Badge className={style.badge} content={addButton(item.code, item.name)}>
                      {menus(item)}
                    </Badge>
                  </Grid.Item>;
                })
              }
            </Grid>
          </Card>;
        })
      }

      <Card
        className={style.card}
        title={<div className={style.cardTitle}>
          登录设置
        </div>}
        bodyClassName={style.menuCardBody}
        headerClassName={style.cardHeader}
      >
        <Grid columns={4} gap={0}>
          <Grid.Item className={style.menus}>
            <Badge className={style.badge} content={addButton('LogOut', '退出登录')} color='var(--adm-color-primary)'>
              {menus({ code: 'LogOut', name: '退出登录' })}
            </Badge>
          </Grid.Item>
        </Grid>
      </Card>

      {addLoading && <MyLoading />}
    </div>
  </div>;
};

export default connect(({ data }) => ({ data }))(MenusSetting);
