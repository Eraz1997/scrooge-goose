use axum::Router;

mod balance;
mod categories;
mod expenses;
mod health;

pub fn create_router() -> Router {
    Router::new()
        .nest("/balance", balance::create_router())
        .nest("/categories", categories::create_router())
        .nest("/expenses", expenses::create_router())
        .nest("/health", health::create_router())
}
