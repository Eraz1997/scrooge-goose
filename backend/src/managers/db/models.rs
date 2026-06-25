use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use tokio_postgres::Row;
use uuid::Uuid;

use crate::error::Error;

#[derive(Serialize, Deserialize)]
pub struct Balance {
    pub user_name: String,
    pub amount_euros: f32,
}

#[derive(Serialize, Deserialize)]
pub struct ExpensePayement {
    pub amount_euros: f32,
    pub borrower_user_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct Expense {
    pub id: Uuid,
    pub lender_user_name: String,
    pub title: String,
    pub long_description: Option<String>,
    pub category: String,
    pub created_at: NaiveDateTime,
    pub payments: Vec<ExpensePayement>,
}

impl TryFrom<Row> for Expense {
    type Error = Error;

    fn try_from(value: Row) -> Result<Self, Self::Error> {
        let payments_serialised = value.try_get::<&str, String>("payments")?;
        let payments: Vec<ExpensePayement> = serde_json::from_str(&payments_serialised)?;

        Ok(Self {
            id: value.try_get("id")?,
            lender_user_name: value.try_get("lender_user_name")?,
            title: value.try_get("title")?,
            long_description: value.try_get("long_description")?,
            category: value.try_get("category")?,
            created_at: value.try_get("created_at")?,
            payments,
        })
    }
}

impl TryFrom<Row> for Balance {
    type Error = Error;

    fn try_from(value: Row) -> Result<Self, Self::Error> {
        Ok(Self {
            user_name: value.try_get("user_name")?,
            amount_euros: value.try_get("amount_euros")?,
        })
    }
}
