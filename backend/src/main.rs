use crate::error::Error;
use crate::logger::Logger;
use crate::managers::db::DbManager;
use crate::server::Server;
use crate::settings::Settings;
use crate::state::AppState;
use axum::Extension;
use axum::extract::DefaultBodyLimit;
use axum::http::{HeaderName, HeaderValue};
use clap::Parser;
use reqwest::Method;
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use routes::create_router;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

mod error;
mod extractors;
mod logger;
mod managers;
mod routes;
mod server;
mod services;
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
        storage_path: settings.static_files_path.clone(),
        db: db_manager,
    };

    let cors_layer = if settings.is_development() {
        CorsLayer::new()
            .allow_origin("http://localhost:3000".parse::<HeaderValue>()?)
            .allow_credentials(true)
            .allow_methods([
                Method::GET,
                Method::HEAD,
                Method::OPTIONS,
                Method::PATCH,
                Method::POST,
                Method::PUT,
                Method::DELETE,
            ])
            .allow_private_network(true)
            .allow_headers([
                "x-kiwi-user-id".parse::<HeaderName>()?,
                "x-kiwi-username".parse::<HeaderName>()?,
                AUTHORIZATION,
                CONTENT_TYPE,
            ])
    } else {
        CorsLayer::new()
    };

    let app = create_router(&settings)
        .layer(TraceLayer::new_for_http())
        .layer(DefaultBodyLimit::disable())
        .layer(cors_layer)
        .layer(Extension(app_state));

    Server::new(&settings).start(&app).await?;

    Ok(())
}
