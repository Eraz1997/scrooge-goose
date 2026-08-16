use axum::{
    extract::{Request, State},
    middleware::Next,
    response::{IntoResponse, Response},
};

use crate::{error::Error, extractors::CurrentUser, state::AppState};

pub async fn authentication_middleware(
    current_user: CurrentUser,
    state: State<AppState>,
    request: Request,
    next: Next,
) -> Response {
    if !state.is_development && !state.authorised_users.contains(&current_user.username) {
        Error::unauthorised_user().into_response()
    } else {
        next.run(request).await
    }
}
