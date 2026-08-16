use axum::{Router, routing::get};

use crate::state::AppState;

pub fn create_router() -> Router<AppState> {
    Router::new().route("/health", get(get_health))
}

async fn get_health() -> String {
    "Alive :)".to_string()
}
