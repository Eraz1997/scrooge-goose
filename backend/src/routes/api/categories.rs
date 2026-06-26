use axum::{Extension, Json, Router, routing::get};

use crate::error::Error;
use crate::state::AppState;

pub fn create_router() -> Router {
    Router::new().route("/categories", get(get_categories))
}

async fn get_categories(state: Extension<AppState>) -> Result<Json<Vec<String>>, Error> {
    Ok(Json(state.db.get_all_categories().await?))
}
