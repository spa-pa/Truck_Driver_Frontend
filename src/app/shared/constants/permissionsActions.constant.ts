// export const PermissionsActions = {
//     CREATE: { value: 1, name: 'create' },
//     EDIT: { value: 2, name: 'edit' },
//     DELETE: { value: 4, name: 'delete' },
//     VIEW: { value: 8, name: 'view' },
//   };


export const PermissionsActions = {
  CREATE: { value: 1, name: 'Create' },
  EDIT: { value: 2, name: 'Edit' },
  VIEW: { value: 4, name: 'View' },
  DELETE: { value: 8, name: 'Delete' },

  PORT_KEYS: { value: 16, name: 'PortKeys' },
  SEQUENCE: { value: 32, name: 'Sequence' },
  CHARGE_UNIT: { value: 64, name: 'ChargeUnit' },
  VESSEL_UNIT: { value: 128, name: 'VesselUnit' },
  ADD_VESSEL_TYPES: { value: 256, name: 'AddVesselTypes' },
  REMOVE_VESSEL_TYPES: { value: 256, name: 'RemoveVesselTypes' },
  MIN_DA_QTY: { value: 512, name: 'MinDAQty' },
  CURRENCY: { value: 1024, name: 'Currency' },
  MIN_CURRENCY: { value: 2048, name: 'MinCurrency' },
  COASTAL_FOREIGN: { value: 4096, name: 'CoastalForeign' },
  LOADED: { value: 8192, name: 'Loaded' },
  BALLAST: { value: 16384, name: 'Ballast' },
  ACTIVE_INACTIVE: { value: 32768, name: 'ActiveInactive' },
  CONDITION: { value: 65536, name: 'Condition' },
  MANDATORY: { value: 131072, name: 'Mandatory' },
  BASE_CHARGE_CODE: { value: 262144, name: 'BaseChargeCode' },
  BASE_PERCENTAGE: { value: 524288, name: 'BasePercentage' },
  VENDOR: { value: 1048576, name: 'Vendor' },
  REBATE: { value: 2097152, name: 'Rebate' },
  BERTH: { value: 4194304, name: 'Berth' },
  ANCHORAGE: { value: 8388608, name: 'Anchorage' },
  PILOTAGE: { value: 16777216, name: 'Pilotage' },
  PILOTAGE_TYPE: { value: 33554432, name: 'PilotageType' },
  COMMODITY: { value: 67108864, name: 'Commodity' },
  REMARKS: { value: 134217728, name: 'Remarks' },
  IS_EBMS_PUSH: { value: 268435456, name: 'IsEBMSPush' },
  VIEW_DETAILS: { value: 536870912, name: 'ViewDetails' }
};