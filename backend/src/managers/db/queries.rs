use crate::{
    error::Error,
    managers::db::{DbManager, models::User},
};

impl DbManager {
    pub async fn register_user(&self, user: &User) -> Result<(), Error> {
        let client = self.connection_pool.get().await?;
        let statement = client
            .prepare_cached(
                "INSERT INTO users (id, username) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING",
            )
            .await?;
        client
            .execute(&statement, &[&user.id, &user.username])
            .await?;

        Ok(())
    }
}
