# osdh-vaccinate-notify

Sends notifications when vaccination bookings become available

## Configuration

Can be configured via envs or as commnd line flags.

| Environment Variable | Runtime Flag            | Description                                                          |
|----------------------|-------------------------|----------------------------------------------------------------------|
| `OSDH_ID`            | `--osdh-id <id>`        | ID issued from OSDH. Will be at the end of the URL that was emailed. |
| `BIRTHDATE`          | `--birthdate <date>`    | Your birth date.                                                     |
| `HEADLESS`           | `--headless`            | Run in headless mode.                                                |
| `TELEGRAM_BOT_TOKEN` | `--bot-token <token>`   | Telegram bot token for Telegram notifications.                       |
| `TELEGRAM_CHAT_ID`   | `--chat-id <id>`        | Telegram chat ID for Telegram notifications.                         |
| `SCHEDULE`           | `--schedule <schedule>` | Cron schedule.                                                       |
