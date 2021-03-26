# YAVAB
This is my Discord Bot called YAVAB, stands for Yet Another Very Awesome Bot. It was made for my uncles Discord server and maybe for my personal servers sometime in the future,  this used to be a private repo but now anybody can view/judge my code!

This is very fun and I plan to continue developing it for a while at least!

**Edit:** `YAVAB` stands for `Yet Another Very Awesome Bot`

# Usage
## Docker Compose *(recommended for ease of setup/modification)*
`docker-compose.yml`
```yml
---
version: "2.1"
services:
  yavab:
    image: ghcr.io/archgryphon9362/yavab
    container_name: yavab
    environment:
        - TOKEN=SBTRnyJ234N34B3B4324Tr78543s2nyrE2s4b66TTBV8Sr3e
        - BOT_NAME=YAVAB
        - BOT_PREFIX=/
        - GUILD_ID=69049503490904900
        - ENBALE_ASSISTANT=0
        - ASSISTANT_CHANNEL_ID=8324890290342908320
        - CLIENT_ID=2094390409-3nv90c3xm9o44c9l9l4ae9dds.apps.googleusercontent.com
        - CLIENT_SECRET=DFfg32fDFDFd54FD7yta8AS
        - REDIRECT_URI=slk:dsfr:bf:oauth:2.0:ofp
        - DISCORD_TOKENS={"access_token":"tl03.SFDGFGD697SGD_FDFgfGG-hHd889fgfSGHDn48rjnV--BNH9JufBb.DNht0468dYBTVS-g8bB","refresh_token":"1//eko43F-RE5GBnhg_fjvgb0v9mretv95DSGer446DFHGGfhjh33Gg4GGFG333hhgid8","scope":"https://www.googleapis.com/auth/assistant-sdk-prototype","token_type":"Bearer","expiry_date":1694202150748}
    volumes:
      - /path/to/filesave/directory:/usr/src/app/persist
    restart: unless-stopped
```

Next run this *(you can also run this to update the bot)*:

```sh
docker-compose up -d
```

## Docker CLI

```sh
docker pull ghcr.io/archgryphon9362/yavab:latest
docker run -d \
  --name=yavab \
  -e BOT_TOKEN=SBTRnyJ234N34B3B4324Tr78543s2nyrE2s4b66TTBV8Sr3e \
  -e BOT_NAME=YAVAB \
  -e BOT_PREFIX=/ \
  -e GUILD_ID=69049503490904900 \
  -e ENBALE_ASSISTANT=0 \
  -e ASSISTANT_CHANNEL_ID=8324890290342908320 \
  -e CLIENT_ID=2094390409-3nv90c3xm9o44c9l9l4ae9dds.apps.googleusercontent.com \
  -e CLIENT_SECRET=DFfg32fDFDFd54FD7yta8AS \
  -e REDIRECT_URI=slk:dsfr:bf:oauth:2.0:ofp \
  -e DISCORD_TOKENS={"access_token":"tl03.SFDGFGD697SGD_FDFgfGG-hHd889fgfSGHDn48rjnV--BNH9JufBb.DNht0468dYBTVS-g8bB","refresh_token":"1//eko43F-RE5GBnhg_fjvgb0v9mretv95DSGer446DFHGGfhjh33Gg4GGFG333hhgid8","scope":"https://www.googleapis.com/auth/assistant-sdk-prototype","token_type":"Bearer","expiry_date":1694202150748} \
  -v /path/to/filesave/directory:/usr/src/app \
  --restart unless-stopped \
  ghcr.io/archgryphon9362/yavab
```

## Parameters
Don't forget to change these, specifically the ones without the defaults, and if you don't plan on using the (currently broken) Google Assistant, you don't need any environment variables that are described after the `ENABLE_ASSISTANT` variable. So the only things you really need to set up are `BOT_TOKEN`, `BOT_NAME`, `BOT_PREFIX`, `GUILD_ID`, aand `ENABLE_ASSISTANT`, of which the only required variables are `BOT_TOKEN`, and `GUILD_ID`.
Parameter|Usage|Default Value
:-:|:-|:-:
`-e BOT_TOKEN`|The bot token provided by discord|`undefined`
`-e BOT_NAME`|The name that the bot calls itself|`YAVAB`
`-e BOT_PREFIX`|The prefix that the bot says it uses|`/`
`-e GUILD_ID`|The id of the server the bot will be running in, yes, currently we only support 1 server|`undefined`
`-e ENBALE_ASSISTANT`|Whether to enable the Google Assistant, takes in a value of `1` or `0`, but is currently broken, so don't enable as the bot will crash|`0`
`-e ASSISTANT_CHANNEL_ID`|**Required if you enabled `ENABLE_ASSISTANT`;** The ID of the channel designated for recieving assistant input, set to `0` if you don't want to use it|`undefined`
`-e CLIENT_ID`|**Required if you enabled `ENABLE_ASSISTANT`;** The client ID of the Google Actions application *(in the JSON it provided)*|`undefined`
`-e CLIENT_SECRET`|**Required if you enabled `ENABLE_ASSISTANT`;** The client secret of the Google Actions application *(in the JSON it provided)*|`undefined`
`-e REDIRECT_URI`|**Required if you enabled `ENABLE_ASSISTANT`;** The redirect uri given by the same Google Actions application *(in the JSON it provided)*|`undefined`
`-e DISCORD_TOKENS`|**Required if you enabled `ENABLE_ASSISTANT`;** Create a Google account for use by the bot assistant and get authorization for use with the assistant, after you've done that, paste the entire JSON here|`undefined`
`-v /usr/src/app/persist`|The directory that currently only contains the "deleted messages logs", more things will be stored in here with more updates to the bot, it is written in the format of `<host path>:<container path>` `<host path>` being user-defined and `<container path>` being `/usr/src/app/persist`|`undefined`

![YAVAB Logo](https://github.com/ArchGryphon9362/YAVAB/raw/main/icon/YAVAB.png)