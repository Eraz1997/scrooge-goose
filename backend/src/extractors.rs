use axum::{
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};

use crate::state::AppState;

pub struct CurrentUser {
    pub username: String,
}

impl FromRequestParts<AppState> for CurrentUser {
    type Rejection = (StatusCode, String);

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        if state.is_development {
            return Ok(CurrentUser {
                username: "Dev User".to_string(),
            });
        }

        let username = parts
            .headers
            .get("X-Kiwi-Username")
            .cloned()
            .and_then(|host_header| {
                host_header
                    .to_str()
                    .ok()
                    .map(|header_value| header_value.to_string())
            });

        if let Some(username) = username {
            Ok(CurrentUser { username })
        } else {
            Err((
                StatusCode::FORBIDDEN,
                "You must be authenticated to access this app.".to_string(),
            ))
        }
    }
}
