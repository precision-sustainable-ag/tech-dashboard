const { ObjectModel, ArrayModel } = require("objectmodel");

export const Devices = new ArrayModel([
  new ObjectModel({
    hidden: Number,
    id: Number,
    imei: String,
    imei_sv: String,
    links: new ObjectModel({
      cellular: new ArrayModel([
        new ObjectModel({
          apn: String,
          carrierid: Number,
          cur_billing_data_used: Number,
          data_threshold: Number,
          id: Number,
          imsi: Number,
          last_billing_data_used: Number,
          last_connect_time: String,
          last_network_used: String,
          msisdn: String,
          overagelimit: Number,
          pin: String,
          plan: new ObjectModel({
            account_tier: String,
            cost: String,
            data: Number,
            id: Number,
            name: String,
            overage: String,
            sms: String,
            zone: String,
          }),
          puk: String,
          sim: String,
          state: String,
          whenclaimed: String,
          whenexpires: String,
        }),
      ]),
    }),
    manufacturer: [String, undefined],
    model: [String, undefined],
    name: String,
    orgid: Number,
    phonenumber: String,
    phonenumber_cost: String,
    tags: new ArrayModel([new ObjectModel({}), undefined]),
    tunnelable: Number,
    type: String,
    whencreated: String,
  }),
]);
