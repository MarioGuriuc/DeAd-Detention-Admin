// Author: Mario Guriuc

const API_URL = 'http://localhost:8000/api';
const FRONTEND_URL = 'http://localhost:8001';

const API_LOGIN_URL = `${API_URL}/login`;
const API_REGISTER_URL = `${API_URL}/register`;
const API_CENTERS_URL = `${API_URL}/centers/page/{page_number}`;
const API_CENTERS_COUNT_URL = `${API_URL}/centers/count`;
const API_ACCOUNT_URL = `${API_URL}/account/{username}`;
const API_ADD_CENTER_URL = `${API_URL}/centers`;
const API_FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`;
const API_CHANGE_PASSWORD_URL = `${API_URL}/{username}/change-password`;
const API_CHANGE_ROLE_URL = `${API_URL}/{username}/change-role`;
const API_VERIFY_JWT = `${API_URL}/verify-jwt`;
const API_GET_USERNAME = `${API_URL}/get-username`;
const API_LOGOUT_URL = `${API_URL}/logout`;
const API_VERIFY_ADMIN = `${API_URL}/verify-admin`;

const FRONT_CENTERS_URL = `${FRONTEND_URL}/centers`;
const FRONT_EDIT_ACCOUNT_URL = `${FRONTEND_URL}/account/{username}/edit-account`;
const FRONT_DELETE_ACCOUNT_URL = `${FRONTEND_URL}/account/{username}/delete-account`;
const FRONT_ACCOUNT_URL = `${FRONTEND_URL}/account/{username}`;
const FRONT_ADMIN_URL = `${FRONTEND_URL}/account/{username}/admin-page`;
const FRONT_CHANGE_PASSWORD_URL = `${FRONTEND_URL}/account/{username}/change-password`;
const FRONT_CHANGE_ROLE_URL = `${FRONTEND_URL}/account/{username}/change-role`;

export {
    API_LOGIN_URL,
    API_REGISTER_URL,
    API_CENTERS_URL,
    API_CENTERS_COUNT_URL,
    API_ACCOUNT_URL,
    API_ADD_CENTER_URL,
    API_FORGOT_PASSWORD_URL,
    API_CHANGE_PASSWORD_URL,
    API_CHANGE_ROLE_URL,
    API_VERIFY_JWT,
    API_GET_USERNAME,
    API_LOGOUT_URL,
    API_VERIFY_ADMIN,
};

export {
    FRONT_EDIT_ACCOUNT_URL,
    FRONT_DELETE_ACCOUNT_URL,
    FRONT_CENTERS_URL,
    FRONT_ACCOUNT_URL,
    FRONT_ADMIN_URL,
    FRONT_CHANGE_PASSWORD_URL,
    FRONT_CHANGE_ROLE_URL,
};

//VLAD
const API_INMATES_COUNT_URL = `${API_URL}/centers/{center_id}/inmates/count`;
const API_INMATES_URL = `${API_URL}/centers/{center_id}/inmates`;
const API_ADD_INMATES_URL = `${API_URL}/centers/{center_id}/add-inmate`;
const API_EDIT_VISIT_URL = `${API_URL}/visits/{visit_id}`;
const API_VISIT_STATUS_URL = `${API_URL}/visits/{visit_id}/status`;
const API_VISITS_URL = `${API_URL}/account/{username}/visits`;
const API_ADD_VISIT_URL = `${API_URL}/centers/{center_id}/inmates/{inmate_id}/add-visit`;
const API_STATISTICS_URL = `${API_URL}/statistics/{center_id}/{inmate_id}/{start_date}/{end_date}`;
const API_DELETE_INMATE_URL = `${API_URL}/centers/{center_id}/inmates/{inmate_id}/delete`;
const API_TRANSFER_INMATE_URL = `${API_URL}/centers/{center_id}/inmates/{inmate_id}/transfer`;
const API_EDIT_INMATE_URL = `${API_URL}/centers/{center_id}/inmates/{inmate_id}/edit`;
const API_DELETE_CENTER_URL = `${API_URL}/centers/{center_id}/delete`;
const API_EDIT_CENTER_URL = `${API_URL}/centers/{center_id}/edit`;
const API_ALL_CENTERS_URL = `${API_URL}/centers`;
const API_ONE_CENTER_URL = `${API_URL}/center/{center_id}`;

const FRONT_VISITS_URL = `${FRONTEND_URL}/account/{username}/visits`;
const FRONT_ADD_VISIT_URL = `${FRONTEND_URL}/centers/{center_id}/inmates/{inmate_id}/add-visit`;
const FRONT_EDIT_VISIT_URL = `${FRONTEND_URL}/account/{username}/visits/{visit_id}`;
const FRONT_ADD_INMATE_URL = `${FRONTEND_URL}/centers/{center_id}/add-inmate`;
const FRONT_INMATES_URL = `${FRONTEND_URL}/centers/{center_id}/inmates`;
const FRONT_ADD_CENTER_URL = `${FRONTEND_URL}/add-center`;
const FRONT_ADD_INMATE_ADMIN_URL = `${FRONTEND_URL}/add-inmate`;
const FRONT_STATISTICS_URL = `${FRONTEND_URL}/statistics`;
const FRONT_TRANSFER_INMATE_URL = `${FRONTEND_URL}/centers/{center_id}/inmates/{inmate_id}/transfer`;
const FRONT_EDIT_INMATE_URL = `${FRONTEND_URL}/centers/{center_id}/inmates/{inmate_id}/edit`;
const FRONT_EDIT_CENTER_URL = `${FRONTEND_URL}/centers/{center_id}/edit`;

export {
    API_ONE_CENTER_URL,
    API_ALL_CENTERS_URL,
    API_EDIT_CENTER_URL,
    API_DELETE_CENTER_URL,
    API_EDIT_INMATE_URL,
    API_TRANSFER_INMATE_URL,
    API_DELETE_INMATE_URL,
    API_STATISTICS_URL,
    API_EDIT_VISIT_URL,
    API_VISITS_URL,
    API_ADD_VISIT_URL,
    API_VISIT_STATUS_URL,
    API_INMATES_URL,
    API_INMATES_COUNT_URL,
    API_ADD_INMATES_URL,
};

export {
    FRONT_EDIT_CENTER_URL,
    FRONT_ADD_INMATE_URL,
    FRONT_ADD_CENTER_URL,
    FRONT_VISITS_URL,
    FRONT_INMATES_URL,
    FRONT_EDIT_VISIT_URL,
    FRONT_ADD_VISIT_URL,
    FRONT_STATISTICS_URL,
    FRONT_ADD_INMATE_ADMIN_URL,
    FRONT_TRANSFER_INMATE_URL,
    FRONT_EDIT_INMATE_URL,
};
