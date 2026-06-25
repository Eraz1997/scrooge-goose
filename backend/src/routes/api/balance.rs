use axum::{Extension, Json, Router, routing::get};

use crate::error::Error;
use crate::managers::db::{DbManager, models::Balance};

pub fn create_router() -> Router {
    Router::new().route("/", get(get_balance))
}

async fn get_balance(db_manager: Extension<DbManager>) -> Result<Json<Vec<Balance>>, Error> {
    Ok(Json(db_manager.get_balance().await?))
}
