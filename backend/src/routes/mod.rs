use axum::Router;
use axum::extract::{Path, State};
use axum::routing::get;
use kangaroo_axum::{IntoKangarooError, kangarooise};
use uuid::Uuid;

use crate::error::Error;
use crate::routes::models::{ExpenseData, HomeData};
use crate::state::AppState;

mod api;
mod models;

pub fn create_router() -> Router<AppState> {
    Router::new()
        .nest("/api", api::create_router())
        .route("/", get(get_home))
        .route("/expenses/new", get(get_new_expense))
        .route("/expenses/{id}", get(get_expense))
}

#[kangarooise]
async fn get_home(state: State<AppState>) -> Result<HomeData, Error> {
    Ok(HomeData {
        balance: state.db.get_balance().await?,
        expenses: state.db.get_all_expenses().await?,
    })
}

#[kangarooise]
async fn get_new_expense() {}

#[kangarooise]
async fn get_expense(state: State<AppState>, Path(id): Path<Uuid>) -> Result<ExpenseData, Error> {
    let expense = state
        .db
        .get_expense(&id)
        .await?
        .ok_or(Error::not_found("expense"))?;
    Ok(ExpenseData { expense })
}
