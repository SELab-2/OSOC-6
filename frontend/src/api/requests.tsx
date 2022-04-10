import axios from 'axios';
import pathNames from '../properties/pathNames';

export async function getBasePost(url: string, data: any, contentType: string) {
    return axios({
        method: 'post',
        url: url,
        baseURL: pathNames.base,
        data: data,
        headers: {
            'Content-Type': contentType,
            'access-control-allow-origin': '*',
        },
    });
}

export async function getFormPost(url: string, data: FormData) {
    return getBasePost(url, data, 'multipart/form-data');
}
