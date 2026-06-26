use axum::{
    Extension, Json, Router,
    extract::Path,
    routing::{delete, get, post, put},
};
use uuid::Uuid;

use crate::{error::Error, managers::db::models::Expense, state::AppState};

pub fn create_router() -> Router {
    Router::new()
        .route("/expenses", get(get_expenses))
        .route("/expenses/{id}", get(get_expense))
        .route("/expenses", post(add_expense))
        .route("/expenses", put(edit_expense))
        .route("/expenses/{id}", delete(delete_expense))
}

async fn get_expenses(state: Extension<AppState>) -> Result<Json<Vec<Expense>>, Error> {
    Ok(Json(state.db.get_all_expenses().await?))
}

async fn get_expense(
    state: Extension<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Expense>, Error> {
    let expense = state
        .db
        .get_expense(&id)
        .await?
        .ok_or(Error::not_found("expense"))?;
    Ok(Json(expense))
}

async fn add_expense(
    state: Extension<AppState>,
    Json(expense): Json<Expense>,
) -> Result<(), Error> {
    state.db.add_expense(&expense).await
}

async fn edit_expense(
    state: Extension<AppState>,
    Json(expense): Json<Expense>,
) -> Result<(), Error> {
    state.db.edit_expense(&expense).await
}

async fn delete_expense(state: Extension<AppState>, Path(id): Path<Uuid>) -> Result<(), Error> {
    state.db.delete_expense(&id).await
}
