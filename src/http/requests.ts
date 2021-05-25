/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Constants } from "@/Constants";
import store from "@/store";
import axios, { AxiosResponse, Method } from "axios";
import { ActiveUsersDTO } from "./DTOs/activeUsers";
import { Credentials } from "./DTOs/credentials";
import { FavoriteDTO } from "./DTOs/favorite";
import { PhotoDTO } from "./DTOs/photoDTO";
import { SignupData } from "./DTOs/signupData";
import { User } from "./DTOs/userDTO";

export async function login(credentials: Credentials) {
	const response = await request(
		"POST",
		Constants.LOGIN_ENDPOINT,
        false,
		credentials
	);
    localStorage.setItem(Constants.JWT_KEY, response.data.access_token);
	store.commit('setAuthenticatedTrue');
	return response.data;
}

export async function signup(signupData: SignupData) {
	const response = await request(
		"POST",
		Constants.SIGNUP_ENDPOINT,
        false,
		signupData
	);
	console.log(response.data);
	return response.data;
}

export async function logout() {
	const response = await request("GET", Constants.LOGOUT_ENDPOINT, true);
    localStorage.removeItem(Constants.JWT_KEY);
	store.commit('setAuthenticatedFalse');
	return response.data;
}

export async function refresh() {
	const response = await request("GET", Constants.REFRESH_ENDPOINT, true);
    localStorage.setItem(Constants.JWT_KEY, response.data.access_token);
	return response.data;
}

export async function me(): Promise<User> {
	const response = await request("GET", Constants.ME_ENDPOINT, true);
    
	return response.data;
}

export async function activeUsers(): Promise<ActiveUsersDTO[]> {
	const response = await request("GET", Constants.USERS_ACTIVE_ENDPOINT, false);
    
	return response.data;
}

export async function favorite(favorite: FavoriteDTO) {
	const response = await request("POST", Constants.FAVORITE_ENDPOINT, true, favorite);
    
	return response.data;
}

export async function isFavorited(favorite: FavoriteDTO): Promise<boolean> {
	const response = await request("GET", `${Constants.IS_FAVORITED_ENDPOINT}/${favorite.photo_id}`, true, favorite);
	return response.data.favorited;
}

export async function unfavorite(unfavorite: FavoriteDTO) {
	const response = await request("POST", Constants.UNFAVORITE_ENDPOINT, true, unfavorite);
    
	return response.data;
}

export async function trendingPhotos() {
	const response = await request("GET", Constants.TRENDING_ENDPOINT, false);
    
	return response.data;
}

export async function getAllPhotos(page: number, limit = 20): Promise<PhotoDTO[]> {
	if (!store.state.authenticated) {
		//throw new ResponseException(401, 'You need to login to proceed to this page');
	}
	const url = `${process.env.VUE_APP_JSON_PLACE_HOLDER_URL}/${Constants.PHOTOS_ENDPOINT}`;
	const query = `?_page=${page}&_limit=${limit}`;
	const fullURL = url + query;

	const response = await axios.get(fullURL);
	return response.data;
}

export async function getPhotoById(photoId: number): Promise<PhotoDTO> {
	const url = `${process.env.VUE_APP_JSON_PLACE_HOLDER_URL}/${Constants.PHOTOS_ENDPOINT}/${photoId}`;
	const response = await axios.get(url);
	return response.data;
}

async function request(
	method: Method,
	endpoint: string,
	auth: boolean,
	data?: any
): Promise<AxiosResponse<any>> {
	const url = `${process.env.VUE_APP_API_URL}/${endpoint}`;
	const headers = {
		Accept: "application/json",
		Authorization: auth
			? `Bearer ${localStorage.getItem(Constants.JWT_KEY)}`
			: undefined,
	};

	return axios.request({
		method: method,
		url: url,
		headers: headers,
		data: data,
	});
}
