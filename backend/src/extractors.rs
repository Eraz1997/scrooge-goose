use axum::{
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};

pub struct CurrentUser {
    pub id: i64,
    pub username: String,
}

impl<State> FromRequestParts<State> for CurrentUser
where
    State: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _: &State) -> Result<Self, Self::Rejection> {
        let id = parts
            .headers
            .get("X-Kiwi-User-Id")
            .cloned()
            .and_then(|header| {
                header
                    .to_str()
                    .ok()
                    .map(|header_value| header_value.to_string())
            })
            .and_then(|header| header.parse::<i64>().ok());
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

        if let (Some(id), Some(username)) = (id, username) {
            Ok(CurrentUser { id, username })
        } else {
            Err((
                StatusCode::FORBIDDEN,
                "You must be authenticated to access this app.".to_string(),
            ))
        }
    }
}
