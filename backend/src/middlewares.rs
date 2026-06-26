use axum::{
    Extension,
    extract::Request,
    middleware::Next,
    response::{IntoResponse, Response},
};

use crate::{error::Error, extractors::CurrentUser, state::AppState};

pub async fn authentication_middleware(
    current_user: CurrentUser,
    state: Extension<AppState>,
    request: Request,
    next: Next,
) -> Response {
    if !state.authorised_users.contains(&current_user.username) {
        Error::unauthorised_user().into_response()
    } else {
        next.run(request).await
    }
}
