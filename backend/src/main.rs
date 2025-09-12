use crate::error::Error;
use crate::logger::Logger;
use crate::managers::local_http::LocalHttpManager;
use crate::server::Server;
use crate::settings::Settings;
use axum::Extension;
use axum::extract::DefaultBodyLimit;
use clap::Parser;
use routes::create_router;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

mod error;
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

    let local_http_manager = LocalHttpManager::new(&settings)?;

    let app = create_router(&settings)
        .layer(TraceLayer::new_for_http())
        .layer(DefaultBodyLimit::disable())
        .layer(CorsLayer::default())
        .layer(Extension(local_http_manager));

    Server::new(&settings).start(&app).await?;

    Ok(())
}
