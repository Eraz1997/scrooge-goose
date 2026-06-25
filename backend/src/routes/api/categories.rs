use axum::{Extension, Json, Router, routing::get};

use crate::error::Error;
use crate::managers::db::DbManager;

pub fn create_router() -> Router {
    Router::new().route("/categories", get(get_categories))
}

async fn get_categories(db_manager: Extension<DbManager>) -> Result<Json<Vec<String>>, Error> {
    Ok(Json(db_manager.get_all_categories().await?))
}
