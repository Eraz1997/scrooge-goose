use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use deadpool_postgres::{CreatePoolError, PoolError};
use reqwest::header::{InvalidHeaderName, InvalidHeaderValue};
use std::fmt::{Display, Formatter};

#[derive(Debug, Clone)]
pub struct Error {
    pub code: StatusCode,
    pub message: String,
}

impl Display for Error {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        write!(formatter, "Error {}: {}", self.code, self.message)
    }
}

impl Error {
    pub fn bad_environment_variable(name: &str, error: impl Display) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: format!("{} is not valid: {}", name, error),
        }
    }

    pub fn not_found(object_name: &str) -> Self {
        Self {
            code: StatusCode::NOT_FOUND,
            message: format!("{} not found", object_name),
        }
    }
}

impl std::error::Error for Error {}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let message = if self.code == StatusCode::INTERNAL_SERVER_ERROR {
            tracing::error!("{}", self);
            "internal server error".to_string()
        } else {
            self.message
        };
        (self.code, message).into_response()
    }
}

impl From<std::io::Error> for Error {
    fn from(error: std::io::Error) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<reqwest::Error> for Error {
    fn from(error: reqwest::Error) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<CreatePoolError> for Error {
    fn from(error: CreatePoolError) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<PoolError> for Error {
    fn from(error: PoolError) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<tokio_postgres::Error> for Error {
    fn from(error: tokio_postgres::Error) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<refinery::Error> for Error {
    fn from(error: refinery::Error) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<serde_json::Error> for Error {
    fn from(error: serde_json::Error) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<InvalidHeaderValue> for Error {
    fn from(error: InvalidHeaderValue) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}

impl From<InvalidHeaderName> for Error {
    fn from(error: InvalidHeaderName) -> Self {
        Self {
            code: StatusCode::INTERNAL_SERVER_ERROR,
            message: error.to_string(),
        }
    }
}
