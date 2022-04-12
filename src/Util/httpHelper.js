import axios from "axios";
import { getToken } from "./Auth";
const url = "http://103.125.170.23:10101/hotel_booking_api/v1";

export function post(endpoint, body) {
  return axios.post(url + endpoint, body);
}

export function getAuth(endpoint) {
  const token = getToken("token");
  return axios.get(url + endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function postAuth(endpoint, body) {
  const token = getToken("token");
  return axios.post(url + endpoint, body, {
    "Access-Control-Allow-Origin": "*",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function postForm(endpoint, body) {
  const token = getToken("token");
  return axios.post(url + endpoint, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data,",
    },
  });
}

export function delAuth(endpoint) {
  const token = getToken("token");
  return axios.delete(url + endpoint, {
    "Access-Control-Allow-Origin": "*",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function putAuth(endpoint, body) {
  const token = getToken("token");
  return axios.put(url + endpoint, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}


export function putForm(endpoint, body) {
  const token = getToken("token");
  return axios.put(url + endpoint, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data,",
    },
  });
}