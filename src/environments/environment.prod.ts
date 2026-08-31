const version = 'api/v1/';
const domain = 'localhost:3000/';
const frontenddomain = 'localhost:3000/';

// export const environment = {
//     production: false,
//     ENABLE_ENCRYPTION: false,
//     API_BASE_URL: 'http://' + domain + version,
//     SACNNING_BASE_URL: 'http://' + frontenddomain,
    
// };

// const version = 'api/v1/';
// const domain = 'truck-driver-backend-dpa1.onrender.com/';
// const frontenddomain = 'https://jmbaxi-safety.web.app/';

// export const environment = {
//     production: false,
//     ENABLE_ENCRYPTION: false,
//     API_BASE_URL: 'https://' + domain + version,
//     SACNNING_BASE_URL: frontenddomain
// };

// const version = 'api/v1/';
// const domain = '10.1.190.237/';
// const frontenddomain = '10.1.190.237/';

export const environment = {
    production: true,
    ENABLE_ENCRYPTION: false,
    API_BASE_URL: 'http://' + domain + version,
    SACNNING_BASE_URL: 'http://' + frontenddomain,
    maxVideoSizeMB: 50,
};

