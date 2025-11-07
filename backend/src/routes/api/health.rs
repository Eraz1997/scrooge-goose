use axum::{Router, routing::get};

pub fn create_router() -> Router {
    Router::new().route("/health", get(get_health))
}

async fn get_health() -> String {
    "Alive :)".to_string()
}
