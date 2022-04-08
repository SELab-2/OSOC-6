import axios from "axios";

export async function getBasePost(url: string, data: any, contentType: string) {
    return axios({
        method: 'post',
        url: '/api/login-processing',
        data: data,
        headers: {
            'Content-Type': contentType,
            'access-control-allow-origin': '*',
        },
    });
}

export async function getFormPost(url: string, data: FormData) {
    return getBasePost(url, data, 'multipart/form-data')
}