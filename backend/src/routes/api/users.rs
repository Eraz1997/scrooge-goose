use axum::{Extension, Json, Router, routing::get};

use crate::error::Error;
use crate::state::AppState;

pub fn create_router() -> Router {
    Router::new().route("/", get(get_all_user_names))
}

async fn get_all_user_names(state: Extension<AppState>) -> Result<Json<Vec<String>>, Error> {
    Ok(Json(state.db.get_all_user_names().await?))
}
