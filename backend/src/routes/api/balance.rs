use axum::{Extension, Json, Router, routing::get};

use crate::error::Error;
use crate::managers::db::models::Balance;
use crate::state::AppState;

pub fn create_router() -> Router {
    Router::new().route("/", get(get_balance))
}

async fn get_balance(state: Extension<AppState>) -> Result<Json<Vec<Balance>>, Error> {
    Ok(Json(state.db.get_balance().await?))
}
