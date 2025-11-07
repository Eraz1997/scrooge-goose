use crate::services::ServeStaticWebApp;
use crate::settings::Settings;
use axum::Router;

mod api;

pub fn create_router(settings: &Settings) -> Router {
    let router = Router::new().nest("/api", api::create_router());

    if settings.is_development() {
        router
    } else {
        let static_service = ServeStaticWebApp::new(&settings.static_files_path);
        router
            .route_service("/", static_service.clone())
            .route_service("/{*path}", static_service)
    }
}
