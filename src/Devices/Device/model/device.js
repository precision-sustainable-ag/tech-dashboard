const { ObjectModel } = require("objectmodel");

export const Device = new ObjectModel({
  data: String,
  device_metadata: String,
  deviceid: Number,
  id: Number,
  logged: String,
  matchedRules: new ObjectModel({
    error: Boolean,
    result_data: String,
    ruleid: Number,
  }),
  orgid: Number,
  record_id: String,
  tags: Array,
});
