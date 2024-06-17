// Author: Mario Guriuc

const API_URL = 'http://localhost:8000/api';
const API_LOGIN_URL = `${API_URL}/login`;
const API_REGISTER_URL = `${API_URL}/register`;
const API_CENTERS_URL = `${API_URL}/centers/{page_number}`;
const API_CENTERS_COUNT_URL = `${API_URL}/centers/count`;
const API_ACCOUNT_URL = `${API_URL}/account/{username}`;
const API_ADD_CENTER_URL = `${API_URL}/centers`;
const API_FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`;
const API_VERIFY_PASSWORD_URL = `${API_URL}/verify-password`;
const API_CHANGE_PASSWORD_URL = `${API_URL}/{username}/change-password`;

const FRONTEND_URL = 'http://localhost:8001';
const FRONT_CENTERS_URL = `${FRONTEND_URL}/centers`;
const FRONT_EDIT_ACCOUNT_URL = `${FRONTEND_URL}/account/{username}/edit-account`;
const FRONT_DELETE_ACCOUNT_URL = `${FRONTEND_URL}/account/{username}/delete-account`;
const FRONT_ACCOUNT_URL = `${FRONTEND_URL}/account/{username}`;
const FRONT_ADMIN_URL = `${FRONTEND_URL}/account/{username}/admin-page`;
const FRONT_CHANGE_PASSWORD_URL = `${FRONTEND_URL}/account/{username}/change-password`;

export {
    API_LOGIN_URL,
    API_REGISTER_URL,
    API_CENTERS_URL,
    API_CENTERS_COUNT_URL,
    API_ACCOUNT_URL,
    API_ADD_CENTER_URL,
    API_FORGOT_PASSWORD_URL,
    API_VERIFY_PASSWORD_URL,
    API_CHANGE_PASSWORD_URL,
};

export {
    FRONT_EDIT_ACCOUNT_URL,
    FRONT_DELETE_ACCOUNT_URL,
    FRONT_CENTERS_URL,
    FRONT_ACCOUNT_URL,
    FRONT_ADMIN_URL,
    FRONT_CHANGE_PASSWORD_URL,
};

//VLAD --------------------------------------------------------------------------------------------------------------
//BACKEND
const API_INMATES_COUNT_URL = `${API_URL}/centers/{center_id}/inmates/count`;
const API_INMATES_URL = `${API_URL}/centers/{center_id}/inmates`;
const API_ADD_INMATES_URL = `${API_URL}/centers/{center_id}/add-inmate`;
const API_EDIT_VISIT_URL = `${API_URL}/visits/{visit_id}`;
const API_VISIT_STATUS_URL = `${API_URL}/visits/{visit_id}/status`;
const API_VISITS_URL = `${API_URL}/account/{username}/visits`;
const API_ADD_VISIT_URL = `${API_URL}/centers/{center_id}/inmates/{inmate_id}/add-visit`;
//FRONTEND
const FRONT_VISITS_URL = `${FRONTEND_URL}/account/{username}/visits`;
const FRONT_ADD_VISIT_URL = `${FRONTEND_URL}/centers/{center_id}/inmates/{inmate_id}/add-visit`;
const FRONT_EDIT_VISIT_URL = `${FRONTEND_URL}/account/{username}/visits/{visit_id}`;
const FRONT_ADD_INMATE_URL = `${FRONTEND_URL}/centers/{center_id}/add-inmate`;
const FRONT_INMATES_URL = `${FRONTEND_URL}/centers/{center_id}/inmates`;

export {
    API_EDIT_VISIT_URL,
    FRONT_EDIT_VISIT_URL,
    FRONT_ADD_VISIT_URL,
    API_VISITS_URL,
    FRONT_VISITS_URL,
    API_ADD_VISIT_URL,
    API_VISIT_STATUS_URL,
    FRONT_INMATES_URL,
    API_INMATES_URL,
    API_INMATES_COUNT_URL,
    API_ADD_INMATES_URL,
    FRONT_ADD_INMATE_URL,
};