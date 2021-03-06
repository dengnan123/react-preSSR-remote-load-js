import { memo } from 'react';
import UmdLoader from '@/components/UmdLoader';
import ErrorWrap from '@/components/ErrorWrap';
import isEqual from 'fast-deep-equal';
import { getCompScriptInfo } from '@/helpers/static';

const PurCompLib = (props) => {
  const { compName, id } = props;
  const { compLibSrc, loaderLibName } = getCompScriptInfo(compName);
  return (
    <ErrorWrap>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        id={id}
      >
        <UmdLoader url={compLibSrc} name={compName} props={{ ...props }}>
          <div
            style={{
              // width: props.width,
              // height: props.height,
              // backgroundColor: 'red',
            }}
          >
            {/* loading */}
          </div>
        </UmdLoader>
      </div>
    </ErrorWrap>
  );
};

// const basicFileds = ['lang', 'width', 'height', 'loading'];
// const objectFileds = ['data', 'style', 'otherCompParams', 'pageConfig', 'loadingOverRes'];

// function comparator(previosProps, nextProps) {
//   let shouldMemo = true;
//   for (const v of basicFileds) {
//     if (previosProps[v] !== nextProps[v]) {
//       shouldMemo = false;
//       break;
//     }
//   }
//   if (shouldMemo) {
//     for (const v of objectFileds) {
//       if (!isEqual(previosProps[v], nextProps[v])) {
//         if (previosProps.id === 'a19033b2-5b96-4dd7-a996-c085117e39f0') {
//           console.log('不一样', v);
//         }

//         shouldMemo = false;
//         break;
//       }
//     }
//   }
//   if (previosProps.id === 'a19033b2-5b96-4dd7-a996-c085117e39f0') {
//     if (shouldMemo) {
//       console.log('使用memo。。。。。');
//     }
//     console.log('shouldMemo', shouldMemo);
//   }

//   return shouldMemo;
// }
// export default memo(PurCompLib, comparator);

export default PurCompLib;
