use crate::error::Error;
use crate::logger::Logger;
use crate::managers::db::DbManager;
use crate::middlewares::authentication_middleware;
use crate::server::Server;
use crate::settings::Settings;
use crate::state::AppState;
use axum::extract::DefaultBodyLimit;
use axum::middleware;
use clap::Parser;
use kangaroo_axum::{KangarooConfig, KangarooRouterExtension};
use routes::create_router;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

mod error;
mod extractors;
mod logger;
mod managers;
mod middlewares;
mod routes;
mod server;
mod settings;
mod state;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let settings = Settings::parse();

    Logger::new(&settings).init();

    let db_manager = DbManager::new(&settings.kiwi_postgres_uri).await?;

    let authorised_users: Vec<String> = serde_json::from_str(&settings.kiwi_authorised_users)
        .map_err(|error| Error::bad_environment_variable("KIWI_AUTHORISED_USERS", error))?;

    let app_state = AppState {
        authorised_users,
        db: db_manager,
        is_development: settings.is_development(),
    };

    let app = create_router()
        .layer(TraceLayer::new_for_http())
        .layer(DefaultBodyLimit::disable())
        .layer(CorsLayer::new())
        .layer(middleware::from_fn_with_state(
            app_state.clone(),
            authentication_middleware,
        ))
        .with_state(app_state)
        .with_kangaroo(
            KangarooConfig::new(&settings.static_files_path)
                .with_frontend_development_server(settings.get_frontend_development_server_uri()),
        );

    Server::new(&settings).start(&app).await?;

    Ok(())
}
