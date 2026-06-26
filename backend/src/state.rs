use crate::managers::db::DbManager;

#[derive(Clone)]
pub struct AppState {
    pub authorised_users: Vec<String>,
    pub db: DbManager,
}
