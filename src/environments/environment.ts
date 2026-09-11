const version = 'api/v1/';
const domain = 'localhost:3000/';
const frontenddomain = 'localhost:4200/';

export const environment = {
    production: false,
    ENABLE_ENCRYPTION: false,
    API_BASE_URL: 'http://' + domain + version,
    SACNNING_BASE_URL: 'http://' + frontenddomain,
    maxVideoSizeMB: 50,
};

// const version = 'api/v1/';
// const domain = 'visitorsafetyinductionapplication.jmbaxi.com/';
// const frontenddomain = 'visitorsafetyinductionapplication.jmbaxi.com/';

// export const environment = {
//     production: false,
//     ENABLE_ENCRYPTION: false,
//     API_BASE_URL: 'https://' + domain + version,
//     SACNNING_BASE_URL: 'https://' + frontenddomain,
//     maxVideoSizeMB: 50,
// };
