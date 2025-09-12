use std::task::{Context, Poll};

use axum::{
    body::Body,
    http::{Request, Uri, uri::PathAndQuery},
};
use tower::Service;
use tower_http::services::ServeDir;

#[derive(Clone)]
pub struct ServeStaticWebApp {
    service: ServeDir,
}

impl ServeStaticWebApp {
    pub fn new(static_assets_path: &str) -> Self {
        let service = ServeDir::new(static_assets_path);
        Self { service }
    }
}

impl Service<Request<Body>> for ServeStaticWebApp {
    type Response = <ServeDir as Service<Request<Body>>>::Response;
    type Error = <ServeDir as Service<Request<Body>>>::Error;
    type Future = <ServeDir as Service<Request<Body>>>::Future;

    fn poll_ready(&mut self, context: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        <tower_http::services::ServeDir as tower::Service<axum::http::Request<Body>>>::poll_ready(
            &mut self.service,
            context,
        )
    }

    fn call(&mut self, request: Request<Body>) -> Self::Future {
        let path = request.uri().path().to_string();
        let path_end = path
            .split("/")
            .last()
            .map(|part| part.to_string())
            .unwrap_or_default();

        let request = if path_end.contains(".") {
            request
        } else {
            let mut uri_parts = request.uri().clone().into_parts();
            uri_parts.path_and_query = Some(PathAndQuery::from_static("/"));
            let (mut request_parts, body) = request.into_parts();
            request_parts.uri = Uri::from_parts(uri_parts).unwrap_or_default();
            Request::from_parts(request_parts, body)
        };

        self.service.call(request)
    }
}
