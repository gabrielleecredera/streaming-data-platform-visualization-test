import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

import './App.css';
import { CalculatedData, Data } from './types';
import * as Styled from './App.styles';

// temp until we have more numbers
// const timeBetweenStations = 150;

// south to north list of stations names
const stations = [
  'Elephant & Castle Underground Station',
  'Lambeth North Underground Station',
  'Waterloo Underground Station',
  'Embankment Underground Station',
  'Charing Cross Underground Station',
  'Piccadilly Circus Underground Station',
  'Oxford Circus Underground Station',
  'Regent\'s Park Underground Station',
  'Baker Street Underground Station',
  'Marylebone Underground Station',
  'Edgware Road (Bakerloo) Underground Station',
  'Paddington Underground Station',
  'Warwick Avenue Underground Station',
  'Maida Vale Underground Station',
  'Kilburn Park Underground Station',
  'Queen\'s Park Underground Station',
  'Kensal Green Underground Station',
  'Willesden Junction Underground Station',
  'Harlesden Underground Station',
  'Stonebridge Park Underground Station',
  'Wembley Central Underground Station',
  'North Wembley Underground Station',
  'South Kenton Underground Station',
  'Kenton Underground Station',
  'Harrow & Wealdstone Underground Station',
];

type DataWithCheckedFields = Data & CalculatedData & Pick<Required<Data>, 'stationName' | 'destinationName' | 'vehicleId' | 'timeToStation'>;

const containsRequiredFields = (data: Data): data is DataWithCheckedFields => (
  data.stationName !== undefined && data.destinationName !== undefined
  && data.vehicleId !== undefined && data.timeToStation !== undefined
);

function App() {
  const [data, setData] = useState<Data[] | undefined>(undefined);

  useEffect(() => {
    setTimeout(() => {
      const getData = async () => axios.get(
        `https://api.tfl.gov.uk/Line/bakerloo/Arrivals?app_id=${process.env.REACT_APP_API_APP_ID}&app_key=${process.env.REACT_APP_API_KEY_VALUE}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );
      getData().then((response) => {
        setData(response.data);
      });
    }, data ? 5000 : 0);
  }, [data]);

  const sortedVehicles = useMemo(() => {
    if (!data) {
      return [];
    }

    const vehicles: Record<string, DataWithCheckedFields> = {};
    data.forEach((entry) => {
      if (!containsRequiredFields(entry)) {
        return;
      }

      // some vehicles aren't on the line yet?
      if (!stations.includes(entry.stationName)) {
        return;
      }

      // only vehicles heading north
      // if (stations.indexOf(entry.destinationName) === 0
      //   || stations.indexOf(entry.destinationName) < stations.indexOf(entry.stationName)) {
      //   return;
      // }
      const destinationIndex = stations.indexOf(entry.destinationName);
      const stationIndex = stations.indexOf(entry.stationName);
      let direction: 'left' | 'right' | undefined;
      if (destinationIndex < stationIndex) {
        direction = 'left';
      } else if (stationIndex < destinationIndex) {
        direction = 'right';
      } else if (vehicles[entry.vehicleId] && vehicles[entry.vehicleId].direction) {
        direction = vehicles[entry.vehicleId].direction;
      }

      if (!(entry.vehicleId in vehicles)) {
        vehicles[entry.vehicleId] = {
          ...entry,
          direction,
        };
        return;
      }

      if (vehicles[entry.vehicleId].timeToStation === undefined) {
        return;
      }

      const { timeToStation } = vehicles[entry.vehicleId];
      if (timeToStation && entry.timeToStation < timeToStation) {
        vehicles[entry.vehicleId] = {
          ...entry,
          direction,
        };
      }
    });

    return Object.values(vehicles).filter((entry) => entry.direction).sort((a, b) => {
      const aStationIndex = stations.indexOf(a.stationName);
      const bStationIndex = stations.indexOf(b.stationName);

      if (aStationIndex !== bStationIndex) {
        return aStationIndex - bStationIndex;
      }

      return b.timeToStation - a.timeToStation;
    });
  }, [data]);

  console.log(sortedVehicles);

  return (
    <div className="App">
      <p>
        data streaming platform data visualization test / demo (gab, 13 May 09:00)
        <br />
        - only Bakerloo line (left = south, right = north) vehicles
        <br />
        - auto-refetches data every 10 seconds
        <br />
        - the gif that you&apos;re seeing is sped up (a lot)
      </p>
      <Styled.TubeLine>
        {stations.map((station) => (
          <Styled.StationWrapper key={station}>
            {sortedVehicles.filter((entry) => entry.stationName === station).map((entry) => (
              <Styled.Vehicle
                key={entry.id}
                title={(
                  <>
                    {entry.vehicleId}
                    <br />
                    {entry.stationName}
                    <br />
                    heading
                    {' '}
                    {entry.direction}
                    <br />
                    {entry.timeToStation}
                    s away from station
                    <br />
                    {entry.currentLocation}
                  </>
              )}
                direction={entry.direction as 'left' | 'right'}
                timeToStation={entry.timeToStation}
              >
                <div>{entry.vehicleId}</div>
              </Styled.Vehicle>
            ))}
            <Styled.StationName>{station.replace(' Underground Station', '')}</Styled.StationName>
          </Styled.StationWrapper>
        ))}
        <Styled.StationWrapper />
      </Styled.TubeLine>

      <br />

      {sortedVehicles.map((entry) => (
        <div key={entry.id}>
          {entry.vehicleId}
          {' '}
          {entry.stationName}
          {' '}
          {entry.timeToStation}
          s
          {' '}
          {entry.currentLocation}
        </div>
      ))}
    </div>
  );
}

export default App;
