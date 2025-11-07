use crate::error::Error;
use crate::logger::Logger;
use crate::managers::db::DbManager;
use crate::server::Server;
use crate::settings::Settings;
use axum::Extension;
use axum::extract::DefaultBodyLimit;
use clap::Parser;
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

#[tokio::main]
async fn main() -> Result<(), Error> {
    let settings = Settings::parse();

    Logger::new(&settings).init();

    let db_manager = DbManager::new(&settings.kiwi_postgres_uri).await?;

    let app = create_router(&settings)
        .layer(TraceLayer::new_for_http())
        .layer(DefaultBodyLimit::disable())
        .layer(CorsLayer::permissive())
        .layer(Extension(db_manager));

    Server::new(&settings).start(&app).await?;

    Ok(())
}
