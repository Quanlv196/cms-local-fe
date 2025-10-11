import styled, { StyledFunction }  from 'styled-components';
const outerWrapper: StyledFunction<any> = styled.div
export const OuterWrapper = outerWrapper`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: ${(props:any) => (1 / props.ratio) * 100}%;
`
export const InnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
