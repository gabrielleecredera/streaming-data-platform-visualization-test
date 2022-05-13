import styled from 'styled-components';
import { Tooltip } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import thomas from './thomas.png';

export const TubeLine = styled.div`
  display: grid;
  grid-auto-flow: column;
  overflow: auto;
  margin: 50px;
  padding-bottom: 10px;
`;

export const StationWrapper = styled.div`
  min-width: 100px;
  height: 170px;
  border-left: 1px solid #ddd;
  position: relative;
  border-bottom: 10px solid #75431f;
  
  &:last-child {
    border-right: 1px solid #ddd;
  }
`;

export const StationName = styled.div`
  position: absolute;
  width: 90px;
  right: -45px;
  bottom: 5px;
  z-index: 1;
  
  &::after {
    position: absolute;
    content: '';
    background-color: #fff;
    border: 4px solid #000;
    border-radius: 10px;
    width: 10px;
    height: 10px;
    left: calc(50% - 8px);
    bottom: -19px;
  }
`;

interface VehicleProps {
  timeToStation: number;
  direction: 'left' | 'right';
}

const rightVal = ({ direction, timeToStation }: VehicleProps) => (
  direction === 'left'
    ? Math.max(timeToStation * -1, -95) - 25
    : Math.min(timeToStation, 95) - 25
);

export const Vehicle = muiStyled(Tooltip)<VehicleProps>`
  right: ${({ direction, timeToStation }) => rightVal({ direction, timeToStation })}px;
  top: ${({ direction }) => (direction === 'left' ? '60px' : '0')};
  position: absolute;
  width: 50px;
  z-index: 1;
  
  &::after {
    position: absolute;
    content: '';
    width: 50px;
    height: 30px;
    left: calc(50% - 25px);
    top: 25px;
    background-image: url(${thomas});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    ${({ direction }) => (direction === 'left' ? 'transform: scaleX(-1)' : '')};
  }
`;
