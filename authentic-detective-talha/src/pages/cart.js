import CartPage from "@/components/cart-page";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";
import { useDispatch, useSelector } from "react-redux";
import { selectBulkFormData } from "@/store/slice/bulkFormData";
import SingleCartComponent from "@/components/cart-page/single-cart";
import { useEffect, useState } from "react";
import { currentUserInformation } from "@/store/slice/userData";
import {
  GET_BUSINESS_PROFILE,
  GET_USER_PROFILE,
} from "../../utils/api/constants";
import axiosInstance from "../../utils/api/axios-client";

const seo = {
  title: "Cart",
  description: "selected products details",
};

export default function CartItems() {
  const [realTimeUserInfo, setRealTimeUserIfo] = useState();
  const userInfo = useSelector(currentUserInformation);

  const isUserLoggedIn = Object.keys(userInfo)?.length > 0;

  const getRealTimeUserInfo = async () => {
    try {
      const apiEndPoint =
        role === "business-user" ? GET_BUSINESS_PROFILE : GET_USER_PROFILE;
      setLoader(true);
      const response = await (role === "business-user"
        ? axiosInstance.get(
            `${apiEndPoint}?id=${userInfo?.user?.user_business[0]?.id}`
          )
        : axiosInstance.get(`${apiEndPoint}?id=${userInfo?.user?.id}`));

      if (response?.data) {
        setRealTimeUserIfo(response?.data?.additional_data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (userInfo && isUserLoggedIn) {
      getRealTimeUserInfo();
    }
  }, [userInfo, isUserLoggedIn]);

  const bulkFormsDataFromRedux = useSelector(selectBulkFormData);

  return (
    <>
      <Layout seo={seo}>
        {bulkFormsDataFromRedux?.length > 1 ? (
          <CartPage realTimeUserInfo={realTimeUserInfo} />
        ) : null}
        {bulkFormsDataFromRedux?.length === 1 ? (
          <SingleCartComponent realTimeUserInfo={realTimeUserInfo} />
        ) : null}
      </Layout>
    </>
  );
}
