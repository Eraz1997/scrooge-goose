use axum::Router;

mod health;
mod users;

pub fn create_router() -> Router {
    Router::new()
        .nest("/health", health::create_router())
        .nest("/users", users::create_router())
}
