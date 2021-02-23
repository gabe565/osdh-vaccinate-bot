# osdh-vaccinate-notify

Sends notifications when vaccination bookings become available

## Usage

There is a docker-compose file available to make it easier to run. Just fill in the values and run:

```sh
docker-compose up -d
```

## Configuration

Can be configured via envs or as commnd line flags.

| Environment Variable | Runtime Flag            | Description                                                                 |
|----------------------|-------------------------|-----------------------------------------------------------------------------|
| `OSDH_ID`            | `--osdh-id <id>`        | ID issued from OSDH. Will be at the end of the URL that was emailed to you. |
| `BIRTH_YEAR`         | `--birth-year <year>`   | Four-digit birth year.                                                      |
| `BIRTH_MONTH`        | `--birth-month <month>` | Numeric birth month.                                                        |
| `BIRTH_DAY`          | `--birth-day <day>`     | Numeric birth day.                                                          |
| `HEADLESS`           | `--headless`            | Run browser in headless mode. Should be set to `true` if you use Docker.    |
| `TELEGRAM_BOT_TOKEN` | `--bot-token <token>`   | Telegram bot token for Telegram notifications.                              |
| `TELEGRAM_CHAT_ID`   | `--chat-id <id>`        | Telegram chat ID for Telegram notifications.                                |
| `SCHEDULE`           | `--schedule <schedule>` | Cron schedule.                                                              |
