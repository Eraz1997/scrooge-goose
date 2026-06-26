use axum::{
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};

pub struct CurrentUser {
    pub username: String,
}

impl<State> FromRequestParts<State> for CurrentUser
where
    State: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _: &State) -> Result<Self, Self::Rejection> {
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
