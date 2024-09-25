import axios from "axios";

import { getAdToken } from "../utils/login.js";

const request = axios.create({
  baseURL: "https://test-inner.linkerpi.com:8008/",
});

export const uploadScript = (content: string) =>
  request({
    data: { data: content, key: "LbA7oEaciUgpmXc0gIfxy9oE" },
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    url: "api/front_script/upload",
  });

type IWidget = {
  // config: any;
  name: string;
  script_id: string;
  widget_id: string;
};

const BASE_PARAMS = {
  ad: "0187724A205E11EDAB7B0C42A1E838C8",
  token: "75B36F989734AEA06341968E4310AF4F",
};

export const addWidget = (widget: IWidget) =>
  request({
    data: {
      ...widget,
      ...getAdToken(),
      config: {},
      org_id: "FC378A5273D8BEF52C3AB5157B817204",
      public: true,
    },
    method: "POST",
    url: "/api/front_script/addComp",
  }).then((res: any) => {
    if (res.data?.status === "ok") return res;
    throw res;
  });

export const updateWidget = (widget: IWidget) =>
  request({
    data: {
      ...widget,
      ...getAdToken(),
      config: {},
      org_id: "FC378A5273D8BEF52C3AB5157B817204",
      public: true,
    },
    method: "POST",
    url: "/api/front_script/updateComp",
  });

export const getWidget = (widget_id: string) =>
  request({
    data: {
      org_id: "FC378A5273D8BEF52C3AB5157B817204",
      widget_id,
    },
    method: "POST",
    url: "/api/front_script/getCompList",
  }).then((res) => {
    if (res.data.status === "ok") {
      return res.data.data[0];
    }

    throw res.data;
  });
