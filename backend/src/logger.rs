use crate::settings::Settings;

pub struct Logger {
    log_level: tracing::Level,
}

impl Logger {
    pub fn new(settings: &Settings) -> Self {
        Self {
            log_level: settings.log_level,
        }
    }

    pub fn init(&self) {
        tracing_subscriber::fmt()
            .with_max_level(self.log_level)
            .init();
    }
}
