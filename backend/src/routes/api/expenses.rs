use axum::{
    Json, Router,
    extract::{Path, State},
    routing::{delete, get, post, put},
};
use uuid::Uuid;

use crate::{error::Error, managers::db::models::Expense, state::AppState};

pub fn create_router() -> Router<AppState> {
    Router::new()
        .route("/", get(get_expenses))
        .route("/{id}", get(get_expense))
        .route("/", post(add_expense))
        .route("/", put(edit_expense))
        .route("/{id}", delete(delete_expense))
}

async fn get_expenses(state: State<AppState>) -> Result<Json<Vec<Expense>>, Error> {
    Ok(Json(state.db.get_all_expenses().await?))
}

async fn get_expense(state: State<AppState>, Path(id): Path<Uuid>) -> Result<Json<Expense>, Error> {
    let expense = state
        .db
        .get_expense(&id)
        .await?
        .ok_or(Error::not_found("expense"))?;
    Ok(Json(expense))
}

async fn add_expense(state: State<AppState>, Json(expense): Json<Expense>) -> Result<(), Error> {
    state.db.add_expense(&expense).await
}

async fn edit_expense(state: State<AppState>, Json(expense): Json<Expense>) -> Result<(), Error> {
    state.db.edit_expense(&expense).await
}

async fn delete_expense(state: State<AppState>, Path(id): Path<Uuid>) -> Result<(), Error> {
    state.db.delete_expense(&id).await
}
