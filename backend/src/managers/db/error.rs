use crate::error::Error;
use axum::http::StatusCode;

impl Error {
    pub fn db_connection_test() -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: "database connection test failed".to_string(),
        }
    }
}
