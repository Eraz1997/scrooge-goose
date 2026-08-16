use axum::Router;

use crate::state::AppState;

mod balance;
mod categories;
mod expenses;
mod health;
mod users;

pub fn create_router() -> Router<AppState> {
    Router::new()
        .nest("/balance", balance::create_router())
        .nest("/categories", categories::create_router())
        .nest("/expenses", expenses::create_router())
        .nest("/health", health::create_router())
        .nest("/users", users::create_router())
}
