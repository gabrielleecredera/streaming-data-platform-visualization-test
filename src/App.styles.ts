import styled from 'styled-components';
import thomas from './thomas.png';

export const TubeLine = styled.div`
  display: grid;
  grid-auto-flow: column;
  overflow: auto;
  margin: 50px 100px 50px 50px;
  padding-bottom: 10px;
  padding-right: 20px;
`;

export const StationWrapper = styled.div`
  min-width: 100px;
  height: 150px;
  border: 1px solid #ddd;
  position: relative;
  border-bottom: 10px solid #75431f;
  
  &:last-child {
    margin-right: 20px;
  }
`;

export const StationName = styled.div`
  position: absolute;
  width: 90px;
  right: -45px;
  bottom: 5px;
  
  &::after {
    position: absolute;
    content: '';
    background-color: #fff;
    border: 4px solid #000;
    border-radius: 10px;
    width: 10px;
    height: 10px;
    left: calc(50% - 8px);
    bottom: -20px;
    z-index: 1;
  }
`;

interface VehicleProps {
  timeToStation: number;
}

export const Vehicle = styled.div<VehicleProps>`
  right: ${({ timeToStation }) => Math.min(timeToStation, 95)}px;
  position: absolute;
  
  &::after {
    position: absolute;
    content: '';
    width: 50px;
    height: 30px;
    left: calc(50% - 22px);
    top: 25px;
    background-image: url(${thomas});
    background-size: cover;
    background-position: center;
  }
`;
