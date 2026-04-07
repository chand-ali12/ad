import React from "react";
import axios from "../../utils/api/axios-client";

import { UPLOAD_MEDIA } from "../api/constants";
import { notifyError } from "../toast";

export const UploadMediaToS3 = async (file, type) => {
  const formData = new FormData();

  formData.append("image", file);

  formData.append("storage_type", type ? type : "postMedia");

  try {
    const response = await axios.post(UPLOAD_MEDIA, formData);
    if (response?.data?.data) {
      return response?.data?.data;
    } else if (
      response?.data?.status_code == "401" ||
      response?.data?.status == false
    ) {
      notifyError(response.data.msg);
      return;
    }
  } catch (error) {
    if (error?.code === "ERR_NETWORK") {
      notifyError("please connect to the internet first");
    } else {
      notifyError(error.toString());
    }
    return;
  }
};
