use std::{ops::DerefMut, time::Duration};

use crate::error::Error;
use constants::MAX_POOL_SIZE;
use deadpool_postgres::{Config, ManagerConfig, Pool, PoolConfig, RecyclingMethod, Runtime};
use refinery::embed_migrations;
use tokio::time::sleep;
use tokio_postgres::NoTls;

pub mod constants;
pub mod error;
pub mod models;
pub mod queries;

#[derive(Clone)]
pub struct DbManager {
    connection_pool: Pool,
}

impl DbManager {
    pub async fn new(database_uri: &str) -> Result<Self, Error> {
        let mut config = Config::new();
        config.url = Some(database_uri.to_string());
        config.manager = Some(ManagerConfig {
            recycling_method: RecyclingMethod::Fast,
        });
        config.pool = Some(PoolConfig::new(MAX_POOL_SIZE));

        let pool = config.create_pool(Some(Runtime::Tokio1), NoTls)?;
        let db_manager = Self {
            connection_pool: pool.clone(),
        };

        for tentative_count in 1..=5 {
            tracing::info!("connecting to db, attempt {}/5", tentative_count);
            let connection_test_result = db_manager.test_connection().await;

            match connection_test_result {
                Ok(()) => break,
                Err(_) if tentative_count < 5 => {
                    sleep(Duration::from_secs(2 * tentative_count)).await;
                }
                Err(error) => {
                    return Err(error);
                }
            }
        }
        tracing::info!("connected to db");

        embed_migrations!("migrations");
        let mut migrations_client = pool.get().await?;
        let connection = migrations_client.deref_mut().deref_mut();
        let migrations_report = migrations::runner().run_async(connection).await?;
        let applied_migrations_count = migrations_report.applied_migrations().len();

        tracing::info!(
            "db manager initialised, applied {} migrations",
            applied_migrations_count
        );
        Ok(db_manager)
    }

    async fn test_connection(&self) -> Result<(), Error> {
        let test_connection_client = self.connection_pool.get().await?;
        let test_connection_statement = test_connection_client.prepare_cached("SELECT 1").await?;
        let rows = test_connection_client
            .query(&test_connection_statement, &[])
            .await?;
        let value: i32 = rows[0].get(0);

        if value == 1 {
            Ok(())
        } else {
            Err(Error::db_connection_test())
        }
    }
}
