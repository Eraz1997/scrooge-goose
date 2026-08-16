use serde::Serialize;

use crate::managers::db::models::{Balance, Expense};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HomeData {
    pub balance: Vec<Balance>,
    pub expenses: Vec<Expense>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExpenseData {
    pub expense: Expense,
}
