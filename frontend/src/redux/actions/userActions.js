//Dispatch => Call API =>Update state based on success or failure

import api from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  updateReset,
  clearErrors,
} from "../slices/userSlice";

// LOGIN

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await api.post("/v1/users/login", {
      email,
      password,
    });

    const token = data.token;
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(
      loginFail(
        error.response?.data?.message || error.message || "Login failed"
      )
    );
  }
};

//Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.post("/v1/users/signup", userData);

    const token = data.token;
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(
      loginFail(
        error.response?.data?.message || error.message || "Register failed"
      )
    );
  }
};

//load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginRequest());

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
    }

    const { data } = await api.get("/v1/users/me");

    console.log("loadUser response:", data);

    dispatch(loginSuccess(data.user));
  } catch (error) {
    console.log("loadUser error:", error.response);

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }

    dispatch(loadUserFail(error.response?.data?.message));
  }
};

//update profile

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await api.put("/v1/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message));
  }
};

//logout
export const logout = () => async (dispatch) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }

    await api.get("/v1/users/logout");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(error.response?.data?.message));
  }
};
