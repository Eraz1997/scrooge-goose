use axum::{Extension, Router, routing::post};

use crate::{
    error::Error,
    extractors::CurrentUser,
    managers::db::{DbManager, models::User},
};

pub fn create_router() -> Router {
    Router::new().route("/self-register", post(self_register))
}

async fn self_register(
    current_user: CurrentUser,
    db_manager: Extension<DbManager>,
) -> Result<(), Error> {
    let user: User = User {
        id: current_user.id,
        username: current_user.username,
    };

    db_manager.register_user(&user).await
}
