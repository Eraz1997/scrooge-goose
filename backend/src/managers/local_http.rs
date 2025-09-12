use axum::response::Response;
use reqwest::{Body, Client};

use crate::error::Error;
use crate::settings::Settings;

#[derive(Clone)]
pub struct LocalHttpManager {
    client: Client,
    dev_frontend_base_url: String,
}

impl LocalHttpManager {
    pub fn new(settings: &Settings) -> Result<Self, Error> {
        let client = Client::builder().https_only(false).build()?;
        let dev_frontend_base_url =
            format!("http://localhost:{}", settings.dev_frontend_server_port);

        tracing::info!("local http manager initialised");

        Ok(Self {
            client,
            dev_frontend_base_url,
        })
    }

    pub async fn get_dev_frontend_page(&self, path: String) -> Result<Response<Body>, Error> {
        let url = if path.starts_with("/") {
            format!("{}{}", self.dev_frontend_base_url, path)
        } else {
            format!("{}/{}", self.dev_frontend_base_url, path)
        };
        let response = self.client.get(url).send().await?;
        Ok(response.into())
    }
}
