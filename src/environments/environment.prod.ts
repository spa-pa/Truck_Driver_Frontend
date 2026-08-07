const version = 'api/v1/';
const domain = 'localhost:3000/';
const frontenddomain = 'localhost:3000/';

export const environment = {
    production: true,
    ENABLE_ENCRYPTION: false,
    API_BASE_URL: 'http://' + domain + version,
    SACNNING_BASE_URL: 'http://' + frontenddomain,
    
};

