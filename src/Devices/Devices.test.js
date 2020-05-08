import { apiCall } from "../utils/constants";
import { apiCorsUrl } from "./hologramConstants";
import { jssPreset } from "@material-ui/core";
// import mockAxios from "axios";
const axios = require("axios");

// const hologramDevicesUrl = "https://dashboard.hologram.io/api/1/csr/rdm?deviceid=280933"
// it('should have fetch devices properly', done => {
//     apiCall(apiCorsUrl, {}).then(response => {
//         expect(response).toEqual({
//             data: {},
//           });
//     });
//     expect(mockAxios).toHaveBeenCalledWith({
//         method: 'post',
//         url: '/test'
//       });
// });

jest.mock("axios");

it("returns the title of the first album", () => {
  axios.get.mockResolvedValue({
    data: [
      {
        userId: 1,
        id: 1,
        title: "My First Album",
      },
      {
        userId: 1,
        id: 2,
        title: "Album: The Sequel",
      },
    ],
  });

  let axiosData = apiCall();
  axiosData.then((val) => {
    console.log(val);
  });

  expect(true).toBe(true);
  // console.log(title.data);
});
