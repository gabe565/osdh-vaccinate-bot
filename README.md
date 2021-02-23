# osdh-vaccinate-notify

Sends notifications when vaccination bookings become available

## Usage

There is a docker-compose file available to make it easier to run. Just fill in the values and run:

```sh
docker-compose up -d
```

Note if you run it locally then there can be problems with timezone conversion. If you can't ever get it to load the list of locations, either run it in Docker instead, or try manually setting the `TZ` env to `Etc/UTC`.


## Configuration

Can be configured via envs or as commnd line flags.

| Environment Variable | Runtime Flag            | Description                                                                 |
|----------------------|-------------------------|-----------------------------------------------------------------------------|
| `OSDH_ID`            | `--osdh-id <id>`        | ID issued from OSDH. Will be at the end of the URL that was emailed to you. |
| `BIRTHDATE`          | `--birthdate <date>`    | Your birth date.                                                            |
| `HEADLESS`           | `--headless`            | Run browser in headless mode. Should be set to `true` if you use Docker.    |
| `TELEGRAM_BOT_TOKEN` | `--bot-token <token>`   | Telegram bot token for Telegram notifications.                              |
| `TELEGRAM_CHAT_ID`   | `--chat-id <id>`        | Telegram chat ID for Telegram notifications.                                |
| `SCHEDULE`           | `--schedule <schedule>` | Cron schedule.                                                              |
