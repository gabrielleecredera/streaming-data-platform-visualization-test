export interface Data {
  $type?: string;
  id?: string;
  operationType?: number;
  vehicleId?: string;
  naptanId?: string;
  stationName?: string;
  lineId?: string;
  lineName?: string;
  platformName?: string;
  direction?: string;
  bearing?: string;
  destinationNaptanId?: string;
  destinationName?: string;
  timestamp?: string;
  timeToStation?: number;
  currentLocation?: string;
  towards?: string;
  expectedArrival?: string;
  timeToLive?: string;
  modeName?: string;
  timing?: unknown;
}

export interface CalculatedData {
  direction?: 'left' | 'right';
}
