import React from 'react';
import { getCompLib, getCompItemProps } from '@/helpers/screen';
import { getBasicStyle, getTransform, getStyle, getGridStyle } from '@/helpers/utils';
import ReferenceLine from '@/components/ReferenceLine';

const childList = props => {
  const { v = {} } = props;
  const { child = [], left: PLeft, top: PTop, id } = v;
  const itemStyle = {
    ...getStyle({
      ...v,
    }),
  };
  return (
    <div style={itemStyle} key={id}>
      {child.map(v => {
        const { left, top, width, height, child, id, basicStyle, zIndex, type } = v;
        const itemProps = getCompItemProps({
          ...props,
          v,
        });
        const itemStyle = {
          ...getStyle({
            ...v,
            PLeft,
            PTop,
          }),
        };
        if (child?.length && type === 'container') {
          return (
            <div style={itemStyle} key={id}>
              {renderContainerTree({
                ...props,
                v,
              })}
              <ReferenceLine id={id}></ReferenceLine>
            </div>
          );
        }
        if (child?.length) {
          return (
            <div
              style={{
                position: 'absolute',
                transform: getTransform({
                  left,
                  top,
                  PLeft,
                  PTop,
                }),
                width,
                height,
                zIndex,
                ...getBasicStyle(basicStyle),
              }}
              key={id}
            >
              {childList({
                ...props,
                v,
              })}
              <ReferenceLine id={id}></ReferenceLine>
            </div>
          );
        }
        return (
          <div
            style={{
              position: 'absolute',
              transform: getTransform({
                left,
                top,
                PLeft,
                PTop,
              }),
              width,
              height,
              zIndex,
              ...getBasicStyle(basicStyle),
            }}
          >
            {getCompLib(itemProps)}
            <ReferenceLine id={id}></ReferenceLine>
          </div>
        );
      })}
      <ReferenceLine id={id}></ReferenceLine>
    </div>
  );
};

const renderChild = props => {
  const { v = {}, containerName } = props;
  const { child = [], type, style, id } = v;
  // const backgroundColor = style.backgroundColor;
  const getItemStyle = () => {
    if (containerName === 'GridCard') {
      return {
        ...getGridStyle({
          ...v,
        }),
        // backgroundColor,
      };
    }
    return {
      ...getStyle({
        ...v,
      }),
      // backgroundColor,
    };
  };
  const itemStyle = getItemStyle();
  if (!child?.length) {
    // 背景色 特殊处理 ，局部的覆盖全局的
    const itemProps = getCompItemProps({
      ...props,
      v,
    });

    return (
      <div style={itemStyle} key={id}>
        {getCompLib(itemProps)}
        <ReferenceLine id={id}></ReferenceLine>
      </div>
    );
  }
  if (child?.length && type !== 'container') {
    return (
      <div style={itemStyle} key={id}>
        {child.map(v => {
          const { style = {}, child, id, type } = v;
          // const backgroundColor = style.backgroundColor;
          const itemStyle = {
            ...getStyle({
              ...v,
              PLeft: props.v.left,
              PTop: props.v.top,
            }),
            // backgroundColor,
          };
          if (!child?.length) {
            // 背景色 特殊处理 ，局部的覆盖全局的
            const itemProps = getCompItemProps({
              ...props,
              v,
            });
            return (
              <div style={itemStyle} key={id}>
                {getCompLib(itemProps)}
                <ReferenceLine id={id}></ReferenceLine>
              </div>
            );
          }
          if (child?.length && type !== 'container') {
            return (
              <div style={itemStyle} key={id}>
                {childList({
                  ...props,
                  v,
                })}
                <ReferenceLine id={id}></ReferenceLine>
              </div>
            );
          }
          return (
            <div style={itemStyle} key={id}>
              {renderContainerTree({
                ...props,
                v,
              })}
              <ReferenceLine id={id}></ReferenceLine>
            </div>
          );
        })}
        <ReferenceLine id={id}></ReferenceLine>
      </div>
    );
  }
  return (
    <div style={itemStyle} key={id}>
      {renderContainerTree({
        ...props,
        v,
      })}
      <ReferenceLine id={id}></ReferenceLine>
    </div>
  );
};

const renderContainerTree = props => {
  const { v } = props;
  const { child, compName } = v;
  const itemProps = getCompItemProps(props);
  const newChild = child.map(v => {
    const data = {
      ...v,
    };
    if (compName === 'GridCard' && child.length === 1) {
      /**
       * 如果是卡片组件 如果那个child只有一个元素，那么这个子元素宽高 直接100%
       */
      data.width = '100%';
      data.height = '100%';
      data.left = 0;
      data.top = 0;
    }
    return {
      ...data,
      renderChildComp: renderChild({
        ...props,
        v: data,
        containerName: compName,
      }),
    };
  });
  return getCompLib({
    ...itemProps,
    child: newChild,
  });
};

/**
 * 生成大屏render
 */
const compRenderTree = props => {
  const { v } = props;
  const { child, type } = v;
  const itemProps = getCompItemProps({
    ...props,
    v,
  });
  if (!child?.length) {
    return getCompLib(itemProps);
  }
  if (child?.length && type !== 'container') {
    return childList(props);
  }
  // 容器
  return renderContainerTree(props);
};

const CompRender = props => {
  return compRenderTree(props);
};

export default CompRender;
