use axum::extract::State;
use axum::{Json, Router, routing::get};

use crate::error::Error;
use crate::state::AppState;

pub fn create_router() -> Router<AppState> {
    Router::new().route("/", get(get_categories))
}

async fn get_categories(state: State<AppState>) -> Result<Json<Vec<String>>, Error> {
    Ok(Json(state.db.get_all_categories().await?))
}
