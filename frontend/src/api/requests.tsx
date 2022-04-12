import pathNames from "../properties/pathNames";

export const AxiosConf = { baseURL: pathNames.base };

export const AxiosFormConfig = {
    baseURL: pathNames.base,
    headers: {
        "Content-Type": "multipart/form-data",
        "access-control-allow-origin": "*",
    },
};
