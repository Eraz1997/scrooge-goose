use axum::{
    Extension, Json, Router,
    extract::Path,
    routing::{delete, get, post, put},
};
use uuid::Uuid;

use crate::{
    error::Error,
    managers::db::{DbManager, models::Expense},
};

pub fn create_router() -> Router {
    Router::new()
        .route("/expenses", get(get_expenses))
        .route("/expenses/{id}", get(get_expense))
        .route("/expenses", post(add_expense))
        .route("/expenses", put(edit_expense))
        .route("/expenses/{id}", delete(delete_expense))
}

async fn get_expenses(db_manager: Extension<DbManager>) -> Result<Json<Vec<Expense>>, Error> {
    Ok(Json(db_manager.get_all_expenses().await?))
}

async fn get_expense(
    db_manager: Extension<DbManager>,
    Path(id): Path<Uuid>,
) -> Result<Json<Expense>, Error> {
    let expense = db_manager
        .get_expense(&id)
        .await?
        .ok_or(Error::not_found("expense"))?;
    Ok(Json(expense))
}

async fn add_expense(
    db_manager: Extension<DbManager>,
    Json(expense): Json<Expense>,
) -> Result<(), Error> {
    db_manager.add_expense(&expense).await
}

async fn edit_expense(
    db_manager: Extension<DbManager>,
    Json(expense): Json<Expense>,
) -> Result<(), Error> {
    db_manager.edit_expense(&expense).await
}

async fn delete_expense(
    db_manager: Extension<DbManager>,
    Path(id): Path<Uuid>,
) -> Result<(), Error> {
    db_manager.delete_expense(&id).await
}
